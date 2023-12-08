const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
	res.send("Input your signup details here");
});

router.get("/login", (req, res) => {
	res.send("Input your login details here");
});

router.get("/dashboard", (req, res) => {
	res.send("Your Dashboard");
});

router.post("/", )