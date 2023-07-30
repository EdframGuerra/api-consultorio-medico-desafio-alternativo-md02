const express = require('express')
const { listarConsultas, cadastrarConsulta } = require('../controladores/controladorConsulta')

const rotas = express.Router()

rotas.get('/consultas', listarConsultas)
rotas.post('/consulta', cadastrarConsulta)

module.exports = rotas