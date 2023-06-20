const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const Schema = mongoose.Schema

app.use(bodyParser.urlencoded({extended : true}))

const frontendFolderPath = path.join(__dirname, '../frontend')
//const generatedFacesPath = path.join(__dirname, 'generatedFaces')

app.use(express.static(frontendFolderPath))
//app.use('/generatedFaces', express.static(generatedFacesPath))


mongoose.connect("mongodb+srv://mghiniei:marius1234@cluster0.kqb16qd.mongodb.net/face-recognition-db")

const userSchema = new Schema({
    name: {type : String, required : true},
    email: {type : String, required: true},
    classificator: {type : String, required: true}
})

const userInput = mongoose.model("user", userSchema)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

app.post("/", (req, res) => {
    let newUserInput = new userInput({
        name : req.body.name,
        email : req.body.email,
        classificator: req.body.classifier
    })

    newUserInput.save()
    res.redirect('/')
})
//post request

app.listen(1234, () => { console.log("server is running on 1234");})