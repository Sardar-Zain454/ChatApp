
import dotenv from "dotenv";
dotenv.config({path:"./config.env"}); // loads the environment variables from config.env file and attach to process.env object


import { app } from "./app.js"; // runs the whole app.js file at once then controls goes to line 3



const PORT = process.env.PORT_NUMBER || 3000;

app.listen(PORT, () => {
     console.log("Server is running on port: ", PORT);
});
