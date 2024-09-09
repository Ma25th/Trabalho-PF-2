
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const segredo = 'seuSegredoJWT';


export async function login(req, res) {
    const { email, senha } = req.body;

    
    const usuarioSimulado = {
        email: 'matheus@gmail.com',
        senha: bcrypt.hashSync('12345678', 8)
    };

   
    if (email === usuarioSimulado.email) {
        
        const senhaValida = bcrypt.compareSync(senha, usuarioSimulado.senha);
        
        if (senhaValida) {
            
            const token = jwt.sign({ email }, segredo, { expiresIn: '1h' });
            return res.json({ token });
        } else {
            return res.status(401).json({ mensagem: 'Senha inválida!' });
        }
    } else {
        return res.status(404).json({ mensagem: 'Usuário não encontrado!' });
    }
}
