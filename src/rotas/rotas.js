const express = require('express')

const rotas = express.Router()

rotas.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = rotas