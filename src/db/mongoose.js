const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONN_URL)