import FuncionarioDAO from "../Persistensia/funcionarioDAO.js";

export default class Funcionario {
    
    #codigo;
    #nome;
    #salario;
    #departamentoId;

    constructor(codigo = 0, nome = '', salario = 0, departamentoId = 0) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#salario = salario;
        this.#departamentoId = departamentoId;
    }

   
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get salario() {
        return this.#salario;
    }

    set salario(novoSalario) {
        this.#salario = novoSalario;
    }

    get departamentoId() {
        return this.#departamentoId;
    }

    set departamentoId(novoDepartamentoId) {
        this.#departamentoId = novoDepartamentoId;
    }

    
    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            salario: this.#salario,
            departamentoId: this.#departamentoId
        }
    }

        async gravar() {
        const funcDAO = new FuncionarioDAO();
        await funcDAO.gravar(this);
    }

    async excluir() {
        const funcDAO = new FuncionarioDAO();
        await funcDAO.excluir(this);
    }

    async atualizar() {
        const funcDAO = new FuncionarioDAO();
        await funcDAO.atualizar(this);
    }

    async consultar(parametro) {
        const funcDAO = new FuncionarioDAO();
        return await funcDAO.consultar(parametro);
    }
}
