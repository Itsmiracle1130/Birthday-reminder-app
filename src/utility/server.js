const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()


const server = () =>{
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

}