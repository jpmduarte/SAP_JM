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
  database: "simuladorRNU",
  password: "Diogo",
  port: 5432,
});

app.get("/api/userinfo", async (req, res) => {
  try {
    const numero_utente = req.query.numero_utente;
    console.log(numero_utente);

    if (!numero_utente) {
      return res
        .status(400)
        .json({ error: "Parameter numero_utente is missing in the URL" });
    }

    const query = `
      SELECT ut.nome, ut.numero_telemovel, ut.email, ut.data_nascimento, ut.nif,
             ut.numero_utente, ut.numero_cc, ut.validade_cc,
             mor.rua, mor.codigo_postal, mor.freguesia, mor.concelho, mor.distrito
      FROM utente ut
      JOIN UtenteMorada um ON ut.id_utente = um.id_utente
      JOIN morada mor ON um.id_morada = mor.id_morada
      WHERE ut.numero_utente = $1;
    `;

    const result = await pool.query(query, [numero_utente]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Numero utente not found in the system" });
    }

    const userInfo = result.rows[0];
    console.log(userInfo);
    return res.json(userInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/usfUtente", async (req, res) => {
  try {
    const query = `
    SELECT usfutente.id_utente, usf.nome_usf
    FROM usfutente
    JOIN usf ON usfutente.id_usf = usf.id_usf;    
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No USFutente data found" });
    }

    const usfUtenteData = result.rows;
    return res.json(usfUtenteData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/loadmedico", async (req, res) => {
  const { nome, numero_cedula } = req.query;
  try {
    const query = `
    SELECT 
    medico.nome,
    medico.especialidade,
    medico.numero_cedula,
    USF.nome_usf AS usf_name
    FROM 
    medico
    JOIN 
    usfmedico ON medico.id_medico = usfmedico.id_medico
    JOIN 
    USF ON usfmedico.id_usf = USF.id_usf
    WHERE 
    medico.nome = $1 AND medico.numero_cedula = $2;
    `;
    const values = [nome, numero_cedula];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No Medico data found" });
    }

    const medicoData = result.rows;
    console.log(medicoData);
    return res.json(medicoData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(3002, () => {
  console.log("Server is listening on port 3002.");
});
