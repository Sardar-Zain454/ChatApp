
// ORDER MATTERS must:
import "dotenv/config"; // Load environment variables from .env file and attaches them to process.env
import  "./src/config/dbConfig.js"; // configuring the database before application startup.
import { app } from "./app.js"; // runs the whole app.js file at once then controls goes to line 3




const PORT = process.env.PORT_NUMBER || 5000;

app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
});

