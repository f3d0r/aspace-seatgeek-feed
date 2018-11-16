var db = require('./db');

***REMOVED***
    addObjects: function (database, keys, objects) {
        return new Promise(function (resolveAll, rejectAll) {
            var reqs = [];
            if (typeof objects != 'undefined' && objects.length > 0) {
                db.getPools().forEach(function (currentPool) {
                    reqs.push(new Promise(function (resolve, reject) {
                        var sql = `INSERT INTO \`${database}\` (\`` + keys[0] + `\``;
                        for (index = 1; index < keys.length; index++) {
                            sql += ', `' + keys[index] + '` ';
                ***REMOVED***
                        sql += ') VALUES ?; ';
                        currentPool.query(sql, [objects], function (error, results, fields) {
                            if (error)
                                reject(error);
                            else
                                resolve(results);
                ***REMOVED***);
            ***REMOVED***));
        ***REMOVED***);
    ***REMOVED***
            Promise.all(reqs)
                .then(function (responses) {
                    resolveAll(responses);
        ***REMOVED***)
                .catch(function (error) {
                    rejectAll(error);
        ***REMOVED***);
***REMOVED***);
***REMOVED***
    runRaw: function (sql, singleDB = false) {
        return new Promise(function (resolveAll, rejectAll) {
            var reqs = [];
            if (sql != "" && typeof sql != 'undefined') {
                db.getPools(singleDB).forEach(function (currentPool) {
                    reqs.push(new Promise(function (resolve, reject) {
                        currentPool.query(sql, function (error, rows) {
                            if (error)
                                reject(error);
                            else
                                resolve(rows);
                ***REMOVED***);
            ***REMOVED***));
        ***REMOVED***);
    ***REMOVED***
            Promise.all(reqs)
                .then(function (response) {
                    resolveAll(response);
        ***REMOVED***).catch(function (error) {
                    rejectAll(error);
        ***REMOVED***);
***REMOVED***);
    }
***REMOVED***
