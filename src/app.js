const express = require('express')
const {default: helmet} = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const app = express()



// init middlewares
app.use(morgan("dev")) 
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')
// const { countConnect } = require('./helpers/check.connect')
// countConnect()
const { checkOverload } = require('./helpers/check.connect')
checkOverload()



// init route
app.get('/', ( req, res, next) =>{
    const strCompress = 'Hello FantipJs'
    return res.status(200).json({
        message: 'Welcom Fantipjs',
        metadata: strCompress.repeat(100000)
    })
})

// handling error

module.exports = app