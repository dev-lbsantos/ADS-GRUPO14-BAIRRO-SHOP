"use client";

import React, { useState, useEffect } from 'react';
import { 
  Store, Package, Tag, User, Search, MapPin, Phone,
  Image as ImageIcon, ArrowLeft, ChevronRight, Navigation
} from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState('welcome');

  // ==========================================
  // TELA DE BOAS-VINDAS
  // ==========================================
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-6 text-white">
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
  // FLUXO DO CONSUMIDOR
  // ==========================================
  const ConsumerApp = () => {
    const [view, setView] = useState('home');
    const [selectedStore, setSelectedStore] = useState<any>(null);
    const [stores, setStores] = useState<any[]>([]);

    useEffect(() => {
      fetch('http://localhost:5000/api/stores')
        .then(res => res.json())
        .then(data => setStores(data))
        .catch(err => console.error("Erro ao buscar lojas:", err));
    }, []);

    const HomeView = () => (
      <div className="pb-20 min-h-screen bg-gray-50">
        <div className="bg-blue-600 p-6 rounded-b-[2rem] text-white shadow-md">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setAppMode('welcome')} className="text-blue-200 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black tracking-tighter">Bairro<span className="text-orange-400">Shop</span></h1>
            <div className="w-6" />
          </div>
          <div className="relative">
            <input type="text" placeholder="Buscar lojas..." className="w-full bg-white text-gray-900 pl-12 pr-4 py-3 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="px-4 mt-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-lg">Comércios da Região ({stores.length})</h2>
          {stores.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Nenhuma loja cadastrada ainda.</p>
          ) : (
            stores.map(store => (
              <button key={store._id} onClick={() => { setSelectedStore(store); setView('store'); }} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center text-left">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Store className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{store.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{store.category}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            ))
          )}
        </div>
      </div>
    );

    const StoreView = () => (
      <div className="pb-20 bg-gray-50 min-h-screen">
        <div className="h-48 bg-blue-600 relative">
          <button onClick={() => setView('home')} className="absolute top-6 left-4 bg-white/20 backdrop-blur p-2 rounded-full text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="px-4 -mt-12 relative z-10">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
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

        <div className="px-4 mt-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Vitrine de Produtos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {selectedStore.products?.map((product: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  {/* Se tiver imagem mostra ela, senão mostra o ícone padrão */}
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                  {product.isPromo && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Tag className="w-3 h-3" /> PROMO
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
                <p className="text-blue-600 font-bold">R$ {product.price?.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return view === 'home' ? <HomeView /> : <StoreView />;
  };

  // ==========================================
  // FLUXO DO COMERCIANTE (Atualizado)
  // ==========================================
  const MerchantApp = () => {
    // Estado para a Loja (Agora com CEP)
    const [storeData, setStoreData] = useState({ name: '', category: '', cep: '', address: '', phone: '' });
    
    // Estado para o 1º Produto da loja
    const [productData, setProductData] = useState({ name: '', price: '', image: '' });
    
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('Enviando...');

      // Estrutura o dado juntando a loja e o produto digitado
      const newStore = {
        ...storeData,
        products: [
          { 
            name: productData.name, 
            price: parseFloat(productData.price.replace(',', '.')), // Converte "99,90" para 99.90 (número)
            image: productData.image, 
            isPromo: false, 
            stock: 1 
          }
        ]
      };

      try {
        const response = await fetch('http://localhost:5000/api/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStore),
        });

        if (response.ok) {
          setStatus('✅ Loja e Produto cadastrados!');
          setStoreData({ name: '', category: '', cep: '', address: '', phone: '' });
          setProductData({ name: '', price: '', image: '' });
          setTimeout(() => setAppMode('welcome'), 2500);
        } else {
          setStatus('❌ Erro ao cadastrar a loja.');
        }
      } catch (error) {
        setStatus('❌ Erro de conexão com o servidor.');
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-orange-500 p-6 rounded-b-[2rem] text-white shadow-md">
          <div className="flex justify-between items-center mb-2">
            <button onClick={() => setAppMode('welcome')} className="text-orange-200 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black tracking-tighter">Área do <span className="text-orange-200">Lojista</span></h1>
            <div className="w-6" />
          </div>
          <p className="text-sm text-center text-orange-100 mt-2">Cadastre sua loja e seu primeiro produto</p>
        </div>

        <div className="px-4 mt-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            
            {/* SEÇÃO 1: DADOS DA LOJA */}
            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Store className="w-5 h-5 text-orange-500"/> 1. Dados do Comércio
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja *</label>
                <input required type="text" value={storeData.name} onChange={e => setStoreData({...storeData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="Ex: Padaria do João" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <input required type="text" value={storeData.category} onChange={e => setStoreData({...storeData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="Ex: Alimentação" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input required type="text" value={storeData.cep} onChange={e => setStoreData({...storeData, cep: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="00000-000" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Rua, Nº) *</label>
                  <input required type="text" value={storeData.address} onChange={e => setStoreData({...storeData, address: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="Rua Nova, 123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone *</label>
                <input required type="text" value={storeData.phone} onChange={e => setStoreData({...storeData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="(11) 99999-9999" />
              </div>
            </div>

            {/* SEÇÃO 2: PRIMEIRO PRODUTO */}
            <div className="space-y-4 pt-2">
              <h2 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500"/> 2. Seu Principal Produto
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                <input required type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="Ex: Tênis Esportivo" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                <input required type="text" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="Ex: 149,90" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link da Imagem (Opcional)</label>
                <input type="text" value={productData.image} onChange={e => setProductData({...productData, image: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none text-xs" placeholder="Cole a URL de uma imagem da internet" />
              </div>
            </div>

            {status && (
              <div className={`p-3 rounded-lg text-sm text-center font-bold ${status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status}
              </div>
            )}

            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors mt-4 text-lg">
              Concluir Cadastro
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Renderização principal do App
  if (appMode === 'welcome') return <WelcomeScreen />;
  if (appMode === 'consumer') return <ConsumerApp />;
  if (appMode === 'merchant') return <MerchantApp />;
}