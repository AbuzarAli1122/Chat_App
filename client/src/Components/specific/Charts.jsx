import React from 'react'
import {Line, Doughnut} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend, 
  Title  
} from 'chart.js'
import { Lightorange, Lightpurple, orange, purple } from '../../constants/color';
import { getLast7Days } from '../../lib/features';

ChartJS.register(
CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Title
);

 const labels = getLast7Days();
const lineChartOptions = {
    responsive : true,
    plugins:{
        legend:{
            display: false,
        },
        title:{
            display: false,
        },
    },

    scales:{
        x:{
            grid:{
                display: false,
            },
        },
        y:{
            beginAtZero : true,
             grid:{
                display: false,
            },
        },
    },

};

const LineChart = ({value = []}) => {

    const data = {
        labels,
        datasets:[
        {
            data:value,
            label:'Revenue 2',
            fill: true,
            backgroundColor: Lightpurple,
            borderColor: purple,
        }
    ]
    }

  return <Line data={data} options={lineChartOptions}/>
}


const DoughnutChartOptions = {
    responsive: true,
    plugins:{
        legend:{
            display: false,
        },
    },
    cutout:120,
}
const DoughnutChart = ({value=[],labels =[]}) => {

    const data = {
        labels,
        datasets:[
        {
            data:value,
            backgroundColor: [Lightpurple, Lightorange],
            borderColor: [purple,orange],
            hoverBackgroundColor: [purple, orange],
            offset: 30
        }
    ]
    }

  return <Doughnut style={{ zIndex:10}} data={data} options={DoughnutChartOptions}/>
}

export {LineChart, DoughnutChart}