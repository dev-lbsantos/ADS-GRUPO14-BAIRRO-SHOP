const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar lojas", error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newStore = new Store(req.body);
    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar loja", error });
  }
});

module.exports = router;