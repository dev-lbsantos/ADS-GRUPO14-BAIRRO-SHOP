const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const storeRoutes = require('./src/routes/storeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/stores', storeRoutes);

app.get('/', (req, res) => {
  res.json({ message: "🚀 API do BairroShop rodando com sucesso!" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});