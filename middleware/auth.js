// middleware/auth.js
import jwt from 'jsonwebtoken';

const segredo = 'seuSegredoJWT'; // Mude para um segredo seguro e único

export function autenticarToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ mensagem: 'Acesso negado, token não fornecido!' });

    try {
        const decoded = jwt.verify(token, segredo);
        req.usuario = decoded;
        next();
    } catch (erro) {
        res.status(403).json({ mensagem: 'Token inválido!' });
    }
}
