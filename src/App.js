import React, { Component } from 'react';
import Websocket from 'react-websocket';
import moment from 'moment';
import './App.css';

import { extractPingData, serializeResponse } from './helpers/processWebsocketServerResponse';
import readableTime from './helpers/readableTime';

import LivePingChart from './components/LivePingChart';
import StatItem from './components/StatItem';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pingHost: 'Connecting...',
      pingResponses: [],
      totalTimeSpentBetweenPings: 0,
      lastPingReceivedAt: 0,
      maxPing: null,
      minPing: null,
      smallLimitForAvg: 120,
      bigLimitForAvg: 600
    };
  }

  goodPings = () => this.state.pingResponses.filter(response => Number.isFinite(response.responseTime));
  pingLoss = () => `${(100 - (this.goodPings().length/this.state.pingResponses.length * 100) || 0).toFixed(2)}%`;
  avgPing = (limit) => {
    limit = Math.min(limit, this.state.pingResponses.length);
    return (
      this.state.pingResponses
      .slice(-1 * limit)
      .filter(response => Number.isFinite(response.responseTime))
      .map(response => response.responseTime)
      .reduce((a = 0,b = 0) => a+b, 0) / limit
    ).toFixed(2);
  }

  updatePingTime() {
    const now = new Date().getTime();
    if (!this.state.lastPingReceivedAt) {
      this.setState({ lastPingReceivedAt: now })
    }
    const lastPingTime = this.state.lastPingReceivedAt;
    const totalTimeSpentBetweenPings = this.state.totalTimeSpentBetweenPings + now - lastPingTime;

    this.setState({ lastPingReceivedAt: now, totalTimeSpentBetweenPings })
  }
  analyzePingData(pingData) {
    let { maxPing, minPing } = this.state;
    if (!maxPing && Number.isFinite(pingData.responseTime)) maxPing = pingData.responseTime;
    if (!minPing) minPing = pingData.responseTime;

    if (pingData.responseTime > maxPing && Number.isFinite(pingData.responseTime)) maxPing = pingData.responseTime;
    if (pingData.responseTime < minPing) minPing = pingData.responseTime;

    this.setState({ maxPing, minPing });
  }
  handleResponse(payload) {
    const { data, type } = serializeResponse(payload);

    switch(type) {
      case 'ping_connection':
        this.setState({ pingHost: data });
        break;

      case 'ping_response':
        this.updatePingTime();

        const pingResponses = this.state.pingResponses.slice();
        const pingData = extractPingData(data);
        pingResponses.push(pingData);
        this.analyzePingData(pingData);

        this.setState({ pingResponses });
        break;

      default: return;
    }
  }
  websocketUrl = () => {
    try {
      if (window.location.hostname === 'localhost') return `ws://${window.location.hostname}:8888/`;
      else return `ws://${window.location.search.split('=')[1]}/`;
    } catch (e) {
      alert('WebSocket URL could not be obtained. Use `?ws=<websocket url>` to specify WebSocket connection.');
    }
  }
  render() {
    return (
      <div className="app">
      <Websocket
        url={this.websocketUrl()}
        onOpen={() => this.updatePingTime()}
        onMessage={(payload) => this.handleResponse(payload)}
      />
        <div className="top-panel">
          <div className="about-me">
            <StatItem content="Ping-Stats" subtitle={<a href="https://github.com/jayantbh">by @jayantbh</a>} />
          </div>
          <div className="quick-stats">
            <div className="quick-stats-content">
              <StatItem title="Pinging host" content={this.state.pingHost} />
              <StatItem title="Time spent pinging" content={readableTime(this.state.totalTimeSpentBetweenPings)} />
              <StatItem title="Last ping received at" content={moment(this.state.lastPingReceivedAt).format('h:mm:ss a')} />
              <StatItem title="Ping loss" content={this.pingLoss()} />
              <StatItem title="Number of requests made" content={this.state.pingResponses.length} />
              <StatItem title="Ping range (ms)" content={`${this.state.minPing} - ${this.state.maxPing}`} />
              <StatItem title="Average ping (last 120 requests/~2 min)" content={this.avgPing(this.state.smallLimitForAvg)} />
              <StatItem title="Average ping (last 600 requests/~10 min)" content={this.avgPing(this.state.bigLimitForAvg)} />
            </div>
          </div>
        </div>
        <div className="bottom-panel">
          <LivePingChart pings={this.state.pingResponses} />
        </div>
      </div>
    );
  }
}

export default App;
