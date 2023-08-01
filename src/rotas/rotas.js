const express = require('express')
const { listarConsultas, cadastrarConsulta, atualizarDadosPaciente, cancelarConsulta, finalizarConsulta, laudoMedico, listarMedico } = require('../controladores/controladorConsulta')
const { validacao } = require('../intermediarios/intermediario')

const rotas = express.Router()

rotas.get('/consultas', validacao, listarConsultas)
rotas.post('/consulta', cadastrarConsulta)
rotas.put('/consulta/:id/paciente', atualizarDadosPaciente)
rotas.delete('/consulta/:id', cancelarConsulta)
rotas.post('/consulta/finalizar', finalizarConsulta)
rotas.get('/consulta/laudo', laudoMedico)
rotas.get('/consulta/medico', listarMedico)


module.exports = rotas