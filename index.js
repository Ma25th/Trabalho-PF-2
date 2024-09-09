import express from 'express';
import cors from 'cors';
import rotaDepartamento from './Routes/rotadepartamento.js';
import rotaFuncionario from './Routes/rotafuncionario.js';
import { autenticarToken } from './middleware/auth.js'; 
import { login } from './Controller/usuarioCtrl.js'; 

const host = '0.0.0.0';
const porta = 3000;

const app = express(); 

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/login', login);


app.use('/departamento', autenticarToken, rotaDepartamento);
app.use('/funcionario', autenticarToken, rotaFuncionario);

app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});
