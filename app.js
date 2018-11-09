var request = require('request');
var csvtojson = require('csvtojson');
var pLimit = require('p-limit');

const constants = require('./config/index')
const limit = pLimit(100);

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
    Promise.all(reqs)
        .catch(function (error) {
            throw error;
***REMOVED***).then(function (responses) {
            console.log(responses.length);
***REMOVED***);
}

function getEvents(zipCodeInfo) {
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
            timeout: 15000,
            headers: {
                authorization: 'Basic TVRNNE5qZzJPVFY4TVRVME1UY3pPVFEwTlM0eE53OjVjMzJlYzczYTg4YjgxZWNlYjMxYjU1NGE0YjgyOWY2M2Q4M2ZlNTMwMmY2MjgzOWQ1MzcyYWViNDlmZmM3YzE='
    ***REMOVED***
***REMOVED***;

        request(options, function (error, response, body) {
            console.log("PERCENT DONE: " + (100 * (currReq++) / totalReqs).toFixed(4) + "%");
            if (error) {
                reject(error)
    ***REMOVED*** else {
                resolve(body);
    ***REMOVED***
***REMOVED***);
    });
}