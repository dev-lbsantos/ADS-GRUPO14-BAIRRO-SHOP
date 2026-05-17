const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // <-- Novo campo para a imagem (URL)
  isPromo: { type: Boolean, default: false },
  stock: { type: Number, default: 0 }
});

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  cep: { type: String, required: true }, // <-- Novo campo para o CEP
  address: { type: String, required: true },
  phone: { type: String, required: true },
  products: [ProductSchema]
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);