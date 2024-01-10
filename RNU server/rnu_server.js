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
  password: "joaopaulo",
  port: 5432,
});


app.get('/api/userinfo', async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: 'Parametro email nao esta no URL' });
    }

    const query = `
      SELECT ut.nome, ut.numero_telemovel, ut.email, ut.data_nascimento, ut.nif,
             ut.numero_utente, ut.numero_cc, ut.validade_cc,
             mor.rua, mor.codigo_postal, mor.freguesia, mor.concelho, mor.distrito
      FROM utente ut
      JOIN UtenteMorada um ON ut.id_utente = um.id_utente
      JOIN morada mor ON um.id_morada = mor.id_morada
      WHERE ut.email = $1;
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'email nao encontrado no sistema' });
    }

    const userInfo = result.rows[0];
    console.log(userInfo);
    return res.json(userInfo);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.listen(3002, () => {
  console.log("Server is listening on port 3002.");
});
