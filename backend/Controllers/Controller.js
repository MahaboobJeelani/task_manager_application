const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const express = require('express')
const studentModel = require('../Models/Model');

const app = express()

app.use(cookieParser())

register = async (req, resp) => {
    try {
        const createTask = new studentModel(req.body)
        await createTask.save()
        resp.status(200).send("Registration successfully")
    } catch (error) {
        resp.status(500).send(error.message)
    }
}

login = async (req, resp) => {
    const { email, password } = req.body
    try {
        const student = await studentModel.findOne({ email })
        const token = jwt.sign({ student }, process.env.SECRETE_KEY, { expiresIn: '1h' })
        console.log(token);
        if (!student) {
            resp.status(404).send('Invalid Credencials')
        }
        if (password !== student.password) {
            resp.status(404).send('password is invalid')
        }
        else {
            resp.cookie('token', token)
            resp.status(200).json({ token: token, message: 'login succesfully' });
        }
    } catch (error) {
        resp.status(500).send(error.message)
    }
}

createTask = async (req, resp) => {
    try {
        const student = await studentModel.findById(req.params.id)
        if (!student) {
            resp.status(404).send('Student is not found')
        } else {
            const createTask = student.tasks.push(req.body)
            await student.save()
            resp.status(200).json({ message: "Task Created successfully" })
        }
    } catch (error) {
        resp.status(500).send(error.message)
    }
}

getTask = async (req, resp) => {
    try {
        const student = await studentModel.findById(req.params.id)
        if (!student) {
            resp.status(200).send("Student Invalid")
        } else {
            resp.status(200).send(student.tasks)
        }
    } catch (error) {
        resp.status(500).send(error.message)
    }
}


const editTask = async (req, resp) => {
    try {
        const { task, status } = req.body;

        const student = await studentModel.findById(req.params._id);

        if (!student) {
            return resp.status(404).send("student invalid");
        }

        const taskid = await student.tasks.id(req.params._taskid);
        console.log(taskid);

        if (!taskid) {
            return resp.status(404).send("Task not Found");
        }

        taskid.task = task !== undefined ? task : taskid.task
        taskid.status = status !== undefined ? status : taskid.status
        const saveData = await student.save();

        resp.status(200).json({ message: "Task updated successfully", saveData });
    } catch (error) {
        resp.status(500).send(error.message);
    }
};

deleteTask = async (req, resp) => {
    try {
        const student = await studentModel.find(req.params.id)
        // resp.send(student)
        const data = await studentModel.find()
        console.log(data);
        // if (!student) { resp.status(404).send("Student invalid") }

        // const taskId = await student.tasks.id(req.params.taskid)

        // if (!taskId) { resp.status(404).send("Task Id is Invalid"); }

        // else {

        //     const deleteTask = await studentModel.tasks.deleteOne(req.params.taskid)
        //     resp.status(200).send("task deleted succesfully", deleteTask)
        // }
    } catch (error) {
        resp.status(500).send(error.message)
    }
}

module.exports = { register, login, createTask, getTask, editTask, deleteTask }