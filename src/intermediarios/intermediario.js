const validacao = async (req, res, next) => {
    const { cnes_consultorio, senha_consultorio } = req.query

    if (!cnes_consultorio || !senha_consultorio) {
        return res.status(404).json({ mensagem: 'O campos cnes_consultorio e senha_consultório são  obrigatórios' })
    }

    if (cnes_consultorio !== '1001' && senha_consultorio !== 'CubosHealth@2022') {
        return res.status(404).json({ mensagem: 'Acesso negado' })
    }

    next()
}

module.exports = {
    validacao
}