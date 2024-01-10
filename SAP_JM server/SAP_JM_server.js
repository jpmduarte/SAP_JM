const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const e = require("express");
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

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT id_perfil FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (user.rows.length === 0) {
      return res.json({
        success: false,
        erro: "Utilizador e/ou palavra-passe incorretos",
      });
    }
    const id_perfil = user.rows[0].id_perfil;
    console.log(id_perfil);
    return res.json({ success: true, perfil: id_perfil });
  } catch (err) {
    console.error(err.message);
  }
});



app.post("/api/register", async (req, res) => {
  try {
    const { email, password, nome, numeroUtente } = req.body;
    console.log(req.body);
    id_perfil = 2;

    checkMail = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$");
    if (!checkMail.test(email)) {
      return res.json({ success: false, erro: "Email inválido" });
    }
    checkPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$"
    );
    if (!checkPassword.test(password)) {
      return res.json({
        success: false,
        erro: "Password inválida,  a password deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número",
      });
    }
    checkNumeroUtente = new RegExp("^[0-9]{9}$");
    if (!checkNumeroUtente.test(numeroUtente)) {
      return res.json({ success: false, erro: "Número de utente inválido" });
    }
    checkNome = new RegExp("^[a-zA-Z]+(?:\\s[a-zA-Z]+){1,29}$");
    if (!checkNome.test(nome)) {
      return res.json({ success: false, erro: "Nome inválido" });
    }

    checkEmailDuplicate = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );
    if (checkEmailDuplicate.rows.length > 0) {
      return res.json({ success: false, erro: "Email já registado" });
    }
    const user = await pool.query(
      "insert into  users (id_perfil,email, password) values ($1, $2, $3)",
      [id_perfil, email, password]
    );
    const id_user = await pool.query(
      "select id_user from users where email = $1",
      [email]
    );
    if (id_user.rows[0].id_user == 0) {
      return res.json({ success: false, erro: "erro ao inserir utilizador" });
    }

    const id = id_user.rows[0].id_user;
    const utente = await pool.query(
      "insert into utentes (id_user_utente, numero_utente,nome) values ($1, $2, $3)",
      [id, numeroUtente, nome]
    );

    const queryResult = await pool.query(
      "SELECT * FROM utentes WHERE id_user_utente = $1",
      [id]
    );
    if (queryResult.rows && queryResult.rows.length === 0) {
      return res.json({ success: false, erro: "erro ao inserir utente" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err.message);
  }
});



app.post('/submit/pedidoAvaliacao', async (req, res) => {
  try {
    const {
      numeroUtente, // assuming you receive this in the request
      nomeCompleto,
      dataNascimento,
      nIdentificacao,
      nUtenteSaude,
      nif,
      dataValidade,
      rua,
      codigoPostal,
      localidade,
      concelho,
      distrito,
      telemovel,
      email,
      multiuso,
      importacaoVeiculo,
      submissaoReavaliacao,
      dataSubmissaoReavaliacao
    } = req.body;

    // Perform validation or additional logic if needed

    const client = await pool.connect();
    try {
      // Fetch id_utente from utente table based on numero_utente
      const utenteResult = await client.query(
        'SELECT id_utente, id_USF FROM utenteUSF WHERE id_utente IN (SELECT id_utente FROM utentes WHERE numero_utente = $1)',
        [numeroUtente]
      );

      if (utenteResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Utente not found' });
      }

      const { id_utente, id_USF } = utenteResult.rows[0];

      // Fetch available doctors in the same USF
      const availableDoctorsResult = await client.query(
        `SELECT m.id_medico, COUNT(pa.id_pedido) as num_requests
        FROM medicos m
        JOIN medicoUSF mu ON m.id_medico = mu.id_medico
        JOIN utenteUSF uu ON mu.id_USF = uu.id_USF
        LEFT JOIN pedido_primeira_avaliacao pa ON m.id_medico = pa.id_medico
        WHERE uu.id_utente = $1
        GROUP BY m.id_medico
        ORDER BY num_requests ASC
        LIMIT 1;
        `,[id_USF]
      );

      if (availableDoctorsResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'No available doctors in the same USF' });
      }

      const { id_medico } = availableDoctorsResult.rows[0];

      // Insert the data into the pedido_primeira_avaliacao table
      const result = await client.query(
        `INSERT INTO pedido_primeira_avaliacao
        (id_utente, id_medico, nome_completo, data_nascimento, n_identificacao, n_utente_saude, nif, data_validade,
        rua, codigo_postal, localidade, concelho, distrito, telemovel, email, multiuso,
        importacao_veiculo, submissao_reavaliacao, data_submissao_reavaliacao)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id_pedido`,
        [id_utente, id_medico, nomeCompleto, dataNascimento, nIdentificacao, nUtenteSaude, nif, dataValidade,
          rua, codigoPostal, localidade, concelho, distrito, telemovel, email, multiuso,
          importacaoVeiculo, submissaoReavaliacao, dataSubmissaoReavaliacao]
      );

      const pedidoId = result.rows[0].id_pedido;

      // Perform any additional logic or insert data into related tables if needed

      res.status(200).json({ success: true, pedidoId });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting pedidoAvaliacao:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/api/utenteUSF', async (req, res) => {
  try {
    const { id_utente, id_USF } = req.body;
    const result = await pool.query(
      'INSERT INTO utenteUSF (id_utente, id_USF) VALUES ($1, $2) RETURNING *',
      [id_utente, id_USF]
    );
    const insertedUtenteUSF = result.rows[0];
    res.status(201).json({ success: true, utenteUSF: insertedUtenteUSF });
  } catch (error) {
    console.error('Error creating utenteUSF:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/api/pedidos', async (req, res) => {
  try {
   
    const email = req.query.email; 
   
    const result = await pool.query(
      `select id_utente from utentes join users on utentes.id_user_utente = users.id_user where email = $1`,
      [email]
    );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Utente not found' });
      }

    const { id_utente } = result.rows[0];
    result1 = await pool.query(
      `select * from pedido_primeira_avaliacao where id_utente = $1`,
      [id_utente]
    );
    result2 = await pool.query(
      ``, // query para pedidos de junta medica (pedido_junta_medica) logica a averiguar depois
      [id_utente]
    );

    if (result1.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No pedidos found for the utente' });
    }

    const pedidoInfo = result.rows[0];
    res.status(200).json({ success: true, pedidoInfo });
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}); //  incompleto falta a query para pedidos de junta medica (pedido_junta_medica) 


app.listen(3001, () => {
  console.log("Server is listening on port 3001.");
});
