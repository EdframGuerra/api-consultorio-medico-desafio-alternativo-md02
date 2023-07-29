require('dotenv').config()
const app = require('./servidor')

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
    console.log(`Started ${new Date().toLocaleString('pt-br')}`)
})