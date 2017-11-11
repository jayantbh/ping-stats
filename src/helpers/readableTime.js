export default function readableTime(time) {
    let seconds, minutes, hours, days;
    const milliseconds = time;
  
    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    days = Math.floor(hours / 24);
  
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
  
    return `${days ? days + 'd ' : ''}${hours ? hours + 'h ' : ''}${minutes ? minutes + 'm ' : ''}${seconds ? seconds + 's ' : ''}`;
  }