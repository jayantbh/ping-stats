import React, { Component } from 'react';
import Websocket from 'react-websocket';
import moment from 'moment';
import './App.css';

import { extractPingData, serializeResponse } from './helpers/processWebsocketServerResponse';
import readableTime from './helpers/readableTime';

import LivePingChart from './components/LivePingChart';
import StatItem from './components/StatItem';

Number.isInfinite = function(n) { return n === Infinity }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pingResponses: [],
      totalTimeSpentBetweenPings: 0,
      lastPingReceivedAt: 0,
      maxPing: null,
      minPing: null
    };
  }

  goodPings = () => this.state.pingResponses.filter((response) => Number.isFinite(response.responseTime));
  goodPingsWithMutedBadPings = () => this.state.pingResponses.map((response) => Number.isFinite(response.responseTime) ? response : null);
  badPings = () => this.state.pingResponses.filter((response) => Number.isInfinite(response.responseTime));
  pingLoss = () => `${(100 - (this.goodPings().length/this.state.pingResponses.length * 100) || 0).toFixed(2)}%`;

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
    
    if (type !== 'ping_response') return;
    this.updatePingTime();

    const pingResponses = this.state.pingResponses.slice();
    const pingData = extractPingData(data);
    pingResponses.push(pingData);
    this.analyzePingData(pingData);

    this.setState({ pingResponses });
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
              <StatItem title="Time spent pinging" content={readableTime(this.state.totalTimeSpentBetweenPings)} />
              <StatItem title="Last ping received at" content={moment(this.state.lastPingReceivedAt).format('h:mm:ss a')} />
              <StatItem title="Ping loss" content={this.pingLoss()} />
              <StatItem title="Number of requests made" content={this.state.pingResponses.length} />
              <StatItem title="Ping range (ms)" content={`${this.state.minPing} - ${this.state.maxPing}`} />
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
