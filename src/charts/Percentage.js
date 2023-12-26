import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function Percentage({ seriesValue, labelOption}) {
  const [options, ] = useState({
    chart: {
      height: 250,
      type: 'radialBar',
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: undefined,
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color: undefined,
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: [labelOption],
  });


  const [series, setSeries] = useState([0]);


  useEffect(() => {
    setSeries([seriesValue]);
  }, [seriesValue]);

  return (
    <div className='mb-3' id='chart'>
      <ReactApexChart
        options={options}
        series={series}
        type='radialBar'
        height={250}
      />
    </div>
  );
}

export default Percentage;
