'use strict'    

const mongoose = require('mongoose')
// const { db: {host, name, port}} = require('../configs/config.mongodb')
// const connectString = "mongodb+srv://toantranv1966:5g8g1g3b@cluster0.epuw6ei.mongodb.net/eBakery-db"
// const connectString = `mongodb://${host}:${port}/${name}`
const connectString = `mongodb://localhost:27017/shopDev`


console.log('connectString::', connectString)

mongoose.connect(connectString).then( _ => console.log(`Connected Mongodb Success PRO`))
.catch( err => console.log('Error Connect!'))

class Database {
    constructor(){
        this.connect()
    }

    // connect
    async connect(type = 'mongodb'){
    if(1 === 1){
        mongoose.set('debug', true)
        mongoose.set('debug', {color:true})
    }

    await mongoose.connect(connectString, {
        // maxPoolSize: 50
    }).then( _ => console.log('Connected Mongodb Success'))
    .catch( err => console.log('Error connect!'))
}

static getInstance(){
    if(!Database.instance){
        Database.instance = new Database()
    }

    return Database.instance
}
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb

