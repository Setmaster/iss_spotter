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
const COORD_URL = "http://ipwho.is/"

const fetchMyIP = function (callback) {
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

const fetchCoordsByIP = function (ip, callback) {
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
}

module.exports = {fetchMyIP, fetchCoordsByIP};