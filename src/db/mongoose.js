const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONN_URL)



// const me = new User({
//     name: 'onurkdev',
//     age: 28,
//     email:'onurk.dev@gmail.com',
//     password: 'pjosdasdasda'
// })

// me.save().then(()=> {
// console.log(me)
// }).catch((error)=> {
// console.log('Error', error)
// })