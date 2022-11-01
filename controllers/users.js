const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");
const { users } = require('../records/records');

//array that contain task data
const taskDataArray = [];


const login = async (req, res) => {

    //validate the name and apiKey
    const user = users.find(item => (item.name == req.body.name) && (item.apiKey == req.body.apiKey));

    if (!user) {
        return res.status(401).json({
            msg: 'Authorization information is missing or invalid.'
        });
    }

    //generate the token
    const token = jwt.sign({ name: user.name }, JWT_SECRET_KEY);
    return res.status(200).json(
        {
            token: {
                name: user.name,
                token
            },
            "image": "/images/profile.jpg"
        }
    );
}

const dashboard = async (req, res) => {

    //generate the response data that needed for dashboard
    const resData = {
        "tasksCompleted": taskDataArray.filter(item => (item.authName == req.authName) && item?.completed).length,
        "totalTasks": taskDataArray.filter(item => (item.authName == req.authName)).length,
        "latestTasks": taskDataArray.slice(-3).filter(item => (item.authName == req.authName))
    };

    return res.status(200).json(resData)
}

const createTasks = async (req, res) => {

    //check existance of name in body of the request
    if (!('name' in req.body) || !req.body.name) {
        return res.status(400).json({
            msg: 'Bad Request.Task details is missing or didn\'t have a name attribute.'
        });
    }

    //check is task name already exist into the database
    if (taskDataArray.find(item => ((item.name == req.body.name.trim()) && (item.authName == req.authName)))) {
        return res.status(403).json({
            msg: `${req.body.name} already exist`
        });
    }

    //create the entry into the task record
    taskDataArray.push({
        id: (Math.random() + 1).toString(36).substring(7),
        name: req.body.name.trim(),
        completed: false,
        authName: req.authName
    });

    return res.status(200).json({
        msg: 'OK'
    });
}

const getTasks = async (req, res) => {

    //get all the task
    return res.status(200).json(taskDataArray.filter(item => item.authName == req.authName).map(item => ({
        id: item.id,
        name: item.name,
        completed: item.completed
    })));
}

const editTask = async (req, res) => {

    //validate the id into the params
    if (!('id' in req.params) || !req.params.id) {
        return res.status(400).json({
            msg: 'task id is requred'
        });
    }

    //validate the required data that need to edit the info
    if ((!('name' in req.body) || !req.body.name) && (!('completed' in req.body) || ([false, true].indexOf(req.body.completed) <= -1))) {
        return res.status(400).json({
            msg: 'Bad Request.Task details is missing or didn\'t have a name attribute.'
        });
    }

    //fetch the index of the data
    const taskDataIndex = taskDataArray.findIndex(item => ((item.id == req.params.id) && (item.authName == req.authName)));
    if (taskDataIndex < 0) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found.'
        });
    }

    //if name need to edit then check the requested name is already exist into the record or not
    if ('name' in req.body) {
        const nameData = taskDataArray.find(item => ((item.name == req.body.name) && (item.authName == req.authName)));
        if (nameData && (taskDataArray[taskDataIndex].id != nameData.id)) {
            return res.status(403).json({
                msg: `${req.body.name} already exist`
            });
        }
        //edit the name into the record
        taskDataArray[taskDataIndex].name = req.body.name;
    };

    //mark the task complete if requested
    if ('completed' in req.body) { taskDataArray[taskDataIndex].completed = req.body.completed; };


    const finalData = JSON.stringify(taskDataArray[taskDataIndex]);

    delete finalData.authName;

    return res.status(200).json(finalData);
}

const deleteTask = async (req, res) => {

    //validate the existance of the id
    if (!('id' in req.params) || !req.params.id) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found'
        });
    }

    //fetch the task data index into the record
    const taskDataIndex = taskDataArray.findIndex(item => ((item.id == req.params.id) && (item.authName == req.authName)));

    //if no record found the respond to the user accordingly
    if (taskDataIndex <= -1) {
        return res.status(403).json({
            msg: 'task id is incorrect'
        });
    }

    const taskData = taskDataArray[taskDataIndex];

    //if task is already mark complete then interupt the process
    if (taskData.completed) {
        return res.status(400).json({
            msg: 'Bad Request. Task is marked complete, it cannot be deleted.'
        });
    }

    taskDataIndex !== -1 && taskDataArray.slice(taskDataIndex, 1)
    delete taskData.authName;

    return res.status(200).json(taskData);
}

module.exports = {
    login,
    dashboard,
    createTasks,
    getTasks,
    editTask,
    deleteTask
}