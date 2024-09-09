import DepartamentoDAO from "../Persistensia/departamentoDAO.js";

export default class Departamento {
    #codigo;
    #nome;
    #localizacao;
    #funcao;

    constructor(codigo = 0, nome = '', localizacao = '', funcao = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#localizacao = localizacao;
        this.#funcao = funcao;
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

    get localizacao() {
        return this.#localizacao;
    }

    set localizacao(novaLocalizacao) {
        this.#localizacao = novaLocalizacao;
    }

    get funcao() {
        return this.#funcao;
    }

    set funcao(novaFuncao) {
        this.#funcao = novaFuncao;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            localizacao: this.#localizacao,
            funcao: this.#funcao
        };
    }

    
    async gravar() {
        const depDAO = new DepartamentoDAO();
        await depDAO.gravar(this);
    }

    async excluir() {
        const depDAO = new DepartamentoDAO();
        await depDAO.excluir(this);
    }

    async atualizar() {
        const depDAO = new DepartamentoDAO();
        await depDAO.atualizar(this);
    }

    async consultar(parametro) {
        const depDAO = new DepartamentoDAO();
        return await depDAO.consultar(parametro);
    }
}
