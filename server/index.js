const express = require("express");
const cors = require("cors");
const app_postgresql = express();
const pool = require("./db");

app_postgresql.use(cors());
app_postgresql.use(express.json());

app_postgresql.post("/users", async (req, res) => {
  console.log("starting request");
  try {
    const { name, email, age } = req.body; // Extracting name, email, age from request body
    const newUser = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING user_id", // Returning only the id
      [name, email, age]
    );
    console.log("end request");

    res.json({ user_id: newUser.rows[0].user_id }); // Sending only the id in response
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get all todos

app_postgresql.get("/", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app_postgresql.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id =$1", [
      id,
    ]);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a todo

app_postgresql.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body; // Collect the correct fields
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3 WHERE user_id = $4",
      [name, email, age, id]
    );
    res.json("User was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete todo

app_postgresql.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id=$1", [
      id,
    ]);
    res.json("user was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app_postgresql.listen(5000, () => {
  console.log("server has started on port 5000");
});

const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); // Load .env file
const UserModel = require("./models/User");

const app_mangoose = express();
app_mangoose.use(cors());
app_mangoose.use(express.json());
app_mangoose.use("/images", express.static("public"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

console.log("MongoDB URI:", process.env.MONGO_URI);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app_mangoose.post("/upload", upload.single("image"), async (req, res) => {
  try {
    let { user_id } = req.body;

    user_id = parseInt(user_id, 10);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newUser = await UserModel.create({
      image: req.file.filename,
      user_id,
    });
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app_mangoose.get("/getImage", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app_mangoose.put("/users/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { image: req.file.filename },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app_mangoose.delete("/deleteImage/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const mongoDelete = await UserModel.findOneAndDelete({ user_id: id });

    if (!mongoDelete) {
      console.warn("No image found in MongoDB for user:", id);
    }

    res.json({ message: "User deleted from MongoDB" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app_mangoose.listen(3001, () => {
  console.log("server is running 3001");
});
