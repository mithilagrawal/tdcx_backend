const mongoose = require('mongoose');
const Tasks = mongoose.model('tasks');

const isTaskExist = async (e = {}) => {
    const findCond = {};
    if ('id' in e) { findCond['_id'] = mongoose.Types.ObjectId(e.id); };
    if ('name' in e) { findCond['name'] = e.name };
    if ('completed' in e) { findCond['completed'] = e.completed }
    if ('authName' in e) { findCond['authName'] = e.authName }

    const taskData = await Tasks.findOne(findCond).lean();

    if (!taskData) {
        return {
            status: false
        }
    }

    return {
        status: true,
        data: taskData
    }
}


module.exports = {
    isTaskExist
}