const conexao = require('../db/conexao')

exports.criarTarefas = (req, res) => {
    const { titulo, descricao } = req.body

    if (!titulo || titulo.trim() === '') {
        return res.status(400).send('O campo "titulo" é obrigatório e não pode estar vazio.')
    }
    if (!descricao || descricao.trim() === '') {
        return res.status(400).send('O campo "descricao" é obrigatório e não pode estar vazio.')
    }

    conexao.query(
        'INSERT INTO tarefas (titulo, descricao) VALUES (?,?)',
        [titulo, descricao],
        (err) => {
            if (err) {
                console.error('Erro ao cadastrar tarefa:', err)
                return res.status(500).send('Erro ao cadastrar tarefa')
            }
            res.status(201).send('Tarefa cadastrada com sucesso!')
        })
}

exports.listarTarefas = (req, res) => {
    conexao.query('SELECT * FROM tarefas', (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar tarefas')
        res.status(200).send(results)    
    })
}

exports.filtrarTarefas = (req, res) => {
    const { status } = req.query
    let sql = 'SELECT * FROM tarefas'
    const params = [];

    if (status) {
        sql += ' WHERE status = ?'
        params.push(status)
    }

    conexao.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err)
            return res.status(500).send('Erro ao buscar tarefas')
        }
        res.status(200).send(results)
    })
}

exports.atualizarTarefas = (req, res) => {
    const { id } = req.params
    const { titulo, descricao, status } = req.body

    if (!titulo || titulo.trim() === '') {
        return res.status(400).send('O campo "titulo" é obrigatório e não pode estar vazio.')
    }

    if (!descricao || descricao.trim() === '') {
        return res.status(400).send('O campo "descricao" é obrigatório e não pode estar vazio.')
    }

    if (!status || status.trim() === '') {
        return res.status(400).send('O campo "status" é obrigatório e não pode estar vazio.')
    }

    let query = 'UPDATE tarefas SET titulo = ?, descricao = ?, status = ?'
    const params = [titulo, descricao, status]

    if (status === 'concluida') {
        query += ', data_conclusao = CURRENT_TIMESTAMP'
    } else {
        query += ', data_conclusao = NULL'
    }

    query += ' WHERE id = ?'
    params.push(id)

    conexao.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao atualizar tarefa:', err)
            return res.status(500).send('Erro ao atualizar')
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Tarefa não encontrada')
        }
        res.send('Tarefa atualizada com sucesso')
    })
 }

exports.deletarTarefas = (req, res) => {
    const { id } = req.params

    conexao.query('DELETE FROM tarefas WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Erro ao deletar')
        if (results.affectedRows === 0) return res.status(404).send('Tarefa não encontrada')
        res.status(200).send('Tarefa deletada com sucesso')        
    })
}