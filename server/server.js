const express = require("express");
const cors = require("cors");

const router = require("./router");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log("Running on port " + PORT));
