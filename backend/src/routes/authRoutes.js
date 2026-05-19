const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

const router = express.Router();

// ROTA DE CADASTRO
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verifica se o e-mail já existe
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) return res.status(400).json({ message: "E-mail já cadastrado!" });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salva o novo comerciante
    const newMerchant = new Merchant({ email, password: hashedPassword });
    await newMerchant.save();

    res.status(201).json({ message: "Comerciante cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o comerciante
    const merchant = await Merchant.findOne({ email });
    if (!merchant) return res.status(404).json({ message: "Usuário não encontrado!" });

    // Compara a senha digitada com a senha criptografada do banco
    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta!" });

    // Cria o crachá de acesso (Token)
    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, merchantId: merchant._id });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

module.exports = router;