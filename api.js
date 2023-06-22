import {startQueries, stopQueries} from './utils.js'

import {addConsumptionData, fetchData} from './utils.js'
import express from 'express'

const app = express();
const port = 2000;

app.use(express.json())    // <==== parse request body as JSON

app.listen(2000)

app.post('/getdata', async (req, res) => {
    console.log(req.body)
    const alku = req.body[0].alku;
    const loppu = req.body[0].loppu;
    console.log('Fetching data...', alku, loppu)
    const result = await fetchData(new Date(alku), new Date(loppu));
    //console.log(result)
    res.status = 200

    //response.jsonp(JSON.stringify(result))
    res.json(result)  // <==== req.body will be a parsed JSON object

})

app.get('/addconsumption', async (req, res) => {
    //bodyssä file parametriksi?
    console.log('Adding consumptiondata from file')
    addConsumptionData();
    res.status = 200
    res.end()
})

app.get('/startquery', async (req, res) => {
    console.log('Queries started')
    startQueries;
    res.status = 200
    res.end()
})

app.get('/stopquery', (req, res) => {
    console.log('Queries stopped')
    stopQueries();
    res.status = 200
    res.end();


})





const handleRequest = async (request, response) => {

    const { url, method, headers, body } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;
}
  /*  if ((filePath === "/getdata") && (method.toUpperCase() === "POST")) {
        console.log(await JSON.parse(request))


        request = JSON.parse(request)
        //const body = request.data;
        const alku = body.alku;
        const loppu = body.loppu;
        console.log('Fetching data...', alku, loppu)
        const result = await fetchData(new Date('2023-06-15T05:00:00.000Z'), new Date('2023-06-15T17:59:00.000Z'));
        //console.log(result)
        response.statusCode = 200

        //response.jsonp(JSON.stringify(result))
        response.end(JSON.stringify(result));
    }
*/
/*    
    if ((filePath === "/start") && (method.toUpperCase() === "GET")) {
        console.log('Queries started')
        startQueries();
        response.statusCode = 200
        response.end()
    }

    if ((filePath === "/inverter") && (method.toUpperCase() === "POST")) {

        console.log('IN-VERTTER-I');
        console.log(request)
        response.statusCode = 200
        response.end()
    }*/

export default handleRequest