import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'


const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema)

const app = express()
app.use(cors())
app.use(express.json())

const defaultEndpoint = (_, res) => {
    res.status(404).json({ error: "Unknown path" })
}

app.get('/users', (_, res) => {
    User.find({}).then(result => {
        res.json(result)
    })
})
app.post('/users', (req, res) => {

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    User.find({}).then(result => {
        if (!result.find(e => e.username == user.username)) {
            user.save().then(result => {
                res.json(result)
                mongoose.connection.close
            })
        }
        else return
    })

})

app.use(defaultEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server je pokrenut na :http://localhost:${PORT}`)
})