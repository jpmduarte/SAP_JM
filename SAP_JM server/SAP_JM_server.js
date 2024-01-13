const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const e = require("express");
const axios = require("axios"); 
const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SAP_JM",
  password: "Diogo",
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

app.get("/api/users", async (req, res) => {
  try {
    const users = await pool.query(`
    SELECT
    CASE
      WHEN perfis.nome = 'utente' THEN utentes.nome
      WHEN perfis.nome = 'medico' THEN medicos.nome
      ELSE NULL
    END AS nome,
    users.email,
    perfis.nome AS perfil,
    users.id_user
  FROM users
  JOIN perfis ON users.id_perfil = perfis.id_perfil
  LEFT JOIN utentes ON users.id_user = utentes.id_user_utente
  LEFT JOIN medicos ON users.id_user = medicos.id_user_medico;
  
    `);

    if (users.rows.length === 0) {
      return res.json({ success: false, erro: "Nenhum utilizador encontrado" });
    }

    const userList = users.rows;
    console.log(userList);
    return res.json({ success: true, users: userList });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
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

app.get('/api/numeroUtente', async (req, res) => {

  try {
    const email = req.query.email; 
    const result = await pool.query(
      `select numero_utente from utentes join users on utentes.id_user_utente = users.id_user where email = $1`,
      [email]
    );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Utente not found' });
      }

    const { numero_utente } = result.rows[0];
    res.status(200).json({ success: true, numero_utente});
  }
  catch (error) {
    console.error('Error fetching numero_utente:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/utenteID', async (req, res) => {
  
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
      res.status(200).json({ success: true, id_utente});
    }
    catch (error) {
      console.error('Error fetching id_utente:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

app.post('/api/createemployee', async (req, res) => {
  try {
    const { email, password, numero_cedula, nome_medico } = req.body;

    // Check if email is duplicated
    const checkEmailDuplicate = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (checkEmailDuplicate.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Inserting into the 'users' table
    const userResult = await pool.query(
      'INSERT INTO users (id_perfil, email, password) VALUES (3, $1, $2) RETURNING id_user',
      [email, password]
    );

    const id_user = userResult.rows[0].id_user;

    // Calling the 'loadmedico' API using axios.get
    const medicoData = await axios.get('http://localhost:3002/api/loadmedico', { params: { nome: nome_medico, numero_cedula: numero_cedula } });

    if (medicoData.data.length === 0) {
      return res.status(404).json({ success: false, error: 'Medico data not found' });
    }

    // Assuming medicoData is an array, you might need to adjust accordingly
    const newnumero_cedula = medicoData.data[0].numero_cedula;
    const newnome_medico = medicoData.data[0].nome;

    // Inserting into the 'medicos' table
    const medicoResult = await pool.query(
      'INSERT INTO medicos (id_user_medico, numero_cedula, nome) VALUES ($1, $2, $3) RETURNING id_medico',
      [id_user, newnumero_cedula, newnome_medico]
    );

    const id_medico = medicoResult.rows[0].id_medico;
    console.log(medicoData)

    // Fetching the id_usf based on the data from the 'loadmedico' API
    const getUSF = await pool.query(
      'SELECT id_usf FROM usf WHERE nomeusf = $1',
      [medicoData.data[0].usf_name]
    );

    const id_usf = getUSF.rows[0].id_usf;
      console.log(id_usf);
    // Inserting into the 'usfmedico' table
    await pool.query(
      'INSERT INTO medicousf (id_usf, id_medico) VALUES ($1, $2)',
      [id_usf, id_medico]
    );

    // Sending a success response
    res.status(200).json({ success: true, error: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/loadusf', async (req, res) => {
  try {
    // Obter todas as USFs do servidor RNU
    const rnuUsfs = await axios.get('http://localhost:3002/api/loadusf');
    
    // Verificar e inserir as USFs ausentes no servidor SAP
    for (const rnuUsf of rnuUsfs.data) {
      const existingUsf = await pool.query('SELECT * FROM usf WHERE nomeusf = $1', [rnuUsf.nome_usf]);
      
      if (existingUsf.rows.length === 0) {
        // A USF não existe no servidor SAP, então insira
        await pool.query('INSERT INTO usf (nomeusf) VALUES ($1)', [rnuUsf.nome_usf]);
      }
    }
    console.log(rnuUsfs.data);

    res.status(200).json({ success: true, message: 'Load USFs completed successfully' });
  } catch (error) {
    console.error('Error loading USFs:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get("/api/getschedules", (req, res) => {
  const query = `
    SELECT ms.nome, ms.id_medico, h.*
    FROM public.horarios h
    INNER JOIN public.medicos ms ON h.id_medico = ms.id_medico
  `;

  pool.query(query, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const doctors = result.rows.map((row) => ({
        schedule: {
          name: row.nome,
          id_medico: row.id_medico,
          id: row.id_horario,
          dia_semana: row.dia_semana,
          periodo_manha_inicio: row.hora_inicio_manha,
          periodo_manha_fim: row.hora_fim_manha,
          periodo_tarde_inicio: row.hora_inicio_tarde,
          periodo_tarde_fim: row.hora_fim_tarde,
        },
      }));
      res.json(doctors);
    }
  });
});

app.get("/api/noSchedule", (req, res) => {
  const query = `
    SELECT nome, numero_cedula, id_medico
    FROM medicos
    WHERE id_medico NOT IN (
      SELECT id_medico
      FROM horarios
      GROUP BY id_medico
      HAVING COUNT(*) >= 5
    )
  `;

  pool.query(query, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const doctors = result.rows;
      res.status(200).json(doctors);
      console.log("Fetching doctors without a full schedule");
    }
  });
});

app.get("/api/fetchdoctorswithschedule", (req, res) => {
  const query = `SELECT distinct nome, numero_cedula
  FROM medicos 
  WHERE id_medico IN (
    SELECT  id_medico
    FROM horarios
  )
  `;

  pool.query(query, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const doctors = result.rows;
      res.status(200).json(doctors);
      console.log("Fetching doctors without schedule");
    }
  });
});

app.post("/api/createSchedule", (req, res) => {
  const {
    id_medico,
    dia_semana,
    hora_inicio_manha,
    hora_fim_manha,
    hora_inicio_tarde,
    hora_fim_tarde,
  } = req.body;

  console.log(req.body);
  const dayOfWeek = parseInt(dia_semana);
  const morningStartTime = parseTime(hora_inicio_manha);
  const morningEndTime = parseTime(hora_fim_manha);
  const afternoonStartTime = parseTime(hora_inicio_tarde);
  const afternoonEndTime = parseTime(hora_fim_tarde);

  const insertQuery = `select create_schedule($1, $2, $3, $4, $5, $6, $7)`;
  const insertValues = [
    id_medico,
    dayOfWeek,
    morningStartTime,
    morningEndTime,
    afternoonStartTime,
    afternoonEndTime,
    true,
  ];

  pool.query(insertQuery, insertValues, (insertError, insertResult) => {
    if (insertError) {
      console.error("Error executing insert query:", insertError);
      let errorMessage = insertError.message;
      res.status(500).json({ error: errorMessage });
    } else {
      console.log("Schedule created successfully");
      res.status(200).json({ message: "Schedule created successfully" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001.");
});