const mongoose = require('mongoose');

//below line changes when we are deploying to a production string
//this connect method returns a promise, so we can chain using 'then'
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log("could not connect to mongo db", err));

