const express = require('express')
const router = express.Router()
const tarefasController = require('../controllers/tarefasControllers')

router.post('/', tarefasController.criarTarefas)
router.get('/', tarefasController.listarTarefas)
router.get('/status', tarefasController.filtrarTarefas)
router.put('/:id', tarefasController.atualizarTarefas)
router.delete('/:id', tarefasController.deletarTarefas)

module.exports = router