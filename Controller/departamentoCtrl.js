import Departamento from "../Model/departamento.js";
import DepartamentoDAO from "../Persistensia/departamentoDAO.js"; 

export default class DepartamentoCtrl {
    constructor() {
        this.departamentoDAO = new DepartamentoDAO(); 

       
        this.gravar = this.gravar.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.excluir = this.excluir.bind(this);
        this.associarFuncionario = this.associarFuncionario.bind(this);
        this.desassociarFuncionario = this.desassociarFuncionario.bind(this); 
        this.atualizarAssociacaoFuncionario = this.atualizarAssociacaoFuncionario.bind(this); 
        this.consultar = this.consultar.bind(this);
        this.listarFuncionariosDoDepartamento = this.listarFuncionariosDoDepartamento.bind(this);
        this.listarTodosComFuncionarios = this.listarTodosComFuncionarios.bind(this); 
    }

   
    listarFuncionariosDoDepartamento(requisicao, resposta) {
        const { dep_id } = requisicao.params;
        this.departamentoDAO.listarFuncionariosDoDepartamento(dep_id)
            .then((funcionarios) => {
                resposta.json({ status: true, funcionarios });
            })
            .catch((erro) => {
                resposta.status(500).json({ status: false, mensagem: 'Erro ao listar funcionários do departamento: ' + erro.message });
            });
    }
    atualizarAssociacaoFuncionario(requisicao, resposta) {
        const { dep_id, funcionarios } = requisicao.body; 
        if (dep_id && Array.isArray(funcionarios)) {
            this.departamentoDAO.atualizarAssociacaoFuncionarios(dep_id, funcionarios)
                .then(() => resposta.json({ status: true, mensagem: 'Associações de funcionários atualizadas com sucesso!' }))
                .catch(erro => resposta.status(500).json({ status: false, mensagem: 'Erro ao atualizar associações: ' + erro.message }));
        } else {
            resposta.status(400).json({ status: false, mensagem: 'Dep_id e lista de funcionários são obrigatórios!' });
        }
    }
    
   
    listarTodosComFuncionarios(requisicao, resposta) {
        this.departamentoDAO.listarTodosComFuncionarios()
            .then((departamentos) => {
                resposta.json({ status: true, departamentos });
            })
            .catch((erro) => {
                resposta.status(500).json({ status: false, mensagem: 'Erro ao listar departamentos e seus funcionários: ' + erro.message });
            });
    }
    desassociarFuncionario(requisicao, resposta) {
        const { dep_id, func_id } = requisicao.body;
        if (dep_id && func_id) {
            this.departamentoDAO.desassociarFuncionario(dep_id, func_id)
                .then(() => resposta.json({ status: true, mensagem: 'Funcionário desassociado do departamento com sucesso!' }))
                .catch(erro => resposta.status(500).json({ status: false, mensagem: 'Erro ao desassociar funcionário: ' + erro.message }));
        } else {
            resposta.status(400).json({ status: false, mensagem: 'Dep_id e Func_id são obrigatórios!' });
        }
    }
    
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const { nome, localizacao, funcao } = requisicao.body;

            if (nome && localizacao) {
                const departamento = new Departamento(0, nome, localizacao, funcao);
                departamento.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": departamento.codigo,
                        "mensagem": "Departamento incluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o departamento: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome e a localização do departamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um departamento!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const { codigo, nome, funcao, localizacao } = requisicao.body;

            if (codigo && nome && localizacao) {
                const departamento = new Departamento(codigo, nome, localizacao, funcao);
                departamento.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Departamento atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o departamento: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código, o nome e a localização do departamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um departamento!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const { codigo } = requisicao.body;

            if (codigo) {
                const departamento = new Departamento(codigo);
                departamento.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Departamento excluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o departamento: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do departamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um departamento!"
            });
        }
    }

    associarFuncionario(requisicao, resposta) {
        const { dep_id, func_id } = requisicao.body;
        if (dep_id && func_id) {
            this.departamentoDAO.associarFuncionario(dep_id, func_id)
                .then(() => resposta.json({ status: true, mensagem: 'Funcionário associado ao departamento com sucesso!' }))
                .catch(erro => resposta.status(500).json({ status: false, mensagem: 'Erro ao associar funcionário: ' + erro.message }));
        } else {
            resposta.status(400).json({ status: false, mensagem: 'Dep_id e Func_id são obrigatórios!' });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || '';
        if (requisicao.method === "GET") {
            const departamento = new Departamento();
            departamento.consultar(termo).then((listaDepartamentos) => {
                resposta.json({
                    status: true,
                    listaDepartamentos
                });
            }).catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os departamentos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar departamentos!"
            });
        }
    }
}
