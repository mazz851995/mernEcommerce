const app = require("./app");
const dotenv = require("dotenv")
const connectDatabase = require("./config/db")
const cloudinary = require("cloudinary")

// handlelling Uncaught acception
process.on("uncaughtException", (err) => {
    console.log(`Error :  ${err.message}`);
    console.log("Shutting down due to Uncaught exception");
    process.exit(1);
})

// config 
dotenv.config({ path: "backend/config/config.env" });

// Connect to database
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const port = process.env.PORT || 4000

const server = app.listen(port, () => {
    console.log(`Server working: ${port}`);
})

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Server shutting down");
    server.close(() => {
        process.exit(1);
    })
})
