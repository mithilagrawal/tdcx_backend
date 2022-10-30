const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");

const taskDataArray = [];
const login = async (req, res) => {

    //validate the name and apiKey
    if (req.body.name !== 'John Doe' || req.body.apiKey !== 'qW1hrT2') {
        return res.status(401).json({
            msg: '401: Authorization information is missing or invalid.'
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
        "tasksCompleted": 10,
        "totalTasks": 19,
        "latestTasks": [
            {
                "name": "Refactor something",
                "completed": false
            }
        ]
    })
}

const createTasks = async (req, res) => {
    if (!('name' in req.body) || !req.body.name) {
        return res.status(400).json({
            msg: '400: Bad Request.Task details is missing or didn\'t have a name attribute.'
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
    return res.status(200).json(taskDataArray.map(item => ({
        id: item.id,
        name: item.name,
        completed: item.completed
    })));
}


module.exports = {
    login,
    dashboard,
    createTasks,
    getTasks
}