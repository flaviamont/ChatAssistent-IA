require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./src/routes/router");

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexão com o banco de dados estabelecida!"))
    .catch(err => console.log("Ocorreu um erro ao estabelecer a conexão com o banco de dados: ", err));


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));