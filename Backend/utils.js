import fetch from 'node-fetch'
import Item from './models/dataItem.js'
import parser from 'xml2json'
import { setInterval } from 'timers'
import fs from 'fs';
import util from 'util';


let alut = [];
let loput = [];
let kulut = [];
const fmiQuery = "http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::multipointcoverage&place=pori&"

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
  try {
    const response = await fetch(`${PRICE_ENDPOINT}?date=${date}&hour=${hour}`);
    const { price } = await response.json();
 

  return price
  } catch (err) {
    console.log(err)
}
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

export async function getInvStatus(){
  try{
  //var resp = await getData("http://192.168.0.3/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DeviceId=1418160&DataCollection=CommonInverterData")
    var resp = await getData("http://192.168.50.96/solar_api/v1/GetInverterRealtimeData.cgi?Scope=System&DataCollection=NowSensorData")
    resp = JSON.parse(resp);
    const power = resp.Body.Data.PAC.Values[1];
    return power
  } catch (err) {
    console.log(err)
  }
}



const stQueries = async () =>{
  try{
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
  } catch(err) {
    console.log(err)
  }
  }

export const startQueries = setInterval(stQueries, 30000);


export function stopQueries(){
  clearInterval(startQueries)
}

async function saveConsumptionData(){

  for (let it = 0; it < alut.length; it++){
    var tt = await Item.updateMany({createdAt: {$gt: alut[it], $lt: loput[it]}}, {kulutus: Number(kulut[it].replace(",", "."))*1000}).exec()

  }
}

const xakseli = () => {
  var ss = Item.find({})//createdAt: {$gt: start, $lt: end}}).exec()
  ss.array.forEach(element => {
  yakseli.push(element.createdAt)
  xakseliTuotto.push(element.tuotto)
});
}

//startQueries();
const readFile = util.promisify(fs.readFile);
function getConsumptionData() {
  return readFile('./kulutus.csv');
}

export const addConsumptionData = () => {
  getConsumptionData().then(data => {
    let dataStr = data.toString();
    let lines = dataStr.split('\n');
    for (let line = 6; line < lines.length; line ++){
      let colValues=  lines[line].split(";") 
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
      console.log(alku, loppu, kulutus);
      alut.push(alku)
      loput.push(loppu)
      kulut.push(kulutus)
      saveConsumptionData()}})

  }
export const fetchData = async (start, end) => {

  var ss = await Item.find({createdAt: {$gt: start, $lt: end}}).exec()
  ss.forEach(element => {
     console.log(element)
  })
  return ss;
}