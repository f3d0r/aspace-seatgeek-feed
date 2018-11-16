//LOCAL IMPORTS
var request = require('request');
var csvtojson = require('csvtojson');
var pLimit = require('p-limit');
var moment = require('moment');
var Logger = require('logdna');
var ip = require('ip');
var os = require('os');

//LOCAL IMPORTS
var sql = require('./db/sqlActions');
var misc = require('./misc/index');

//CONSTANTS
const limit = pLimit(10);
const constants = require('./config/index');
const searchCuttoffHours = process.env.SEARCH_CUTOFF_HOURS;

//LOGGING SET UP
var logger = Logger.setupDefaultLogger(process.env.LOG_DNA_API_KEY, {
    hostname: os.hostname(),
    ip: ip.address(),
    app: process.env.APP_NAME,
    env: process.env.ENV_NAME,
    index_meta: true,
    tags: process.env.APP_NAME + ',' + process.env.ENV_NAME + ',' + os.hostname()
});

console.log = function (d, log = true) {
    process.stdout.write(d + '\n');
    if (log)
        logger.log(d);
};
logger.write = function (d) {
    console.log(d);
};

//MAIN SCRIPT
execute();

async function execute() {
    const searchLocs = await csvtojson().fromFile('./search_locs.csv');
    reqs = [];
    searchLocs.forEach(function (currentLoc) {
        reqs.push(limit(() => getEvents(currentLoc)));
    });
    console.log("LOADING - SEARCH LOCATIONS #          : " + reqs.length);
    console.log("LOADING - SEARCH UPCOMING HOURS #     : " + searchCuttoffHours);

    var responses = await Promise.all(reqs);
    var parsedResults = await parseResults(responses);
    console.log("SUCCESS - RECIEVED UNIQUE EVENTS");

    await sql.runRaw("DELETE FROM `seatgeek_events`;");
    console.log("SUCCESS - EMPTIED SEATGEEK_EVENTS DATABASE");

    await sql.addObjects('seatgeek_events', ['id', 'pretty_title', 'city', 'lng', 'lat', 'date'], parsedResults);

    console.log("SUCCESS - ADDED NEW SEATGEEK EVENTS # : " + parsedResults.length);
    await misc.sleep(5000);

    process.exit();
}

function getEvents(locInfo) {
    var username = constants.SEATGEEK_API.CLIENT_ID;
    var password = constants.SEATGEEK_API.SECRET;
    const auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: 'https://api.seatgeek.com/2/events',
            qs: {
                lat: locInfo.lat,
                lon: locInfo.lng,
                per_page: '5000'
            },
            json: true,
            timeout: 30000,
            headers: {
                'authorization': auth,
                'Connection': 'Keep-Alive',
                'Cache-Control': 'no-store'
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

async function parseResults(rawResults) {
    var results = [];
    var ids = [];
    for (var index = 0; index < rawResults.length; index++) {
        var currentResponse = rawResults[index].events;
        for (var eventIndex = 0; eventIndex < currentResponse.length; eventIndex++) {
            var currentResult = currentResponse[eventIndex];
            var location = currentResult.venue.location;
            var currentImport = [currentResult.id, currentResult.short_title, currentResult.venue.city, location.lon, location.lat, currentResult.datetime_utc];
            var isComingUp = isInLessThan48Hours(currentResult.datetime_utc);
            if (ids.indexOf(currentResult.id) == -1 && isComingUp) {
                results.push(currentImport);
                ids.push(currentResult.id);
            }
        }
    }
    return results;
}

function isInLessThan48Hours(futureTime) {
    var now = moment.utc();
    futureTime = moment.utc(futureTime);
    var diffHours = futureTime.diff(now, 'hours');
    return diffHours <= searchCuttoffHours;
}