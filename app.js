var request = require('request');
var csvtojson = require('csvtojson');

const constants = require('./config/index')
execute();
async function execute() {
    const zipCodes = await csvtojson().fromFile('./zipcodes.csv');
    reqs = [];
    zipCodes.forEach(function (currentZipCode) {
        reqs.push(getEvents(currentZipCode));
    });
    totalReqs = reqs.length;
    var currReqNum = 0;
    var batchNum = 1;
    while (currReqNum < reqs.length) {
        try {
            console.log("STARTING BATCH NUM #" + batchNum);
            var responses = await Promise.all(reqs.slice(currReqNum, Math.min(currReqNum + 200, reqs.length)));
            console.log("FINISHED BATCH NUM #" + batchNum++);
            currReqNum += 200;
***REMOVED*** catch (error) {
            throw error;
***REMOVED***
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
            if (error) {
                console.log("HERE!");
                reject(error)
    ***REMOVED*** else {
                resolve(body);
    ***REMOVED***
***REMOVED***);
    });
}