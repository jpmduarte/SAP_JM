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
      return res.json({ success: false ,erro: "Utilizador e/ou palavra-passe incorretos"});
    } 
    const id_perfil = user.rows[0].id_perfil;
    console.log(id_perfil);
    return res.json({ success: true, perfil: id_perfil });

  } catch (err) {
    console.error(err.message);
  }
});


app.post("/api/register", async (req, res) => {
  try{
    const { email, password, nome, numeroUtente} = req.body;
    id_perfil = 2;

      checkMail = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$");
      if(!checkMail.test(email)){
        return res.json({ success: false ,erro: "Email inválido"});
      }
      checkPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$");
      if(!checkPassword.test(password)){
        return res.json({ success: false ,erro: "Password inválida,  a password deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número"});
      }
      checkNumeroUtente = new RegExp("^[0-9]{9}$");
      if(!checkNumeroUtente.test(numeroUtente)){
        return res.json({ success: false ,erro: "Número de utente inválido"});
      }
      checkNome = new RegExp("^[a-zA-Z]+(?:\\s[a-zA-Z]+){1,29}$");
      if(!checkNome.test(nome)){
        return res.json({ success: false ,erro: "Nome inválido"});
      }
    

    checkEmailDuplicate = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );
    if(checkEmailDuplicate.rows.length > 0){
      return res.json({ success: false ,erro: "Email já registado"});
    }
    const user = await pool.query(
      "insert into  users (id_perfil,email, password) values ($1, $2, $3)",
      [id_perfil, email,password]
    );
    const id_user = await pool.query(
      "select id_user from users where email = $1",
      [email]
    );
    if(id_user.rows[0].id_user == 0){
      return res.json({ success: false ,erro: "erro ao inserir utilizador"});
    }

    const id = id_user.rows[0].id_user;
    const utente = await pool.query(
      "insert into utentes (id_user_utente, numero_utente,nome) values ($1, $2, $3)",
      [id, numeroUtente,nome]
    );
    return res.json({ success: true });
  }catch (err) {
    console.error(err.message);
  }
});



app.listen(3001, () => {
  console.log("Server is listening on port 3001.");
});
