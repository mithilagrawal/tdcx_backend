const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error : ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through : ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('app restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app termination', function () {
        process.exit(0);
    });
});

require('./taskList');
require('./users');
