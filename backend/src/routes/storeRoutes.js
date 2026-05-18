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

    console.log("Dados recebidos:");
    console.log(req.body);

    const {
      name,
      category,
      cep,
      address,
      phone,
      products
    } = req.body;

    // procura pela loja usando telefone OU nome
    let existingStore = await Store.findOne({
      $or: [
        { phone: phone },
        { name: name }
      ]
    });

    if (existingStore) {

      // adiciona produtos à loja existente
      if (products && products.length > 0) {
        existingStore.products.push(...products);
      }

      const updatedStore = await existingStore.save();

      return res.status(200).json({
        message: "Loja existente atualizada",
        store: updatedStore
      });
    }

    const newStore = new Store({
      name,
      category,
      cep,
      address,
      phone,
      products
    });

    const savedStore = await newStore.save();

    res.status(201).json({
      message: "Nova loja criada",
      store: savedStore
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: "Erro ao salvar",
      error
    });
  }
});

module.exports = router;