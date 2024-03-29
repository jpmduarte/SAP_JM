const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const axios = require("axios");
const app = express();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SAP_JM",
  password: "joaopaulo",
  port: 5432,
});


app.put("/api/validatePedido/:id_pedido", async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { nivel_invalidez, descricao } = req.body;

    const result = await pool.query(
      `UPDATE pedido_primeira_avaliacao SET estado = 2, data_validacao = CURRENT_DATE, descricao = $2, valor_invalidez = $3 WHERE id_pedido = $1`,
      [id_pedido, descricao, nivel_invalidez]
    );

    res.status(200).json({ message: "Pedido validado com sucesso" });
  } catch (error) {
    console.error("Error validating pedido:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/api/rejectPedido/:id_pedido", async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { descricao } = req.body;

    const result = await pool.query(
      `UPDATE pedido_primeira_avaliacao SET estado = 3, data_validacao = CURRENT_DATE, descricao = $2 WHERE id_pedido = $1`,
      [id_pedido, descricao]
    );

    res.status(200).json({ message: "Pedido rejeitado com sucesso" });
  } catch (error) {
    console.error("Error rejecting pedido:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/fetchpedidosJunta", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await pool.query(
      ` select id_perfil from users where email = $1 `,
      [email]
    );
      console.log('result === ' + result.rows);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utente not found" });
    }
    const { id_perfil } = result.rows[0];

    if (id_perfil == 2) //utente
    {
      const result = await pool.query(
        `select * from pedido_junta_medica join pedido_primeira_avaliacao on pedido_junta_medica.id_pedido_avaliacao = pedido_primeira_avaliacao.id_pedido where id_utente = (select id_utente from utentes where id_user_utente = (select id_user from users where email = $1))`,
        [email]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Utente sem pedidos de avaliação e/ou junta medica" });
      }
      const pedidos = result.rows;
      res.status(200).json({ success: true, pedidos });
    }
    else if (id_perfil == 3) //medico
    {
      const result = await pool.query(
        `select * from pedido_junta_medica join pedido_primeira_avaliacao on pedido_junta_medica.id_pedido_avaliacao = pedido_primeira_avaliacao.id_pedido where id_medico = (select id_medico from medicos where id_user_medico = (select id_user from users where email = $1))`,
        [email]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "medico sem pedidos " });
      }
      const pedidos = result.rows[0];
      console.log(pedidos);
      res.status(200).json({ success: true, pedidos});
    }

  } catch (error) {
    console.error("Error fetching id_utente:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT id_perfil FROM users WHERE email = $1 AND password = $2 AND estadoDeAtividade = 1",
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
  LEFT JOIN medicos ON users.id_user = medicos.id_user_medico
  WHERE users.estadodeatividade = 1;
  
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

app.post("/api/juntaMedica", async (req, res) => {
  try {
    const pedidosAvaData = req.body[0];

    // Insert into pedido_junta_medica
    const result = await pool.query(
      `INSERT INTO pedido_junta_medica (id_pedido_avaliacao, estado_junta_medica)
       VALUES ($1, $2)
       RETURNING id_pedido_junta_medica`,
      [pedidosAvaData.id_pedido, 1]
    );
      const testForDups = await pool.query(
        `SELECT * FROM pedido_junta_medica WHERE id_pedido_avaliacao = $1`,
        [pedidosAvaData.id_pedido]
      );
      if (testForDups.rows.length > 1) {
        return res.status(400).json({ success: false, error: "Já tem um pedido de junta médica pendente...." });
      }

    // Find id_grupo_medico
    const id_grupo_medico = await pool.query(
      `WITH MedicsInSameUSF AS (
          SELECT
              gm.id_grupo_medico,
              uu.id_usf,
              COUNT(DISTINCT m.id_medico) AS num_medics
          FROM
              grupos_medicos gm
          JOIN medicos_grupos mg ON gm.id_grupo_medico = mg.id_grupo_medico
          JOIN medicos m ON mg.id_medico = m.id_medico
          JOIN medicoUSF mu ON m.id_medico = mu.id_medico
          JOIN utenteUSF uu ON mu.id_USF = uu.id_USF
          WHERE
              uu.id_utente = $1
          GROUP BY
              gm.id_grupo_medico, uu.id_usf
          HAVING
              COUNT(DISTINCT uu.id_usf) = 1
      ),
      GroupsWithoutPrimeiraAvaliacao AS (
          SELECT
              gm.id_grupo_medico
          FROM
              grupos_medicos gm
          LEFT JOIN medicos_grupos mg ON gm.id_grupo_medico = mg.id_grupo_medico
          LEFT JOIN medicos m ON mg.id_medico = m.id_medico
          LEFT JOIN pedido_primeira_avaliacao pa ON m.id_medico = pa.id_medico
          WHERE
              pa.id_medico IS NULL
      ),
      GroupPedidosCount AS (
          SELECT
              gm.id_grupo_medico,
              COUNT(pjm.id_pedido_junta_medica) AS num_pedidos
          FROM
              GroupsWithoutPrimeiraAvaliacao gm
          LEFT JOIN pedido_junta_medica pjm ON gm.id_grupo_medico = pjm.id_grupo_medico
          GROUP BY
              gm.id_grupo_medico
      )
      SELECT
          mus.id_grupo_medico
      FROM
          MedicsInSameUSF mus
      JOIN GroupPedidosCount gpc ON mus.id_grupo_medico = gpc.id_grupo_medico
      ORDER BY
          gpc.num_pedidos ASC
      LIMIT 1;    
      `, [pedidosAvaData.id_utente]
    );

    // Update pedido_junta_medica with id_grupo_medico
    await pool.query(
      `UPDATE pedido_junta_medica SET id_grupo_medico = $1 WHERE id_pedido_junta_medica = $2`,
      [id_grupo_medico.rows[0].id_grupo_medico, result.rows[0].id_pedido_junta_medica]
    );

    res.status(200).json({ message: "Junta Médica data received successfully" });
  } catch (error) {
    console.error("Error processing Junta Médica data:", error);
    let errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ error: errorMessage });
  }
});


app.post("/api/pedidoAvaliacao", async (req, res) => {
  try {
    const {
      idUtente,
      nomeCompleto,
      data_nascimento: dataNascimento,
      nIdentificacao,
      numero_utente,
      nif,
      data_validade: dataValidade,
      rua,
      codigoPostal,
      localidade,
      concelho,
      distrito,
      telemovel,
      email,
      multiuso,
      submissao_reavaliacao,
      data_submissao_reavaliacao,
    } = req.body;
    console.log(req.body);
    // Perform validation or additional logic if needed
    var importacaoVeiculo1;
    var submissaoReavaliacao1;
    var dataSubmissaoReavaliacao1;
    multiuso ==  'false' ? (importacaoVeiculo1 = true) : (importacaoVeiculo1 = false);
    submissao_reavaliacao == "nao" ? (dataSubmissaoReavaliacao1 = null) : (dataSubmissaoReavaliacao1 = data_submissao_reavaliacao);
    submissao_reavaliacao == "nao" ? (submissaoReavaliacao1 = false) : (submissaoReavaliacao1 = true);
    submissao_reavaliacao == 'sim' ? dataSubmissaoReavaliacao1 = data_submissao_reavaliacao : dataSubmissaoReavaliacao1 = null;
    const client = await pool.connect();
    try {
      // Fetch id_utente from utente table based on numero_utente
      const utenteResult = await client.query(
        "SELECT id_USF FROM utenteUSF WHERE id_utente  = $1",
        [idUtente]
      );
      console.log(utenteResult.rows);
      if (utenteResult.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Utente not found" });
      }

     const id_USF = utenteResult.rows[0];

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
        `,
        [idUtente]
      );

      if (availableDoctorsResult.rows.length === 0) {
        return res
          .status(404)
          .json({
            success: false,
            error: "No available doctors in the same USF",
          });
      }

      const { id_medico } = availableDoctorsResult.rows[0];

      const checkForOtherRequests = await client.query(
        `SELECT * FROM pedido_primeira_avaliacao WHERE id_utente = $1 and estado = '1'`,
        [idUtente]
      );
        results = checkForOtherRequests.rows;
        if (results.length > 0) {
          return res.status(400).json({ success: false, error: "Já tem um pedido de avaliação pendente...." });
        }
      // Insert the data into the pedido_primeira_avaliacao table
      const result = await client.query(
        `INSERT INTO pedido_primeira_avaliacao
        (id_utente, id_medico, estado,nome_completo, data_nascimento, n_identificacao, n_utente_saude, nif, data_validade,
        rua, codigo_postal, localidade, concelho, distrito, telemovel, email, multiuso,
        importacao_veiculo, submissao_reavaliacao, data_submissao_reavaliacao,data_submissao)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,$20,CURRENT_DATE)
        RETURNING id_pedido`,
        [
          idUtente,
          id_medico,
          1,
          nomeCompleto,
          dataNascimento,
          nIdentificacao,
          numero_utente,
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
          importacaoVeiculo1,
          submissaoReavaliacao1,
          dataSubmissaoReavaliacao1,
        ]
      );

      const pedidoId = result.rows[0].id_pedido;

      // Perform any additional logic or insert data into related tables if needed

      res.status(200).json({ success: true, pedidoId });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error submitting pedidoAvaliacao:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/api/utenteUSF", async (req, res) => {
  try {
    const { numero_utente, usf_name } = req.body;
    const checkForDups = await pool.query(
      `SELECT * FROM utenteUSF WHERE id_utente IN (SELECT id_utente FROM utentes WHERE numero_utente = $1) AND id_USF IN (SELECT id_USF FROM usf WHERE nomeusf = $2)`,
      [numero_utente, usf_name]
    );
    if (checkForDups.rows.length > 0) {
      return ;
      }
    

    const result = await pool.query(
      `
      INSERT INTO utenteusf (id_utente, id_usf)
SELECT utentes.id_utente, usf.id_usf
FROM utentes
JOIN usf ON utentes.numero_utente = $1
   AND usf.nomeusf = $2;

      `,
      [numero_utente, usf_name]
    );

    const insertedUtenteUSF = result.rows[0];
    res.status(201).json({ success: true, utenteUSF: insertedUtenteUSF });
  } catch (error) {
    console.error("Error creating utenteUSF:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/fetchpedidosAvaliacao", async (req, res) => {
  try {
    const email = req.query.email;

    const result = await pool.query(
      ` select id_perfil from users where email = $1 `,
      [email]
    );
      console.log('result === ' + result.rows);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utente not found" });
    }
    const { id_perfil } = result.rows[0];

    if (id_perfil == 2) 
    {
      const result = await pool.query(
        `select * from pedido_primeira_avaliacao where id_utente = (select id_utente from utentes where id_user_utente = (select id_user from users where email = $1))`,
        [email]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Utente sem pedidos de avaliação e/ou junta medica" });
      }
      const pedidos = result.rows;
      res.status(200).json({ success: true, pedidos });
    } 
    else if (id_perfil == 3) 
    {
      const result = await pool.query(
        `select * from pedido_primeira_avaliacao where id_medico = (select id_medico from medicos where id_user_medico = (select id_user from users where email = $1))`,
        [email]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "medico sem pedidos " });
      }
      const pedidos = result.rows;
      console.log(pedidos);
      res.status(200).json({ success: true, pedidos });
    }
   
    }
    catch (error) {
    console.error("Error fetching id_utente:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}); 

app.get("/api/numeroUtente", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await pool.query(
      `select numero_utente from utentes join users on utentes.id_user_utente = users.id_user where email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utente not found" });
    }

    const { numero_utente } = result.rows[0];
    res.status(200).json({ success: true, numero_utente });
  } catch (error) {
    console.error("Error fetching numero_utente:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/utenteID", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await pool.query(
      `select id_utente from utentes join users on utentes.id_user_utente = users.id_user where email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utente not found" });
    }

    const { id_utente } = result.rows[0];
    res.status(200).json({ success: true, id_utente });
  } catch (error) {
    console.error("Error fetching id_utente:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/api/createemployee", async (req, res) => {
  try {
    const { email, password, numero_cedula, nome_medico } = req.body;

    // Check if email is duplicated
    const checkEmailDuplicate = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );

    if (checkEmailDuplicate.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Inserting into the 'users' table
    const userResult = await pool.query(
      "INSERT INTO users (id_perfil, email, password) VALUES (3, $1, $2) RETURNING id_user",
      [email, password]
    );

    const id_user = userResult.rows[0].id_user;

    // Calling the 'loadmedico' API using axios.get
    const medicoData = await axios.get("http://localhost:3002/api/loadmedico", {
      params: { nome: nome_medico, numero_cedula: numero_cedula },
    });

    if (medicoData.data.length === 0) {
      await pool.query("DELETE FROM users WHERE id_user = $1", [id_user]);
      return res
        .status(404)
        .json({ success: false, error: "Medico data not found" });
    }

    // Assuming medicoData is an array, you might need to adjust accordingly
    const newnumero_cedula = medicoData.data[0].numero_cedula;
    const newnome_medico = medicoData.data[0].nome;

    // Inserting into the 'medicos' table
    const medicoResult = await pool.query(
      "INSERT INTO medicos (id_user_medico, numero_cedula, nome) VALUES ($1, $2, $3) RETURNING id_medico",
      [id_user, newnumero_cedula, newnome_medico]
    );

    const id_medico = medicoResult.rows[0].id_medico;
    console.log(medicoData);

    // Fetching the id_usf based on the data from the 'loadmedico' API
    const getUSF = await pool.query(
      "SELECT id_usf FROM usf WHERE nomeusf = $1",
      [medicoData.data[0].usf_name]
    );

    const id_usf = getUSF.rows[0].id_usf;
    console.log(id_usf);
    // Inserting into the 'usfmedico' table
    await pool.query(
      "INSERT INTO medicousf (id_usf, id_medico) VALUES ($1, $2)",
      [id_usf, id_medico]
    );

    // Sending a success response
    res
      .status(200)
      .json({ success: true, error: "Employee created successfully" });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/loadusf", async (req, res) => {
  try {
    // Obter todas as USFs do servidor RNU
    const rnuUsfs = await axios.get("http://localhost:3002/api/loadusf");

    // Verificar e inserir as USFs ausentes no servidor SAP
    for (const rnuUsf of rnuUsfs.data) {
      const existingUsf = await pool.query(
        "SELECT * FROM usf WHERE nomeusf = $1",
        [rnuUsf.nome_usf]
      );

      if (existingUsf.rows.length === 0) {
        // A USF não existe no servidor SAP, então insira
        await pool.query("INSERT INTO usf (nomeusf) VALUES ($1)", [
          rnuUsf.nome_usf,
        ]);
      }
    }
    console.log(rnuUsfs.data);

    res
      .status(200)
      .json({ success: true, message: "Load USFs completed successfully" });
  } catch (error) {
    console.error("Error loading USFs:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/schedules", (req, res) => {
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
          nome: row.nome,
          id_medico: row.id_medico,
          id: row.id_horario,
          dia_semana: diasemanastr(row.dia_semana),
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

function diasemanastr(int) {
  switch (int) {
    case 1:
      return "Segunda-feira";
      break;
    case 2:
      return "Terça-feira";
      break;
    case 3:
      return "Quarta-feira";
      break;
    case 4:
      return "Quinta-feira";
      break;
    case 5:
      return "Sexta-feira";
      break;
  }
}

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

app.post("/api/createschedule", (req, res) => {
  const {
    id_profissionalsaude,
    dia_semana,
    periodo_manha_inicio,
    periodo_manha_fim,
    periodo_tarde_inicio,
    periodo_tarde_fim,
  } = req.body;

  console.log(req.body);
  const dayOfWeek = parseInt(dia_semana);
  const morningStartTime = periodo_manha_inicio;
  const morningEndTime = periodo_manha_fim;
  const afternoonStartTime = periodo_tarde_inicio;
  const afternoonEndTime = periodo_tarde_fim;
  const insertQuery = `insert into horarios (id_medico,dia_semana,hora_inicio_manha,hora_fim_manha,hora_inicio_tarde,hora_fim_tarde) values ($1, $2, $3::time , $4::time , $5::time , $6::time)`;
  const insertValues = [
    id_profissionalsaude,
    dayOfWeek,
    morningStartTime,
    morningEndTime,
    afternoonStartTime,
    afternoonEndTime,
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

app.put("/api/alterschedule", (req, res) => {
  const {
    numero_cedula,
    dia_semana,
    periodo_manha_inicio,
    periodo_manha_fim,
    periodo_tarde_inicio,
    periodo_tarde_fim,
  } = req.body;
  console.log(req.body);

  pool.query(
    `UPDATE horarios
    SET 
      hora_inicio_manha = $2::time,
      hora_fim_manha = $3::time,
      hora_inicio_tarde = $4::time,
      hora_fim_tarde = $5::time
    FROM medicos
    WHERE horarios.id_medico = medicos.id_medico
      AND horarios.dia_semana = $1
      AND medicos.numero_cedula = $6;`,
    [
      parseInt(dia_semana),
      periodo_manha_inicio,
      periodo_manha_fim,
      periodo_tarde_inicio,
      periodo_tarde_fim,
      numero_cedula,
    ],
    (error, result) => {
      if (error) {
        console.error("Error executing update query:", error);
        let errorMessage = error.message;
        res.status(500).json({ error: errorMessage });
      } else {
        console.log("Schedule updated successfully");
        res.status(200).json({ message: "Schedule updated successfully" });
      }
    }
  );
});

app.put("/api/deactivateusers/:userId", (req, res) => {
  const userId = req.params.userId;

  pool.query(
    "UPDATE users SET estadoDeAtividade = 0 WHERE id_user = $1",
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error executing update query:", error);
        let errorMessage = error.message;
        res.status(500).json({ error: errorMessage });
      } else {
        console.log("User state changed successfully");
        res.status(200).json({ message: "User state changed successfully" });
      }
    }
  );
});

app.put("/api/updateusers/:userId", (req, res) => {
  const userId = req.params.userId;
  const { email, password, nome, perfil } = req.body;
  console.log(req.body);
  let id_perfil;
  if (perfil == "utente") {
    id_perfil = 2;
  } else if (perfil == "medico") {
    id_perfil = 3;
  }

  console.log(id_perfil);

  pool.query("BEGIN", (beginError) => {
    if (beginError) {
      console.error("Error starting transaction:", beginError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const updateTable = id_perfil === 2 ? "utentes" : "medicos";
    const idColumn = id_perfil === 2 ? "id_user_utente" : "id_user_medico";

    pool.query(
      "UPDATE users SET email = $1, password = $2 WHERE id_user = $3",
      [email, password, userId],
      (updateUsersError, result) => {
        if (updateUsersError) {
          console.error("Error updating users table:", updateUsersError);
          pool.query("ROLLBACK", () => {
            console.log("Rollback transaction");
            res.status(500).json({ error: "Internal Server Error" });
          });
        } else {
          pool.query(
            `UPDATE ${updateTable} SET nome = $1 WHERE ${idColumn} = $2`,
            [nome, userId],
            (updateRelatedTableError, result) => {
              if (updateRelatedTableError) {
                console.error(
                  "Error updating related table:",
                  updateRelatedTableError
                );
                pool.query("ROLLBACK", () => {
                  console.log("Rollback transaction");
                  res.status(500).json({ error: "Internal Server Error" });
                });
              } else {
                pool.query("COMMIT", (commitError) => {
                  if (commitError) {
                    console.error("Error committing transaction:", commitError);
                    res.status(500).json({ error: "Internal Server Error" });
                  } else {
                    console.log("Tables updated successfully");
                    res
                      .status(200)
                      .json({ message: "Tables updated successfully" });
                  }
                });
              }
            }
          );
        }
      }
    );
  });
});
app.post('/api/file', upload.array('files', 5), async (req, res) => {
  try {
    const { numero_utente } = req.body;
    console.log(req.body);

    // Assuming files are attached using the 'files' field
    const fileBuffers = req.files.map(file => file.buffer);

    const query = `
      INSERT INTO documentos (id_pedido, conteudo)
      VALUES (
        (SELECT id_pedido FROM pedido_primeira_avaliacao WHERE id_utente = (SELECT id_utente FROM utentes WHERE numero_utente = $1)),
        $2
      )`;
      
    const values = [numero_utente, fileBuffers];

    const result = await pool.query(query, values);

    console.log("Files created successfully");
    res.status(200).json({ message: "Files created successfully" });
  } catch (error) {
    console.error("Error executing insert query:", error);
    let errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
  }
});

app.get("/api/files", async (req, res) => {
  try {
    const { id_pedido } = req.query;
    id_pedido1 = parseInt(id_pedido);

    const query = `
      SELECT conteudo
      FROM documentos
     where id_pedido = $1
      `;
      
    const values = [id_pedido1];

    const result = await pool.query(query, values);

    console.log("Files fetched successfully");
    res.status(200).json({ message: "Files fetched successfully", data: result.rows });
  } catch (error) {
    console.error("Error executing query:", error);
    let errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
  }
});



app.listen(3001, () => {
  console.log("Server is listening on port 3001.");
});
