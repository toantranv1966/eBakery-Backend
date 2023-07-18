'use strict'    

const mongoose = require('mongoose')
const connectString = "mongodb+srv://toantranv1966:5g8g1g3b@cluster0.epuw6ei.mongodb.net/eBakery-db"

mongoose.connect(connectString).then( _ => console.log(`Connected Mongodb Success PRO`))
.catch( err => console.log('Error Connect!'))

class Database {
    constructor(){
        this.connect()
    }

    // connect
connect(type = 'mongodb'){
    if(1 === 1){
        mongoose.set('debug', true)
        mongoose.set('debug', {color:true})
    }

    mongoose.connect(connectString, {
        maxPoolSize: 50
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
