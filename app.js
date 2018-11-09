var request = require('request');
var csvtojson = require('csvtojson');
var pLimit = require('p-limit');

const constants = require('./config/index')
const limit = pLimit(200);

var currReq = 0;
var totalReqs;

execute();
async function execute() {
    const zipCodes = await csvtojson().fromFile('./zipcodes.csv');
    reqs = [];
    zipCodes.forEach(function (currentZipCode) {
        reqs.push(limit(() => getEvents(currentZipCode)));
    });
    totalReqs = reqs.length;
    var currReqNum = 0;
    while (currReqNum < reqs.length) {
        Promise.all(reqs.slice(currReqNum, Math.min(currReqNum + 200, reqs.length)))
            .catch(function (error) {
                throw error;
    ***REMOVED***).then(function (responses) {
                console.log(responses.length);
    ***REMOVED***);
        currReqNum += 200;
    }
    
}

function getEvents(zipCodeInfo) {
    var username = constants.SEATGEEK_API.CLIENT_ID;
    var password = constants.SEATGEEK_API.SECRET;
    const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: 'https://db_user.seatgeek.com/2/events',
            qs: {
                lat: zipCodeInfo.lat,
                lon: zipCodeInfo.lng,
                per_page: '5000'
        ***REMOVED***
            json: true,
            timeout: 30000,
            headers: {
                'authorization': auth,
                'Cache-Control': 'no-store'
    ***REMOVED***
***REMOVED***;

        request(options, function (error, response, body) {
            console.log("PERCENT DONE: " + (100 * (currReq++) / totalReqs).toFixed(4) + "% ||  " + currReq + " OUT OF " + totalReqs);
            if (error) {
                reject(error)
    ***REMOVED*** else {
                resolve(body);
    ***REMOVED***
***REMOVED***);
    });
}