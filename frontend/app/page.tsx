"use client";

import React, { useState, useEffect } from 'react';
import { 
  Store, Package, Tag, User, Search, MapPin, Phone,
  Image as ImageIcon, ArrowLeft, ChevronRight, X, Plus, Trash2, Filter
} from 'lucide-react';

// ==========================================
// 1. TELA DE BOAS-VINDAS
// ==========================================
const WelcomeScreen = ({ setAppMode }: { setAppMode: (mode: string) => void }) => (
  <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-6 text-white w-full">
    <div className="text-center mb-12">
      <div className="bg-white p-4 rounded-3xl inline-block mb-6 shadow-xl">
        <Store className="w-16 h-16 text-blue-600" />
      </div>
      <h1 className="text-4xl font-black tracking-tighter mb-2">Bairro<span className="text-orange-400">Shop</span></h1>
      <p className="text-blue-100 text-lg max-w-xs mx-auto">Conectando você ao melhor do comércio local.</p>
    </div>

    <div className="w-full max-w-md space-y-4">
      <button onClick={() => setAppMode('consumer')} className="w-full bg-white text-blue-900 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform text-left">
        <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Sou Consumidor</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Quero encontrar lojas perto de mim</p>
        </div>
      </button>

      <button onClick={() => setAppMode('merchant')} className="w-full bg-orange-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform text-left">
        <div className="bg-orange-400 p-4 rounded-full flex-shrink-0">
          <Store className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Sou Comerciante</h2>
          <p className="text-sm text-orange-100 font-medium mt-1">Quero divulgar minha loja</p>
        </div>
      </button>
    </div>
  </div>
);

// ==========================================
// 2. FLUXO DO CONSUMIDOR (Com Filtro de Categoria)
// ==========================================
const ConsumerApp = ({ setAppMode }: { setAppMode: (mode: string) => void }) => {
  const [view, setView] = useState('home');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // NOVO: Estado para guardar a categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/api/stores')
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error("Erro ao buscar lojas:", err));
  }, []);

  // NOVO: Extrai as categorias únicas de todas as lojas que vieram do banco
  const uniqueCategories = Array.from(new Set(stores.map(store => store.category))).filter(Boolean);

  const filteredStores = stores.filter(store => {
    // 1º Filtro: Verifica a Categoria
    if (selectedCategory && store.category !== selectedCategory) {
      return false; // Se a categoria não bater, já exclui da lista
    }

    // 2º Filtro: Verifica a Busca em Texto
    if (!searchTerm) return true;
    
    const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const searchNumbersOnly = searchTerm.replace(/\D/g, '');
    const storeName = (store.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const storeCategory = (store.category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const storeCep = (store.cep || '').replace(/\D/g, '');
    
    return storeName.includes(normalizedSearch) || storeCategory.includes(normalizedSearch) || (searchNumbersOnly.length > 0 && storeCep.includes(searchNumbersOnly));
  });

  if (view === 'store') {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen w-full">
        <div className="h-48 bg-blue-600 relative w-full">
          <button onClick={() => setView('home')} className="absolute top-6 left-6 bg-white/20 backdrop-blur p-2 rounded-full text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedStore.name}</h1>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" /> 
                <span>{selectedStore.address} {selectedStore.cep ? `- CEP: ${selectedStore.cep}` : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" /> <span>{selectedStore.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-8">
          <h2 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Vitrine de Produtos ({selectedStore.products?.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedStore.products?.map((product: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-300" />}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate" title={product.name}>{product.name}</h3>
                <p className="text-blue-600 font-bold">R$ {product.price?.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50 w-full">
      <div className="bg-blue-600 px-6 pt-6 pb-8 rounded-b-[2rem] text-white shadow-md w-full">
        <div className="max-w-3xl mx-auto flex justify-between items-center mb-6">
          <button onClick={() => setAppMode('welcome')} className="text-blue-200 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-2xl font-black tracking-tighter">Bairro<span className="text-orange-400">Shop</span></h1>
          <div className="w-6" />
        </div>
        <div className="relative flex items-center max-w-3xl mx-auto">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Loja ou CEP..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white text-gray-900 pl-12 pr-12 py-4 rounded-xl shadow-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full"><X className="w-4 h-4" /></button>}
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 mt-6">
        {/* NOVO: Menu de Categorias Deslizante */}
        {uniqueCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button 
              onClick={() => setSelectedCategory('')} 
              className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-colors flex items-center gap-2 ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <Filter className="w-4 h-4" /> Todas
            </button>
            {uniqueCategories.map(cat => (
              <button 
                key={cat as string} 
                onClick={() => setSelectedCategory(cat as string)} 
                className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        )}

        <h2 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">
          {searchTerm || selectedCategory ? `Resultados: ${filteredStores.length}` : `Comércios da Região (${filteredStores.length})`}
        </h2>
        
        {filteredStores.length === 0 ? (
          <div className="text-center mt-12 bg-white p-8 rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum comércio encontrado.</p>
            {(searchTerm || selectedCategory) && (
              <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} className="mt-4 text-orange-500 font-bold hover:underline">
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map(store => (
              <button key={store._id} onClick={() => { setSelectedStore(store); setView('store'); }} className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center text-left hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400"><Store className="w-8 h-8" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-lg">{store.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{store.category}</p>
                  {store.cep && <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">CEP: {store.cep}</span>}
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. FLUXO DO COMERCIANTE 
// ==========================================
const MerchantApp = ({ setAppMode }: { setAppMode: (mode: string) => void }) => {
  const [storeData, setStoreData] = useState({ name: '', category: '', cep: '', address: '', phone: '' });
  const [products, setProducts] = useState([{ name: '', price: '', image: '' }]);
  const [status, setStatus] = useState('');

  const addProductRow = () => setProducts([...products, { name: '', price: '', image: '' }]);
  const removeProductRow = (index: number) => setProducts(products.filter((_, i) => i !== index));
  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    (newProducts[index] as any)[field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando...');
    const formattedProducts = products.map(p => ({
      name: p.name,
      price: parseFloat(p.price.replace(',', '.')),
      image: p.image,
      isPromo: false,
      stock: 1
    }));
    const newStore = { ...storeData, products: formattedProducts };

    try {
      const response = await fetch('http://localhost:5000/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      });
      if (response.ok) {
        setStatus('✅ Comércio e Vitrine cadastrados!');
        setTimeout(() => setAppMode('welcome'), 2500);
      } else setStatus('❌ Erro ao cadastrar.');
    } catch (error) {
      setStatus('❌ Erro de conexão.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full">
      <div className="bg-orange-500 px-6 pt-6 pb-8 rounded-b-[2rem] text-white shadow-md w-full">
        <div className="max-w-3xl mx-auto flex justify-between items-center mb-2">
          <button onClick={() => setAppMode('welcome')} className="text-orange-200 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-2xl font-black tracking-tighter">Área do <span className="text-orange-200">Lojista</span></h1>
          <div className="w-6" />
        </div>
        <p className="text-base text-center text-orange-100 mt-2">Configure sua loja e sua vitrine de produtos</p>
      </div>

      <div className="px-4 mt-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg border-b pb-3 flex items-center gap-2">
              <Store className="w-6 h-6 text-orange-500"/> 1. Dados do Comércio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Nome da Loja" value={storeData.name} onChange={e => setStoreData({...storeData, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" />
              <input required type="text" placeholder="Categoria (Ex: Roupas)" value={storeData.category} onChange={e => setStoreData({...storeData, category: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" />
              <input required type="text" placeholder="CEP" value={storeData.cep} onChange={e => setStoreData({...storeData, cep: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" />
              <input required type="text" placeholder="WhatsApp" value={storeData.phone} onChange={e => setStoreData({...storeData, phone: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" />
              <input required type="text" placeholder="Endereço e Nº" value={storeData.address} onChange={e => setStoreData({...storeData, address: e.target.value})} className="w-full md:col-span-2 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Package className="w-6 h-6 text-orange-500"/> 2. Vitrine de Produtos
              </h2>
              <button type="button" onClick={addProductRow} className="text-orange-600 bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-100 transition-colors border border-orange-100">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group animate-in fade-in zoom-in-95">
                  {products.length > 1 && (
                    <button type="button" onClick={() => removeProductRow(index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 p-1 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Produto #{index + 1}</p>
                  <div className="space-y-3">
                    <input required type="text" placeholder="Nome do produto" value={product.name} onChange={e => updateProduct(index, 'name', e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none bg-transparent" />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="text" placeholder="Preço (Ex: 50,00)" value={product.price} onChange={e => updateProduct(index, 'price', e.target.value)} className="border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none bg-transparent" />
                      <input type="text" placeholder="Link da Imagem" value={product.image} onChange={e => updateProduct(index, 'image', e.target.value)} className="border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none bg-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {status && <div className={`p-4 rounded-xl text-sm text-center font-bold ${status.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{status}</div>}

          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all text-lg shadow-lg shadow-orange-200 mt-8">
            Finalizar Cadastro da Loja
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// ARQUIVO PRINCIPAL
// ==========================================
export default function App() {
  const [appMode, setAppMode] = useState('welcome');
  
  return (
    <main className="w-full bg-white min-h-screen overflow-x-hidden">
      {appMode === 'welcome' && <WelcomeScreen setAppMode={setAppMode} />}
      {appMode === 'consumer' && <ConsumerApp setAppMode={setAppMode} />}
      {appMode === 'merchant' && <MerchantApp setAppMode={setAppMode} />}
    </main>
  );
}