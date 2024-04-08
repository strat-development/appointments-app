import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
interface StatisticInfoProps{
  serviceCountMap:Map<number,number>;
  serviceNameMap:Map<number,string>;
}


export function PieChart({serviceCountMap,serviceNameMap}:StatisticInfoProps) {
  const services: string[] = [];
  const countServices: number[]=[];
  serviceCountMap.forEach((value,key)=>{
    let serviceName=serviceNameMap.get(key);

    if (serviceName !== undefined) {
      services.push(serviceName);
      countServices.push(value);
    }
  })

  
  const data = {
    labels: services,
    datasets: [
      {
        label: '# of Votes',
        data: countServices,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} />;
}
