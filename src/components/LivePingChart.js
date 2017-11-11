import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

const X_AXIS_GAP = 25;
const X_AXIS_OFFSET = 150;

class LivePingChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: Math.floor((window.innerWidth - X_AXIS_OFFSET)/X_AXIS_GAP)
    }
  }
  lastNPings = () => this.props.pings.slice(-1 * this.state.limit)
  chartData = () => {
    return {
      labels: this.lastNPings().map((response) => response.sequenceNumber),
      datasets: [{
          label: 'Ping Requests',
          data: this.lastNPings().map((response) => response.responseTime),
          backgroundColor: ['rgba(98, 123, 157, 0.5)'],
          borderColor: ['#627B9D'],
          borderWidth: 1
      }]
    }
  }
  chartOptions = () => {
    return {
      animation: {
        duration: 0
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (ms)'
          },
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Sequence Number'
          }
        }]
      }
    }
  }

  render() {
    return (
      <Line data={this.chartData()} options={this.chartOptions()}/>
    );
  };
}

export default LivePingChart;