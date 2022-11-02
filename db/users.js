var mongoose = require('mongoose');

var users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    }
});
mongoose.model('users', users);
