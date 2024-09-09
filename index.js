import express from 'express';
import cors from 'cors';
import rotaDepartamento from './Routes/rotadepartamento.js';
import rotaFuncionario from './Routes/rotafuncionario.js';
import { autenticarToken } from './middleware/auth.js'; // Importe o middleware de autenticação corretamente
import { login } from './Controller/usuarioCtrl.js'; // Importe o controlador de login

const host = '0.0.0.0';
const porta = 3000;

const app = express(); // Inicialize o Express primeiro

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota de login (autenticação) - Não protegida
app.post('/login', login);

// Rotas protegidas por autenticação
app.use('/departamento', autenticarToken, rotaDepartamento);
app.use('/funcionario', autenticarToken, rotaFuncionario);

app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});
