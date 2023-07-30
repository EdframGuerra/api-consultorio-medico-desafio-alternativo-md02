const express = require('express')
const { listarConsultas, cadastrarConsulta, atualizarDadosPaciente } = require('../controladores/controladorConsulta')

const rotas = express.Router()

rotas.get('/consultas', listarConsultas)
rotas.post('/consulta', cadastrarConsulta)
rotas.put('/consulta/:id/paciente', atualizarDadosPaciente)


module.exports = rotas