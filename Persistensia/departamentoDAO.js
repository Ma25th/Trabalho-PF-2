import Departamento from "../Model/departamento.js";
import conectar from "./conexao.js";

export default class DepartamentoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS departamentos(
                    dep_codigo INT NOT NULL AUTO_INCREMENT,
                    dep_nome VARCHAR(100) NOT NULL,
                    dep_localizacao VARCHAR(100) NOT NULL,
                    dep_funcao VARCHAR(255) NOT NULL,  
                    CONSTRAINT pk_departamentos PRIMARY KEY(dep_codigo)
                );
            `;
            await conexao.execute(sql);
            conexao.release(); 
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "INSERT INTO departamentos(dep_nome, dep_localizacao, dep_funcao) VALUES(?, ?, ?)";
            const parametros = [departamento.nome, departamento.localizacao, departamento.funcao];

            const conexao = await conectar();
            try {
                const [retorno] = await conexao.execute(sql, parametros);
                departamento.codigo = retorno.insertId;
            } catch (erro) {
                console.log("Erro na execução do SQL:", erro.message);
            } finally {
                if (conexao) conexao.release();
            }
        }
    }

    async atualizar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "UPDATE departamentos SET dep_nome = ?, dep_localizacao = ?, dep_funcao = ? WHERE dep_codigo = ?";
            const parametros = [departamento.nome, departamento.localizacao, departamento.funcao, departamento.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } catch (erro) {
                console.log("Erro na atualização do departamento:", erro.message);
            } finally {
                if (conexao) conexao.release(); 
            }
        }
    }

    async excluir(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "DELETE FROM departamentos WHERE dep_codigo = ?";
            const parametros = [departamento.codigo];
            const conexao = await conectar();
            try {
                await conexao.execute(sql, parametros);
            } catch (erro) {
                console.log("Erro na exclusão do departamento:", erro.message);
            } finally {
                if (conexao) conexao.release();
            }
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM departamentos WHERE dep_codigo = ? ORDER BY dep_nome';
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM departamentos WHERE dep_nome LIKE ? ORDER BY dep_nome";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql, parametros);
            let listaDepartamentos = [];
            for (const registro of registros) {
                const departamento = new Departamento(registro.dep_codigo, registro.dep_nome, registro.dep_localizacao, registro.dep_funcao);
                listaDepartamentos.push(departamento);
            }
            return listaDepartamentos;
        } catch (erro) {
            console.log("Erro na consulta de departamentos:", erro.message);
            return [];
        } finally {
            if (conexao) conexao.release(); 
        }
    }

    async associarFuncionario(dep_id, func_id) {
        const sql = "INSERT INTO departamentos_funcionarios(dep_id, func_id) VALUES(?, ?)";
        const conexao = await conectar();
        try {
            await conexao.execute(sql, [dep_id, func_id]);
        } catch (erro) {
            console.log("Erro ao associar funcionário ao departamento:", erro.message);
        } finally {
            if (conexao) conexao.release(); 
        }
    }

    async desassociarFuncionario(dep_id, func_id) {
        const sql = "DELETE FROM departamentos_funcionarios WHERE dep_id = ? AND func_id = ?";
        const conexao = await conectar();
        try {
            await conexao.execute(sql, [dep_id, func_id]);
        } catch (erro) {
            console.log("Erro ao desassociar funcionário do departamento:", erro.message);
        } finally {
            if (conexao) conexao.release(); 
        }
    }

    async listarFuncionariosDoDepartamento(dep_id) {
        const sql = `
            SELECT f.func_codigo, f.func_nome, f.func_salario 
            FROM funcionarios f
            JOIN departamentos_funcionarios df ON f.func_codigo = df.func_id
            WHERE df.dep_id = ?`;
        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql, [dep_id]);
            return registros;
        } catch (erro) {
            console.log("Erro ao listar funcionários do departamento:", erro.message);
            return [];
        } finally {
            if (conexao) conexao.release(); 
        }
    }
    async atualizarAssociacaoFuncionarios(dep_id, funcionarios) {
        const conexao = await conectar();
        try {
           
            await conexao.execute("DELETE FROM departamentos_funcionarios WHERE dep_id = ?", [dep_id]);
    
           
            for (const func_id of funcionarios) {
                await conexao.execute("INSERT INTO departamentos_funcionarios(dep_id, func_id) VALUES(?, ?)", [dep_id, func_id]);
            }
        } catch (erro) {
            console.log("Erro ao atualizar associações de funcionários:", erro.message);
            throw erro;
        } finally {
            if (conexao) conexao.release(); 
        }
    }
    
    
    async listarTodosComFuncionarios() {
        const sql = `
            SELECT d.dep_codigo, d.dep_nome, d.dep_localizacao, d.dep_funcao,
                   f.func_codigo, f.func_nome, f.func_salario
            FROM departamentos d
            LEFT JOIN departamentos_funcionarios df ON d.dep_codigo = df.dep_id
            LEFT JOIN funcionarios f ON df.func_id = f.func_codigo
            ORDER BY d.dep_codigo, f.func_codigo;
        `;
        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql);
            let departamentosMap = new Map();

            registros.forEach((registro) => {
                const depId = registro.dep_codigo;

                if (!departamentosMap.has(depId)) {
                    departamentosMap.set(depId, {
                        codigo: depId,
                        nome: registro.dep_nome,
                        localizacao: registro.dep_localizacao,
                        funcao: registro.dep_funcao,
                        funcionarios: []
                    });
                }

                if (registro.func_codigo) {
                    departamentosMap.get(depId).funcionarios.push({
                        func_codigo: registro.func_codigo,
                        func_nome: registro.func_nome,
                        func_salario: registro.func_salario
                    });
                }
            });

            return Array.from(departamentosMap.values());
        } catch (erro) {
            console.log("Erro ao listar departamentos e funcionários:", erro.message);
            throw erro;
        } finally {
            if (conexao) conexao.release(); 
        }
    }
}
