import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'react-bootstrap';

function PieChart({
  seriesValues,
  labelsValue,
  colorsValue,
  width,
  chartTitle,
  className,
}) {
  const options = {
    labels: labelsValue,
    colors: colorsValue,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const series = seriesValues;
  const size = width;
  const title = chartTitle;
  return (
        <Card className={`mb-3 ${className}`}>
          <Card.Header>{title}</Card.Header>
          <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ReactApexChart
              options={options}
              series={series}
              type='pie'
              width={size}
            />
          </Card.Body>
        </Card>
  );
}

export default PieChart;
