var request = require('request');
var csvtojson = require('csvtojson');
var pLimit = require('p-limit');

const limit = pLimit(10);
const constants = require('./config/index');

execute();
async function execute() {
    const searchLocs = await csvtojson().fromFile('./search_locs.csv');
    reqs = [];
    searchLocs.forEach(function (currentLoc) {
        reqs.push(limit(() => getEvents(currentLoc)));
    });
    try {
        var responses = await Promise.all(reqs);
        console.log("DONE: " + responses.length);
    } catch (error) {
        throw error;
    }
}

function getEvents(locInfo) {
    var username = constants.SEATGEEK_API.CLIENT_ID;
    var password = constants.SEATGEEK_API.SECRET;
    const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: 'https://db_user.seatgeek.com/2/events',
            qs: {
                lat: locInfo.lat,
                lon: locInfo.lng,
                per_page: '5000'
        ***REMOVED***
            json: true,
            timeout: 30000,
            headers: {
                'authorization': auth,
                'Connection': 'Keep-Alive',
                'Cache-Control': 'no-store'
    ***REMOVED***
***REMOVED***;

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
    ***REMOVED*** else {
                resolve(body);
    ***REMOVED***
***REMOVED***);
    });
}