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

const fetchMyIP = function(callback) {
  needle('get', IP_URL, (error, response) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      callback(Error(msg), null);
    } else {
      callback(null, response.body["ip"]);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  needle('get', `${COORD_URL}${ip}`, (error, response) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      callback(Error(msg), null);
    } else if (response.body["success"] === false) {
      const msg = `Success status was false. Server message says: ${response.body["message"]} when fetching for IP ${response.body["ip"]}`;
      callback(Error(msg), null);
    } else {
      callback(null, {
        latitude: response.body["latitude"],
        longitude: response.body["longitude"]
      });
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  needle('get', `${ISS_URL}lat=${coords.latitude}&lon=${coords.longitude}`, (error, response) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${response.body}`;
      callback(Error(msg), null);
    } else if (response.body["message"] !== "success") {
      const msg = `Success status was false. Server message says: ${response.body["message"]} when fetching for coords ${coords}`;
      callback(Error(msg), null);
    } else {
      callback(null, response.body["response"]);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, issData) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, issData);
      });
    });
  });
};

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};