import { Router } from "express";
import DepartamentoCtrl from "../Controller/departamentoCtrl.js";

const depCtrl = new DepartamentoCtrl();
const rotaDepartamento = new Router();
rotaDepartamento.get('/todos/com-funcionarios', depCtrl.listarTodosComFuncionarios);
rotaDepartamento.delete('/desassociar', depCtrl.desassociarFuncionario);
rotaDepartamento.put('/associar', depCtrl.atualizarAssociacaoFuncionario);

// Definindo as rotas para o departamento
rotaDepartamento
    .get('/', depCtrl.consultar)
    .get('/:termo', depCtrl.consultar)
    .post('/', depCtrl.gravar)
    .patch('/', depCtrl.atualizar)
    .put('/', depCtrl.atualizar)
    .delete('/', depCtrl.excluir)
    .post('/associar', depCtrl.associarFuncionario) // Rota para associar funcionários
    .get('/:dep_id/funcionarios', depCtrl.listarFuncionariosDoDepartamento); // Nova rota adicionada

export default rotaDepartamento;
