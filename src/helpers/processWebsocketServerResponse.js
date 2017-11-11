const PING_REGEX = /(\d+) ([a-z]+) .+ ([\d.]+): icmp_seq=(\d+) .+ time=([\d.]+) ([a-z]+)/ig;
const TIMEOUT_REGEX = /request timeout .+ icmp_seq (\d+)/ig;

function resetRegexes(...args) {
  args.map(REGEX => REGEX.lastIndex = 0);
}

export function extractPingData(data) {
  resetRegexes(PING_REGEX, TIMEOUT_REGEX);
  const pingData = PING_REGEX.exec(data);
  if (pingData) {
    let [, packetSize, packetSizeRange, destination, sequenceNumber, responseTime, responseTimeRange] = pingData;
    responseTime = parseInt(responseTime, 10);
    sequenceNumber = parseInt(sequenceNumber, 10);
    return { packetSize, packetSizeRange, destination, sequenceNumber, responseTime, responseTimeRange };
  }

  const timeoutData = TIMEOUT_REGEX.exec(data);
  if (timeoutData) {
    let [, sequenceNumber] = timeoutData;
    sequenceNumber = parseInt(sequenceNumber, 10);
    return {responseTime: Infinity, sequenceNumber };
  }
}

export function serializeResponse(payload) {
  try {
    return JSON.parse(payload);
  } catch (e) {
    return payload;
  }
}
