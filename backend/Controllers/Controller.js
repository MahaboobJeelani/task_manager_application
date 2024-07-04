const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const express = require('express')
const bcrypt = require('bcrypt')
const studentModel = require('../Models/Model');

const app = express()

app.use(cookieParser())

register = async (req, resp) => {
    const { username, email, password } = req.body
    try {
        const bcryptPassword = await bcrypt.hash(password, 10)
        const createTask = new studentModel({ username: username, email: email, password: bcryptPassword })
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
        const comparePassword = bcrypt.compare(password, student.password)
        const token = jwt.sign({ student }, process.env.SECRETE_KEY, { expiresIn: '1h' })
        if (!student) {
            resp.status(404).send('Invalid Credencials')
        }
        if (!comparePassword) {
            resp.status(404).send('password is invalid')
        }
        else {
            resp.cookie('tokens', token, { maxAge: 30000, httpOnly: true, secure: true, sameSite: 'strick' })
            resp.status(200).json({ token: token, message: 'login succesfully' });
        }
    } catch (error) {
        resp.status(500).send(error.message)
    }
}

const tokenMiddleware = (req, res, next) => {
    try {
        const tokenCookie = req.cookies.tokens;
        console.log(tokenCookie);
        if (!tokenCookie) {
            return res.status(403).send("A token is required for authentication");
        }
        jwt.verify(tokenCookie, process.env.SECRETE_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send("Invalid Token");
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

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
        const user = await studentModel.findById(req.params.id);
        if (!user) {
            return resp.status(404).send("User not found");
        }

        const taskIndex = user.tasks.findIndex(task => task._id.toString() === req.params.taskid);

        if (taskIndex === -1) {
            return resp.status(404).send("Task not found");
        }

        user.tasks.splice(taskIndex, 1);
        await user.save();

        resp.status(200).send("Task deleted successfully");
    } catch (error) {
        resp.status(500).send(error.message);
    }
}



module.exports = { register, login, createTask, getTask, editTask, deleteTask, tokenMiddleware }