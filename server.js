///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

const UsersSchema = new mongoose.Schema({
    userName: String,
    title: String,
    price: Number,
    image: String,
});

const Users = mongoose.model("Users", UsersSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); 
app.use(morgan("dev")); 
app.use(express.json());

///////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", (req, res) => {
    res.send("hello world");
});


// INDEX ROUTE
app.get("/user", async (req, res) => {
    try {
        res.json(await Users.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// CREATE ROUTE
app.post("/user", async (req, res) => {
    try {
        res.json(await Users.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Update ROUTE
app.put("/user/:id", async (req, res) => {
    try {
        // send all people
        res.json(
            await Users.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// Delete ROUTE
app.delete("/User/:id", async (req, res) => {
    try {
        // send all people
        res.json(await Users.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));