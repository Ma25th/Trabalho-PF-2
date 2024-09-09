import { Router } from "express";
import FuncionarioCtrl from "../Controller/funcionarioCtrl.js"; 

const funcionarioCtrl = new FuncionarioCtrl();
const rotaFuncionario = new Router();

rotaFuncionario
    .get('/', funcionarioCtrl.consultar)
    .get('/:termo', funcionarioCtrl.consultar)
    .post('/', funcionarioCtrl.gravar)
    .patch('/', funcionarioCtrl.atualizar)
    .put('/', funcionarioCtrl.atualizar)
    .delete('/', funcionarioCtrl.excluir);

export default rotaFuncionario;
