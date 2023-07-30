const express = require('express')
const { listarConsultas, cadastrarConsulta, atualizarDadosPaciente, cancelarConsulta, finalizarConsulta } = require('../controladores/controladorConsulta')

const rotas = express.Router()

rotas.get('/consultas', listarConsultas)
rotas.post('/consulta', cadastrarConsulta)
rotas.put('/consulta/:id/paciente', atualizarDadosPaciente)
rotas.delete('/consulta/:id', cancelarConsulta)
rotas.put('/consulta/:id/finalizar', finalizarConsulta)


module.exports = rotas