const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// ROTA DE BUSCA (GET)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.merchantId ? { merchantId: req.query.merchantId } : {};
    const stores = await Store.find(filter);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar lojas", error });
  }
});

// ROTA DE CRIAÇÃO (POST)
router.post('/', async (req, res) => {
  try {
    const newStore = new Store(req.body);
    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar loja", error });
  }
});

// ROTA DE ATUALIZAÇÃO (PUT) - NOVO!
router.put('/:id', async (req, res) => {
  try {
    // Procura a loja pelo ID e atualiza com os novos dados enviados
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar loja", error });
  }
});

// ROTA DE EXCLUSÃO (DELETE) - NOVO!
router.delete('/:id', async (req, res) => {
  try {
    // Procura a loja pelo ID e deleta do banco
    await Store.findByIdAndDelete(req.params.id);
    res.json({ message: "Loja deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar loja", error });
  }
});

module.exports = router;