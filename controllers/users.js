const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");

const taskDataArray = [];
const login = async (req, res) => {

    //validate the name and apiKey
    if (req.body.name !== 'John Doe' || req.body.apiKey !== 'qW1hrT2') {
        return res.status(401).json({
            msg: 'Authorization information is missing or invalid.'
        });
    }

    //generate the token
    const token = jwt.sign({ name: req.body.name }, JWT_SECRET_KEY);
    return res.status(200).json(
        {
            token: {
                name: req.body.name,
                token
            },
            "image": "/images/profile.jpg"
        }
    );
}

const dashboard = async (req, res) => {
    return res.status(200).json({
        "tasksCompleted": taskDataArray.filter(item => item?.completed).length,
        "totalTasks": taskDataArray.length,
        "latestTasks": taskDataArray[taskDataArray.length - 1]
    })
}

const createTasks = async (req, res) => {
    if (!('name' in req.body) || !req.body.name) {
        return res.status(400).json({
            msg: 'Bad Request.Task details is missing or didn\'t have a name attribute.'
        });
    }

    if (taskDataArray.find(item => ((item.name == req.body.name) && (item.authName == req.authName)))) {
        return res.status(403).json({
            msg: `${req.body.name} already exist`
        });
    }

    taskDataArray.push({
        id: (Math.random() + 1).toString(36).substring(7),
        name: req.body.name,
        completed: false,
        authName: req.authName
    });

    return res.status(200).json({
        msg: 'OK'
    });
}

const getTasks = async (req, res) => {
    return res.status(200).json(taskDataArray.filter(item => item.authName == req.authName).map(item => ({
        id: item.id,
        name: item.name,
        completed: item.completed
    })));
}

const editTask = async (req, res) => {
    if (!('id' in req.params) || !req.params.id) {
        return res.status(400).json({
            msg: 'task id is requred'
        });
    }

    if ((!('name' in req.body) || !req.body.name) && (!('completed' in req.body) || ([false, true].indexOf(req.body.completed) <= -1))) {
        return res.status(400).json({
            msg: 'Bad Request.Task details is missing or didn\'t have a name attribute.'
        });
    }

    const taskDataIndex = taskDataArray.findIndex(item => ((item.id == req.params.id) && (item.authName == req.authName)));
    if (taskDataIndex < 0) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found.'
        });
    }

    if ('name' in req.body) { taskDataArray[taskDataIndex].name = req.body.name; };
    if ('completed' in req.body) { taskDataArray[taskDataIndex].completed = req.body.completed; };

    const finalData = JSON.stringify(taskDataArray[taskDataIndex]);
    delete finalData.authName;
    return res.status(200).json(finalData);
}

const deleteTask = async (req, res) => {
    if (!('id' in req.params) || !req.params.id) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found'
        });
    }

    const taskDataIndex = taskDataArray.findIndex(item => ((item.id == req.params.id) && (item.authName == req.authName)));

    if (taskDataIndex <= -1) {
        return res.status(403).json({
            msg: 'task id is incorrect'
        });
    }

    const taskData = taskDataArray[taskDataIndex];

    if (taskData.completed) {
        return res.status(400).json({
            msg: 'Bad Request. Task is marked complete, it cannot be deleted.'
        });
    }

    taskDataArray.slice(taskDataIndex, 1)

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