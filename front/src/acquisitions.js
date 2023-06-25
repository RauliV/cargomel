import Chart from 'chart.js/auto'
//import Lightpick from 'lightpick'
//import { getAquisitionsByYear } from './api'
//import Item from '../../models/dataItem.js'
import datepicker from 'js-datepicker'

var yakseli = []
var xakseliTuotto = []
var xakseliLampo = []
var xakseliHinta = []
var xakseliKulutus = []


/*
var ss = Item.find({})//createdAt: {$gt: start, $lt: end}}).exec()
ss.array.forEach(element => {
  yakseli.push(element.createdAt)
  xakseliTuotto.push(element.tuotto)
});
*/

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];

(async function() {
    const options = {
        method: "POST",
      //  body: {
       //     "alku": "2023-06-15T05:00:00.000Z",
         //   "loppu": "2023-07-15T17:59:00.000Z"
          //},
        headers: {

            "Connection": "keep-alive",
            "Transfer-Encoding": "chunked",      
            "Content-Type": "application/json",
            "accept": "application/json",
            "Acces-Control-Allow-Origin": "*",   
            "Access-Control-Allow-Headers": "*",
          //'www-authenticate': 'Basic',
          //"authorization": auth,
        }
        }

  const getData  = async (url) => {
    const res = await fetch(url, options);
    const data = await res.text()
    return data
  }

  const modifyValue = async (startValue) => {
    const replaced = await startValue.replace(",", ".")
    const modifiedValue = Number(replaced)
    return modifiedValue;
  }

  function datepicker() {
    document.getElementById('DatePicker').datepicker();
    };
  //document.getElementById('DatePicker')
/*
  new Lightpick({
    field: document.getElementById('myDatepicker'),
    onSelect: function(date){
        document.getElementById('result-1').innerHTML = date.format('Do MMMM YYYY');
    }
});*/

  var result = await getData('http://127.0.0.1:2000/getdata')
  result = JSON.parse(result);
  for(var i in result) {
    xakseliTuotto.push(result[i].tuotto)
    xakseliLampo.push(result[i].lampo)
    xakseliHinta.push(result[i].hinta)
    xakseliKulutus.push(result[i].kulutus);
    console.log(result[i].kulutus)
    yakseli.push(result[i].createdAt)
  }

  //console.log(xakseliTuotto)
  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'line',
      scales: {
        y: {
          ticks: {
            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
            callback: function(val, index) {
              // Hide every 2nd tick label
              return index % 3 === 0 ? this.getLabelForValue(val) : 'hhh';
            },
          },
          // The axis for this scale is determined from the first letter of the id as `'x'`
          // It is recommended to specify `position` and / or `axis` explicitly.
          type: 'time',
        },
      },
      options: {
        tension: 2,
        borderWidth: 1,
        pointRadius: 0,
        animation: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: false
          }
        }
      },
      data: {
        labels: yakseli,//data.map(row => row.year),
        datasets: [
          {
            label: 'Tuotto',
            data: xakseliTuotto// data.map(row => row.count)
          },
          {
            label: 'Hinta',
            data: xakseliHinta,
          },
          {
            label: 'Lämpötila',
            data: xakseliLampo
          },
          {
            label: 'Kulutus',
            data: xakseliKulutus
          }
        ]
      }
    }
  );
})();
