// Controller/usuarioCtrl.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Defina um segredo seguro para o JWT. Em um projeto real, este segredo deve estar em uma variável de ambiente.
const segredo = 'seuSegredoJWT';

// Função de login para verificar credenciais e gerar um token JWT
export async function login(req, res) {
    const { email, senha } = req.body;

    // Simulação de usuário - substitua isso pela lógica real de busca no banco de dados
    const usuarioSimulado = {
        email: 'seuEmail@example.com',
        senha: bcrypt.hashSync('suaSenha', 8) // Senha criptografada
    };

    // Verifique se o email corresponde ao usuário simulado
    if (email === usuarioSimulado.email) {
        // Verifique se a senha informada corresponde à senha armazenada
        const senhaValida = bcrypt.compareSync(senha, usuarioSimulado.senha);
        
        if (senhaValida) {
            // Se a senha for válida, gere um token JWT
            const token = jwt.sign({ email }, segredo, { expiresIn: '1h' });
            return res.json({ token });
        } else {
            return res.status(401).json({ mensagem: 'Senha inválida!' });
        }
    } else {
        return res.status(404).json({ mensagem: 'Usuário não encontrado!' });
    }
}
