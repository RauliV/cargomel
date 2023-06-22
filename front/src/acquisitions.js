import Chart from 'chart.js/auto'
import { getAquisitionsByYear } from './api'
import {addConsumptionData, fetchData} from '../../utils.js'


  

(async function() {
    const options = {
        method: "POST",
        body: {
            "alku": "2023-06-15T05:00:00.000Z",
            "loppu": "2023-06-15T17:59:00.000Z"
          },
        headers: {

            "Connection": "keep-alive",
            "Transfer-Encoding": "chunked",      
            "Content-Type": "application/json",
            "accept": "application/json",
            "Acces-Control-Allow-Origin": "*",
        }
          //"Access-Control-Allow-Headers": "*",
          //'www-authenticate': 'Basic',
          //"authorization": auth,
        }

  //const data = await getAquisitionsByYear();
  //const labels = await fetch('http://127.0.0.1:2000/getdata', options )
  const result = await fetchData("2023-06-15T05:00:00.000Z", "2023-06-15T17:59:00.000Z");

  console.log(result)
  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'line',
      options: {
        animation: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      },
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
})();
