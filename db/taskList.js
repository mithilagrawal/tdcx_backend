var mongoose = require('mongoose');

var tasks = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    authName: {
        type: String,
        required: true
    },
});
mongoose.model('tasks', tasks);
