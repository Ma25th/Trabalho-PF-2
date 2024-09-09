import Funcionario from "../Model/funcionario.js";
import conectar from "./conexao.js";

export default class FuncionarioDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS funcionarios(
                    func_codigo INT NOT NULL AUTO_INCREMENT,
                    func_nome VARCHAR(100) NOT NULL,
                    func_salario DECIMAL(10,2) NOT NULL DEFAULT 0,
                    dep_codigo INT NOT NULL,
                    CONSTRAINT pk_funcionarios PRIMARY KEY(func_codigo),
                    CONSTRAINT fk_funcionarios_departamento FOREIGN KEY(dep_codigo)
                        REFERENCES departamentos(dep_codigo)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE
                );
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(funcionario) {
        if (funcionario instanceof Funcionario) {
            const sql = "INSERT INTO funcionarios(func_nome, func_salario, dep_codigo) VALUES(?, ?, ?)"; 
            const parametros = [funcionario.nome, funcionario.salario, funcionario.departamentoId];
            const conexao = await conectar(); 
            const retorno = await conexao.execute(sql, parametros); 
            funcionario.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(funcionario) {
        if (funcionario instanceof Funcionario) {
            const sql = "UPDATE funcionarios SET func_nome = ?, func_salario = ?, dep_codigo = ? WHERE func_codigo = ?"; 
            const parametros = [funcionario.nome, funcionario.salario, funcionario.departamentoId, funcionario.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const sql = "DELETE FROM funcionarios WHERE func_codigo = ?"; 
            const parametros = [funcionario.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM funcionarios WHERE func_codigo = ? ORDER BY func_nome';
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM funcionarios WHERE func_nome LIKE ? ORDER BY func_nome";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        let listaFuncionarios = [];
        for (const registro of registros) {
            const funcionario = new Funcionario(registro.func_codigo, registro.func_nome, registro.func_salario, registro.dep_codigo);
            listaFuncionarios.push(funcionario);
        }
        return listaFuncionarios;
    }

   
    async associarDepartamento(func_id, dep_id) {
        const sql = "INSERT INTO departamentos_funcionarios(func_id, dep_id) VALUES(?, ?)";
        const conexao = await conectar();
        try {
            await conexao.execute(sql, [func_id, dep_id]);
        } catch (erro) {
            console.log("Erro ao associar departamento ao funcionário:", erro.message);
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }

   
    async desassociarDepartamento(func_id, dep_id) {
        const sql = "DELETE FROM departamentos_funcionarios WHERE func_id = ? AND dep_id = ?";
        const conexao = await conectar();
        try {
            await conexao.execute(sql, [func_id, dep_id]);
        } catch (erro) {
            console.log("Erro ao desassociar departamento do funcionário:", erro.message);
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    
    async listarDepartamentosDoFuncionario(func_id) {
        const sql = `
            SELECT d.dep_codigo, d.dep_nome, d.dep_localizacao 
            FROM departamentos d
            JOIN departamentos_funcionarios df ON d.dep_codigo = df.dep_id
            WHERE df.func_id = ?`;
        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql, [func_id]);
            return registros;
        } catch (erro) {
            console.log("Erro ao listar departamentos do funcionário:", erro.message);
            return [];
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}
