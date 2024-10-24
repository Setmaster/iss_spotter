const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation} = require('./iss_promised');

fetchMyIP()
  .then((ip)=> fetchCoordsByIP(ip))
  .then((coords)=>fetchISSFlyOverTimes(coords))
  .then((response)=> console.log(response));

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes)=> {
    printPassTimes(passTimes);
  });