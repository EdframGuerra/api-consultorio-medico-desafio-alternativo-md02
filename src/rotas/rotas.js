const express = require('express')
const { listarConsultas, cadastrarConsulta, atualizarDadosPaciente, cancelarConsulta, finalizarConsulta, listarMedico, ListarlaudoMedico, listarConsultasMedico } = require('../controladores/controladorConsulta')
const { validacao } = require('../intermediarios/intermediario')

const rotas = express.Router()

rotas.get('/consultas', validacao, listarConsultas)
rotas.post('/consulta', cadastrarConsulta)
rotas.put('/consulta/:id/paciente', atualizarDadosPaciente)
rotas.delete('/consulta/:id', cancelarConsulta)
rotas.post('/consulta/finalizar', finalizarConsulta)
rotas.get('/consulta/laudo', ListarlaudoMedico)
rotas.get('/consulta/medico', listarConsultasMedico)


module.exports = rotas