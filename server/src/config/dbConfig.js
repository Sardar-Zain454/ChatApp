

import mongoose from "mongoose";


// connection logic
mongoose.connect(process.env.CONN_STRING);

// checking the state of the connection
const db = mongoose.connection;


// CONNECTING....
db.on('connected',()=>{
    console.log("Database connection established successfully!!!");
});


db.on('err', ()=>{
    console.error("Something went wrong while connecting to the database!!: ");
})

export default db; // exporting the db connection to be used in other files