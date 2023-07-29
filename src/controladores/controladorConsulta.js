const knex = require('../conexaoBancoDados/conexao')

const listarConsultas = async (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query

    if (!cnes_consultorio || !senha_consultorio) {
        return res.status(404).json({ mensagem: 'O campos cnes_consultorio e senha_consultório são  obrigatórios' })
    }

    if (cnes_consultorio !== 1001 || senha_consultorio !== 'CubosHealth@2022') {
        return res.status(404).json({ mensagem: 'Acesso negado' })
    }

    try {
        const listarConsultas = await knex('consultas').returning('*')
        return res.status(201).json(listarConsultas)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno servidor' })
    }



}

module.exports = {
    listarConsultas
}