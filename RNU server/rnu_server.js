const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "simuladorRNU",
  password: "joaopaulo",
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

app.get("/api/utenteusf", async (req, res) => {
  try {
    //given numero Utente return usf name 
    const numero_utente1 = req.query.numero_utente;
    const numero_utente = numero_utente1.toString();
    console.log(numero_utente + ' é este o numero' );
    const query = `
    SELECT usf.nome_usf AS usf_name from usf join usfutente on usf.id_usf = usfutente.id_usf join utente on usfutente.id_utente = utente.id_utente where utente.numero_utente = $1;
    `;
    const values = [numero_utente];

    const result = await pool.query(query, values);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No USFutente data found" });
    }
    const usfUtenteData = result.rows[0];
    console.log(usfUtenteData.usf_name);
    return res.json(usfUtenteData.usf_name);
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

app.get('/api/loadusf', async (req, res) => {
  try {
   
    const rnuUsfs = await pool.query('SELECT nome_usf FROM usf');
    
    res.status(200).json(rnuUsfs.rows);
  } catch (error) {
    console.error('Error fetching USFs from RNU:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3002, () => {
  console.log("Server is listening on port 3002.");
});
