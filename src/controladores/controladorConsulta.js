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

const cadastrarConsulta = async (req, res) => {
    const { tipo_consulta, valor_consulta, paciente } = req.body

    if (!tipo_consulta || !valor_consulta || !paciente) {
        console.log(paciente)
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    if (typeof valor_consulta !== 'number') {
        return res.status(400).json({ mensagem: 'O campo valor da consulta deve ser um número' })
    }

    const { nome, cpf, data_nascimento, celular, email, senha } = paciente

    if (!nome || !cpf || !data_nascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos do paciente são obrigatórios' })
    }

    try {
        const consultaExistente = await knex('consultas').where({ paciente: paciente.cpf }).first()

        if (consultaExistente) {
            return res.status(400).json({ mensagem: 'Já existe uma consulta em andamento com o cpf informado!' })
        }

        const cadastrarPaciente = await knex('paciente').insert({ nome, cpf, data_nascimento, celular, email, senha }).returning('*')

        if (!cadastrarPaciente) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o paciente' })
        }

        const consulta = await knex('consultas').insert({ tipo_consulta, valor_consulta, paciente: paciente.cpf, finalizada: false }).returning('*')

        if (!consulta) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar a consulta' })
        }

        const { id } = consulta[0]

        return res.status(201).json()

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: error.message })
    }
}

const atualizarDadosPaciente = async (req, res) => {
    const { nome, cpf, data_nascimento, celular, email, senha } = req.body
    const { id } = req.params

    if (!nome || !cpf || !data_nascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos do paciente são obrigatórios' })
    }

    try {
        const consulta = await knex('consultas').where({ id }).first()

        if (id) {
            if (!consulta) {
                return res.status(404).json({ mensagem: 'Consulta não encontrada' })
            }
        }

        if (cpf) {
            const paciente = await knex('paciente').where({ cpf }).first()

            if (paciente && paciente.cpf !== cpf) {
                return res.status(400).json({ mensagem: 'Já existe um paciente cadastrado com o cpf informado' })
            }
        }

        if (email) {
            const paciente = await knex('paciente').where({ email }).first()

            if (paciente && paciente.email !== email) {
                return res.status(400).json({ mensagem: 'Já existe um paciente cadastrado com o e-mail informado' })
            }
        }

        if (consulta.finalizada == true) {
            return res.status(400).json({ mensagem: 'Não é possivel atualizar uma consulta finalizada' })
        }

        const pacienteAtualizado = await knex('paciente').where({ cpf }).update({ nome, cpf, data_nascimento, celular, email, senha })

        if (!pacienteAtualizado) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar o paciente' })
        }

        return res.status(200).send()
    }



    catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const cancelarConsulta = async (req, res) => {
    const { id } = req.params

    try {
        const consulta = await knex('consultas').where({ id }).first()

        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada' })
        }

        if (consulta.finalizada == true) {
            return res.status(400).json({ mensagem: 'Não é possivel cancelar uma consulta finalizada' })
        }

        const consultaCancelada = await knex('consultas').where({ id }).del()

        if (!consultaCancelada) {
            return res.status(400).json({ mensagem: 'Não foi possível cancelar a consulta' })
        }

        return res.status(200).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


const finalizarConsulta = async (req, res) => {
    const { consulta_id, laudo } = req.body

    if (!laudo || !consulta_id) {
        return res.status(400).json({ mensagem: 'Os campos devem ser preenchidos' })
    }

    try {
        const consulta = await knex('consultas').where({ id: consulta_id }).first()
        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada' })
        }
        if (consulta.finalizada == true) {
            return res.status(400).json({ mensagem: 'Consulta já finalizada' })
        }

        if (laudo.length < 0 && laudo.length <= 200) {
            return res.status(400).json({
                mensagem: 'Laudo deve ter possuir no minimo 200 caracteres'
            })
        }
        const laudoMedico = await knex('consultas').where({ id: consulta_id }).update({ laudo, finalizada: true })

        if(!laudoMedico){
            return res.status(400).json({mensagem: 'Não foi possível finalizar a consulta'})
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}


module.exports = {
    listarConsultas,
    cadastrarConsulta,
    atualizarDadosPaciente,
    cancelarConsulta,
    finalizarConsulta
}