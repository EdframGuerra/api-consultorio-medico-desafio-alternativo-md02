const consultas = async (req, res) => {
    // na tabela de consultas onde o medico_id é igual ao id, selecione todas as consultas que a coluna finalizada for == true

    const { id } = req.usuario

    const consultas = await knex('consultas')
        .where({ medico_id: id })
        .select('*')

    const consultasFinalizadas = consultas.filter(consulta => consulta.finalizada === true)

    res.status(200).json(consultasFinalizadas)

}



// const listarMedico = async (req, res) => {
//     const { id } = req.query

//     if (!id) {
//         return res.status(400).json({ mensagem: 'Informe o id do médico' })
//     }

//     try {

//         const medicoExiste = await knex('medicos').where({ id }).first()

//         if (!medicoExiste) {
//             return res.status(404).json({ mensagem: 'Médico não encontrado' })
//         }

//         const consultaRealizadaPeloMedico = await knex('consultas').where({ medico_id: id }).join('pacientes', 'pacientes.cpf', 'consultas.paciente').join('medicos', 'medicos.id', 'consultas.medico_id').join('laudo', 'laudo.consulta_id', 'consultas.id').select('consultas.id', 'consultas.tipo_consulta', 'consultas.valor_consulta', 'consultas.finalizada', 'pacientes.nome as nome_paciente', 'pacientes.cpf as cpf_paciente', 'pacientes.data_nascimento as data_nascimento_paciente', 'pacientes.celular as celular_paciente', 'pacientes.email as email_paciente', 'medicos.id as medico_id', 'laudo.id as laudo_id').orderBy('consultas.id')



//         if (!consultaRealizadaPeloMedico) {
//             return res.status(404).json({ mensagem: 'Não foi possível listar as consultas realizadas pelo médico' })
//         }

//         const consultas = consultaRealizadaPeloMedico.map(item => {
//             return item = {
//                 id: item.id,
//                 tipo_consulta: item.tipo_consulta,
//                 medico_id: item.medico_id,
//                 finalizada: item.finalizada,
//                 laudo_id: item.laudo_id,
//                 valor_consulta: item.valor_consulta,
//                 paciente: {
//                     nome: item.nome_paciente,
//                     cpf: item.cpf_paciente,
//                     data_nascimento: item.data_nascimento_paciente,
//                     celular: item.celular_paciente,
//                     email: item.email_paciente,
//                     senha: item.senha_paciente
//                 }
//             }
//         })

//         if (consultas.finalizada = false) {
//             return res.status(400).json({ mensagem: 'Consulta não finalizada' })
//         }

//         return res.status(200).json(consultas)

//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ mensagem: 'Erro interno do servidor' })
//     }
// }