const knex = require('../conexaoBancoDados/conexao')

const listarConsultas = async (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query

    if (!cnes_consultorio || !senha_consultorio) {
        return res.status(404).json({ mensagem: 'O campos cnes_consultorio e senha_consultório são  obrigatórios' })
    }

    if (cnes_consultorio !== '1001' && senha_consultorio !== 'CubosHealth@2022') {
        return res.status(404).json({ mensagem: 'Acesso negado' })
    }

    try {

        //     //listar os dados da tabela consultas conforme o objnto {
        // identificador: 3,
        // tipoConsulta: "ODONTOLOGIA",
        // identificadorMedico: 1,
        // finalizada: false,
        // valorConsulta: 5000,
        // paciente: {
        //   nome: "John Doe 3",
        //   cpf: "55132392053",
        //   dataNascimento: "2022-02-02",
        //   celular: "11999997777",
        //   email: "john@doe3.com",
        //   senha: "1234",
        // }

        const consultas = await knex('consultas').join('pacientes', 'pacientes.cpf', 'consultas.paciente').join('medicos', 'medicos.id', 'consultas.medico_id').select('consultas.id', 'consultas.tipo_consulta', 'consultas.valor_consulta', 'consultas.finalizada', 'pacientes.nome as nome_paciente', 'pacientes.cpf as cpf_paciente', 'pacientes.data_nascimento as data_nascimento_paciente', 'pacientes.celular as celular_paciente', 'pacientes.email as email_paciente', 'medicos.nome as nome_medico', 'medicos.especialidade as especialidade_medico').orderBy('consultas.id')

        if (!consultas) {
            return res.status(400).json({ mensagem: 'Não foi possível listar as consultas' })
        }

        return res.status(200).json(consultas)

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

        const cadastrarPaciente = await knex('pacientes').insert({ nome, cpf, data_nascimento, celular, email, senha }).returning('*')

        if (!cadastrarPaciente) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o paciente' })
        }

        const medico = await knex('medicos').where({ especialidade: tipo_consulta }).first()

        if (tipo_consulta) {
            const medico = await knex('medicos').where({ especialidade: tipo_consulta }).first()

            if (!medico) {
                return res.status(400).json({ mensagem: 'Não existe médico cadastrado com a especialidade informada' })
            }
        }

        const consulta = await knex('consultas').insert({ tipo_consulta, medico_id: medico.id, valor_consulta, paciente: paciente.cpf, finalizada: false }).returning('*')

        if (!consulta) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar a consulta' })
        }

        // const { id } = consulta[0]

        return res.status(201).json()

    } catch (error) {
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
            const paciente = await knex('pacientes').where({ cpf }).first()

            if (paciente && paciente.cpf !== cpf) {
                return res.status(400).json({ mensagem: 'Já existe um paciente cadastrado com o cpf informado' })
            }
        }

        if (email) {
            const paciente = await knex('pacientes').where({ email }).first()

            if (paciente && paciente.email !== email) {
                return res.status(400).json({ mensagem: 'Já existe um paciente cadastrado com o e-mail informado' })
            }
        }

        if (consulta.finalizada == true) {
            return res.status(400).json({ mensagem: 'Não é possivel atualizar uma consulta finalizada' })
        }

        const pacienteAtualizado = await knex('pacientes').where({ id }).update({ nome, cpf, data_nascimento, celular, email, senha })

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

        const paciente = consulta.paciente[0]

        const laudoMedico = await knex('laudo').insert({ consulta_id, medico_id: consulta.medico_id, laudo, paciente_id: consulta.id })
            .join('consultas', 'consultas.id', 'laudo.consulta_id').join('medicos', 'medicos.id', 'laudo.medico_id').join('pacientes', 'pacientes.id', 'laudo.paciente_id').select('laudo.id', 'laudo.laudo', 'consultas.tipo_consulta', 'consultas.valor_consulta', 'consultas.finalizada', 'pacientes.nome as nome_paciente', 'pacientes.cpf as cpf_paciente', 'pacientes.data_nascimento as data_nascimento_paciente', 'pacientes.celular as celular_paciente', 'pacientes.email as email_paciente', 'medicos.nome as nome_medico', 'medicos.especialidade as especialidade_medico').orderBy('consultas.id')


        if (!laudoMedico) {
            return res.status(400).json({ mensagem: 'Não foi possível finalizar a consulta' })
        }

        if (laudoMedico) {
            const finalizada = await knex('consultas').where({ id: consulta_id }).update({ finalizada: true })

            if (!finalizada) {
                return res.status(400).json({ mensagem: 'Não foi possível finalizar a consulta' })
            }
        }

        const consultaFinalizada = await knex('consulta_finalizada')
            .insert({ tipo_consulta: consulta.tipo_consulta, medico_id: consulta.medico_id, finalizada: true, laudo_id: laudoMedico.id, valor_consulta: consulta.valor_consulta, paciente_id: consulta.id }).join('consultas', 'consultas.id', 'consulta_finalizada.consulta_id')
            .join('medicos', 'medicos.id', 'consulta_finalizada.medico_id')
            .join('pacientes', 'pacientes.id', 'consulta_finalizada.paciente_id')
            .join('laudo', 'laudo.id').select('consulta_finalizada.id', 'consulta_finalizada.tipo_consulta', 'consulta_finalizada.valor_consulta', 'consulta_finalizada.finalizada', 'pacientes.nome as nome_paciente', 'pacientes.cpf as cpf_paciente', 'pacientes.data_nascimento as data_nascimento_paciente', 'pacientes.celular as celular_paciente', 'pacientes.email as email_paciente', 'medicos.nome as nome_medico', 'medicos.especialidade as especialidade_medico')
            .orderBy('consultas.id')

        if (!consultaFinalizada) {
            return res.status(400).json({ mensagem: 'Não foi possível finalizar a consulta' })
        }


        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}


const laudoMedico = async (req, res) => {
    const { id, senha } = req.query

    if (!id && !senha) {
        return res.status(400).json({ mensagem: 'Informe os dados obrigatórios' })
    }

    if (senha !== '1234') {
        return res.status(400).json({ mensagem: 'Aceeso não autenticado' })
    }

    try {
        const consulta = await knex('laudo').where({ consulta_id: id }).first()

        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada' })
        }

        if (consulta.finalizada == false) {
            return res.status(400).json({ mensagem: 'Não é possivel visualizar o laudo de uma consulta não finalizada' })
        }

        const { laudo } = consulta

        if (!laudo) {
            return res.status(404).json({ mensagem: 'Laudo não encontrado' })
        }

        return res.status(200).json({ laudo })


    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarMedico = async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ mensagem: 'Informe o id do médico' })
    }

    try {

        const medicoExiste = await knex('medicos').where({ id }).first()

        if (!medicoExiste) {
            return res.status(404).json({ mensagem: 'Médico não encontrado' })
        }

        const consultaRealizadaPeloMedico = await knex('consultas').where({ medico_id: id })
            .join('pacientes', 'pacientes.cpf', 'consultas.paciente')
            .join('medicos', 'medicos.id', 'consultas.medico_id')
            .select('consultas.id', 'consultas.tipo_consulta', 'consultas.valor_consulta', 'consultas.finalizada', 'pacientes.nome as nome_paciente', 'pacientes.cpf as cpf_paciente', 'pacientes.data_nascimento as data_nascimento_paciente', 'pacientes.celular as celular_paciente', 'pacientes.email as email_paciente', 'medicos.nome as nome_medico', 'medicos.especialidade as especialidade_medico').orderBy('consultas.id')

        if (!consultaRealizadaPeloMedico) {
            return res.status(404).json({ mensagem: 'Não foi possível listar as consultas realizadas pelo médico' })
        }

        return res.status(200).json(consultaRealizadaPeloMedico)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}




module.exports = {
    listarConsultas,
    cadastrarConsulta,
    atualizarDadosPaciente,
    cancelarConsulta,
    finalizarConsulta,
    laudoMedico,
    listarMedico
}