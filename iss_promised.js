/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const needle = require('needle');
const IP_URL = "https://api.ipify.org?format=json";
const COORD_URL = "http://ipwho.is/";
const ISS_URL = "https://iss-flyover.herokuapp.com/json/?"; //lat=<value>&lon=<value>

const fetchMyIP = function() {
  return needle('get', IP_URL)
    .then((response) => {
      return response.body.ip;
    });
};

const fetchCoordsByIP = function(ip) {
  return needle('get', `${COORD_URL}${ip}`)
    .then((response) => {
      return {
        latitude: response.body["latitude"],
        longitude: response.body["longitude"]
      };
    });
};

const fetchISSFlyOverTimes = function(coords) {
  return needle('get', `${ISS_URL}lat=${coords.latitude}&lon=${coords.longitude}`)
    .then((response) => {
      return response.body["response"];
    });
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip)=> fetchCoordsByIP(ip))
    .then((coords)=>fetchISSFlyOverTimes(coords))
    .then((passTimes)=> passTimes)
    .catch((error)=> {
      console.error("It didn't work: ", error.message);
      process.exit(-1);
    });
};

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};