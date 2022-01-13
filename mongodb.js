

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = process.env.MONGODB_CONN_URL
const databaseName = 'task-manager'
const ObjectId = mongodb.ObjectId

const id = new ObjectId()
console.log(id)

MongoClient.connect(connectionURL, (error, client) => {
    if(error){
        return console.log('unable to coonnect server')
    }
    console.log('Connection Successful')
    
    const db = client.db(databaseName)
    db.collection('users').insertOne({
        name:'Onur7',
        age:25
    }, (error, result) => {
        if(error) {
            return console('Unable to insert user')
        }
        console.log(result)
    } )
})