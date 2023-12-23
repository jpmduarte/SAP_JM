const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "",
    password: "",
    port: 5432,
  });

