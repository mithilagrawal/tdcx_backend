const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Tasks = mongoose.model('tasks');
const Users = mongoose.model('users');


const isTaskExist = async (e = {}) => {
    const findCond = {};
    if ('id' in e) { findCond['_id'] = ObjectId(e.id); };
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

const login = async (req, res) => {

    if (!('apiKey' in req.body) || !req.body.apiKey || !('name' in req.body) || !(req.body.name)) {
        return res.status(401).json({
            msg: 'Authorization information is missing or invalid.'
        });
    }

    try {
        //validate the name and apiKey
        const user = await Users.findOne({
            name: req.body.name,
            apiKey: req.body.apiKey
        }).lean();

        if (!user) {
            return res.status(401).json({
                msg: 'Authorization information is missing or invalid.'
            });
        }

        //generate the token
        const token = jwt.sign({ id: user?._id }, JWT_SECRET_KEY);
        return res.status(200).json(
            {
                token: {
                    name: user.name,
                    token
                },
                "image": "/images/profile.jpg"
            }
        );
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }
}

const dashboard = async (req, res) => {

    try {
        const taskData = await Tasks.find({
            authName: req.authName
        }).lean();

        //generate the response data that needed for dashboard
        const resData = {
            "tasksCompleted": taskData.filter(item => item.completed).length,
            "totalTasks": taskData.length,
            "latestTasks": taskData.slice(-3)
        };

        return res.status(200).json(resData);
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }


}

const createTasks = async (req, res) => {

    //check existance of name in body of the request
    if (!('name' in req.body) || !req.body.name) {
        return res.status(400).json({
            msg: 'Bad Request.Task details is missing or didn\'t have a name attribute.'
        });
    }
    try {
        //find the task into the database
        const taskData = await isTaskExist({
            name: req.body.name,
            authName: req.authName
        });

        //if task is already exist then inform to the user that the task is already exist
        if (taskData?.status) {
            return res.status(403).json({
                msg: `${req.body.name} already exist`
            });
        }


        //insert the record into the database
        const taskInsert = new Tasks({
            name: req.body.name.trim(),
            authName: req.authName
        });

        //save the info into the mongodb database
        await taskInsert.save();

        return res.status(200).json({
            msg: 'OK'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }
}

const getTasks = async (req, res) => {

    try {
        const taskData = await Tasks.find({}).lean();

        //get all the task
        return res.status(200).json(taskData.filter(item => item.authName == req.authName).map(item => ({
            id: item._id,
            name: item.name,
            completed: item.completed
        })));
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }

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

    const taskData = await isTaskExist({
        id: ObjectId(req.params.id)
    });

    //if task is not avail then inform to the user that the task is missing
    if (!taskData?.status) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found.'
        });
    }



    const editData = {};
    //if name need to edit then check the requested name is already exist into the record or not
    if ('name' in req.body) {
        try {
            const isNameExist = await isTaskExist({
                name: req.body.name,
                authName: req.authName
            });
            if (isNameExist?.status && (isNameExist?.data?._id.toString() != req.params.id)) {
                return res.status(403).json({
                    msg: `${req.body.name} already exist`
                });
            }
            //edit the name into the record
            editData['name'] = req.body.name;
        } catch (error) {
            return res.status(500).json({
                msg: 'server error'
            });
        }

    };

    //mark the task complete if requested
    if ('completed' in req.body) { editData['completed'] = req.body.completed; };

    try {
        const updatedTaskData = await Tasks.findOneAndUpdate({
            _id: ObjectId(req.params.id)
        }, {
            $set: editData
        });

        delete updatedTaskData?._id;
        delete updatedTaskData?.authName;

        return res.status(200).json(updatedTaskData);
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }

}

const deleteTask = async (req, res) => {

    //validate the existance of the id
    if (!('id' in req.params) || !req.params.id) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found'
        });
    }

    const taskData = await isTaskExist({
        id: ObjectId(req.params.id)
    });


    //if task is not avail then inform to the user that the task is missing
    if (!taskData?.status) {
        return res.status(404).json({
            msg: 'Not Found. Task was not found.'
        });
    }

    //if task is already mark complete then interupt the process
    if (taskData?.data?.completed) {
        return res.status(400).json({
            msg: 'Task is marked complete, it cannot be deleted.'
        });
    }

    try {
        const deletedTask = await Tasks.findOneAndDelete({
            _id: ObjectId(req.params.id)
        });

        delete deletedTask?._id;
        delete deletedTask?.authName;

        return res.status(200).json(deletedTask);
    } catch (error) {
        return res.status(500).json({
            msg: 'server error'
        });
    }
}

module.exports = {
    login,
    dashboard,
    createTasks,
    getTasks,
    editTask,
    deleteTask
}