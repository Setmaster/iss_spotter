const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation} = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP("99.255.159.197",(error, coords)=>{
  if (error) {
    console.log("It didn't work!" , error.message);
    return;
  }

  console.log('It worked! Returned coords:' , coords);
});

fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, issData)=>{
  if (error) {
    console.log("It didn't work!" , error.message);
    return;
  }

  console.log('It worked! Returned ISS data:' , issData);
});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});