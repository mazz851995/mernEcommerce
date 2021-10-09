const mongoose = require("mongoose")

// const DB_URI = (process.env.NODE_ENV == "PRODUCTION") ? process.env.NODE_DB_URI_PROD : process.env.NODE_DB_URI_DEV;
// console.log(process.env);
// console.log(DB_URI);
const connectDataBase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((data) => { console.log(`MONGO DB connection established at PORT : ${data.connection.port}`); })
    // .catch((err)=>{console.log(err.message);})
    // here catch block is not needed because we have handled the DB error in server.js

}

module.exports = connectDataBase;
