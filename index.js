import fetch from 'node-fetch'
import Item from './models/dataItem.js'
import parser from 'xml2json'
import { setInterval } from 'timers'
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

let alut = [];
let loput = [];
let kulut = [];
const fmiQuery = "http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::multipointcoverage&place=pori&"
const PORT = 3000;

const options = {
  method: "GET",
  headers: {
    "accept": "application/json"
  }
}
const getData  = async (url) => {
  const res = await fetch(url, options);
  const data = await res.text()
  return data
}


async function getPrice(){
  const PRICE_ENDPOINT = 'https://api.porssisahko.net/v1/price.json';

  const dateAndTimeNow = new Date();
  const date = dateAndTimeNow.toISOString().split('T')[0];
  const hour = dateAndTimeNow.getHours();

  const response = await fetch(`${PRICE_ENDPOINT}?date=${date}&hour=${hour}`);
  const { price } = await response.json();

  return price
}


async function getWeather(){

  const xmlData =  await getData(fmiQuery);
  const jsonData = JSON.parse(parser.toJson(xmlData))
  const root = jsonData[Object.keys(jsonData)[0]];
  const TS = root['timeStamp']
  let result = root['wfs:member']["omso:GridSeriesObservation"]["om:result"]["gmlcov:MultiPointCoverage"]["gml:rangeSet"]["gml:DataBlock"]["gml:doubleOrNilReasonTupleList"]
  const valueArray = result.split('\n');
  const fixedArray = valueArray[1].split(' ');
  let finalArray = [];
  for (let part in fixedArray){
    let value = fixedArray[part];
    if (fixedArray[part] !== '')
      finalArray.push(value)
  }


  const [
    Pressure, 
    GeopHeight,
    Temperature, 
    DewPoint, 
    Humidity, 
    WindDirection,
    WindSpeedMS, 
    WindUMS,
    WindVMS,
    PrecipitationAmount,
    TotalCloudCover,
    LowCloudCover,
    MediumCloudCover,
    HighCloudCover,
    RadiationGlobal,
    RadiationGlobalAccumulation,
    RadiationNetSurfaceLWAccumulation,
    RadiationNetSurfaceSWAccumulation,
    RadiationSWAccumulation,
    Visibility,
    WindGust] = finalArray;

    const weatherObject = {
      "Pressure": Pressure, 
      "GeopHeight": GeopHeight,
      "Temperature": Temperature, 
      "DewPoint": DewPoint, 
      "Humidity": Humidity, 
      "WindDirection": WindDirection,
    }

    return weatherObject;

}

async function getInvStatus(){
  
  //var resp = await getData("http://192.168.0.3/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DeviceId=1418160&DataCollection=CommonInverterData")
  var resp = await getData("http://192.168.0.3/solar_api/v1/GetInverterRealtimeData.cgi?Scope=System&DataCollection=NowSensorData")
  resp = JSON.parse(resp);
  const power = resp.Body.Data.PAC.Values[1];
  return power
}
function startQueries(){
  setInterval(async () => {
    const weather = await getWeather()
    const temp = weather.Temperature
    const yiel = await getInvStatus() 
    const price =  await getPrice()

    var se = await Item.create({tuotto:yiel, lampo:temp, hinta:price})

    console.log('Lämpötila: ', temp, '°C');
    console.log('Tuotto:', yiel, 'W');  
    console.log('Hinta: ', price, 'snt /(kW/h)');
    const result = yiel*price/100000
    console.log('Tuottoarvo/h: ', Math.round(result*100)/100, '€')
  },5000);
}


async function readConsumptionData(){
  
  const lineReader = readline.createInterface({
    input: fs.createReadStream('./kulutus.csv')
  });
  
  let lineno = 0;

  await lineReader.on('line', async function (line) {
      lineno++
      //console.log(line)
      if (lineno > 6){
        let colValues=  line.split(";") 
        const paivays = colValues[0].split('.')
        const vuosi = paivays[2]
        var kk = paivays[1]
        if (kk.length < 2){
          kk = '0' + kk
        }
        var pv = paivays[0]
        if (pv.length < 2){
          pv = '0' + kk
        }
        const date = vuosi+'-'+ kk + '-' + pv + 'T'
        const alku = new Date (date+colValues[1])
        const loppu = new Date (date + colValues[2])
        const kulutus = colValues[3];
        alut.push(alku)
        loput.push(loppu)
        kulut.push(kulutus)
      }
    }


  )

 lineReader.on('close', () => {
  console.log('Done reading file');
 }); 

 return alut;

} 

async function saveConsumptionData(){
        //console.log(alku.toString(), loppu, kulutus);
        //  createdAt: 2023-06-14T21:32:45.532Z,
        for (let it = 0; it < alut.length; it++){
          var tt = await Item.find({createdAt: {$gt: alku, $lt: loppu}}).exec()
          console.log('alku: ', alut[it], '\nloppu:', loput[it])
          tt.forEach(element => {
            console.log(element.createdAt)
          });

        }
  

}
  /*

        //console.log(await Item.find({createdAt: {$gt: alku}, createdAt: {$lt: loppu}}).exec())
        //for each items {
      //element:kulutus = kulutus
      }
       
  });*///read file 




//await Item.find({hinta: 5})// && (timeStamp <= loppu)})

startQueries();
//await readConsumptionData()
// Connect to MongoDB
//mongoose.connect('mongo-db:/data/db:27017', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://mongo-db/data/db:27017', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://127.0.0.1:27017/fronius', { useNewUrlParser: true, useUnifiedTopology: true });
//var ss = Item.create();
/*
var ss = await Item.find({})
ss.forEach(element => {
  console.log(element)
}); */
// Confirm that the connection has been established
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Handle any connection errors
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB', err);
});

/*

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});*/

