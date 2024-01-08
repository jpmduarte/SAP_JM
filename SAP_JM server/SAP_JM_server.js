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
    database: "SAP_JM",
    password: "joaopaulo",
    port: 5432,
  });


  app.listen(3001, () => {
    console.log("Server is listening on port 3001.")
  }
    );

