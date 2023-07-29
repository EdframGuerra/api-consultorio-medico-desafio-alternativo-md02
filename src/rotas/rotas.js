const express = require('express')
const { listarConsultas } = require('../controladores/controladorConsulta')

const rotas = express.Router()

rotas.get('/consultas', listarConsultas)

module.exports = rotas