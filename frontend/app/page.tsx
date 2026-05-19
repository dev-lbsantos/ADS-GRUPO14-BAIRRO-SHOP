"use client";

import React, { useState, useEffect } from 'react';
import { 
  Store, Package, Tag, User, Search, MapPin, Phone,
  Image as ImageIcon, ArrowLeft, ChevronRight, X, Plus, Trash2, Filter, Mail, Lock, LogOut, Edit
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
        <div className="bg-blue-100 p-4 rounded-full flex-shrink-0"><User className="w-8 h-8 text-blue-600" /></div>
        <div>
          <h2 className="text-xl font-bold">Sou Consumidor</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Quero encontrar lojas perto de mim</p>
        </div>
      </button>

      <button onClick={() => setAppMode('merchant')} className="w-full bg-orange-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform text-left">
        <div className="bg-orange-400 p-4 rounded-full flex-shrink-0"><Store className="w-8 h-8 text-white" /></div>
        <div>
          <h2 className="text-xl font-bold">Sou Comerciante</h2>
          <p className="text-sm text-orange-100 font-medium mt-1">Quero divulgar minha loja</p>
        </div>
      </button>
    </div>
  </div>
);

// ==========================================
// 2. FLUXO DO CONSUMIDOR 
// ==========================================
const ConsumerApp = ({ setAppMode }: { setAppMode: (mode: string) => void }) => {
  const [view, setView] = useState('home');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/api/stores')
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error("Erro ao buscar lojas:", err));
  }, []);

  const uniqueCategories = Array.from(new Set(stores.map(store => store.category))).filter(Boolean);

  const filteredStores = stores.filter(store => {
    if (selectedCategory && store.category !== selectedCategory) return false;
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
          <button onClick={() => setView('home')} className="absolute top-6 left-6 bg-white/20 backdrop-blur p-2 rounded-full text-white"><ArrowLeft className="w-6 h-6" /></button>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedStore.name}</h1>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" /> <span>{selectedStore.address} {selectedStore.cep ? `- CEP: ${selectedStore.cep}` : ''}</span></div>
              <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-green-500 flex-shrink-0" /> <span>{selectedStore.phone}</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-8">
          <h2 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2"><Package className="w-6 h-6 text-blue-600" /> Vitrine de Produtos ({selectedStore.products?.length})</h2>
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
        {uniqueCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button onClick={() => setSelectedCategory('')} className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-colors flex items-center gap-2 ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}><Filter className="w-4 h-4" /> Todas</button>
            {uniqueCategories.map(cat => (
              <button key={cat as string} onClick={() => setSelectedCategory(cat as string)} className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{cat as string}</button>
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
// 3. FLUXO DO COMERCIANTE (Dashboard Privado)
// ==========================================
const MerchantApp = ({ setAppMode }: { setAppMode: (mode: string) => void }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  // ESTADOS DO FORMULÁRIO E DASHBOARD
  const [storeData, setStoreData] = useState({ name: '', category: '', cep: '', address: '', phone: '' });
  const [products, setProducts] = useState([{ name: '', price: '', image: '' }]);
  const [dashboardStatus, setDashboardStatus] = useState('');
  const [myStores, setMyStores] = useState<any[]>([]);
  
  // NOVO: Controle de Edição
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    if (token && merchantId) {
      setIsLoggedIn(true);
      fetchMyStores(merchantId);
    }
  }, [isLoggedIn]);

  const fetchMyStores = (merchantId: string) => {
    fetch(`http://localhost:5000/api/stores?merchantId=${merchantId}`)
      .then(res => res.json())
      .then(data => setMyStores(data))
      .catch(err => console.error("Erro ao buscar lojas do lojista:", err));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('Conectando...');
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (authMode === 'login') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('merchantId', data.merchantId);
          setIsLoggedIn(true);
          setAuthStatus('');
        } else {
          setAuthStatus('✅ Cadastro realizado com sucesso! Faça seu login.');
          setAuthMode('login');
          setPassword('');
        }
      } else {
        setAuthStatus(`❌ ${data.message}`);
      }
    } catch (error) {
      setAuthStatus('❌ Erro de conexão com o servidor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchantId');
    setIsLoggedIn(false);
  };

  const addProductRow = () => setProducts([...products, { name: '', price: '', image: '' }]);
  const removeProductRow = (index: number) => setProducts(products.filter((_, i) => i !== index));
  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    (newProducts[index] as any)[field] = value;
    setProducts(newProducts);
  };

  const resetForm = () => {
    setStoreData({ name: '', category: '', cep: '', address: '', phone: '' });
    setProducts([{ name: '', price: '', image: '' }]);
    setEditingStoreId(null);
  };

  // NOVO: Função para preencher o formulário para edição
  const handleEditClick = (store: any) => {
    setStoreData({
      name: store.name,
      category: store.category,
      cep: store.cep,
      address: store.address,
      phone: store.phone
    });
    
    // Converte o preço numérico de volta para string com vírgula para o input
    const formattedProducts = store.products.map((p: any) => ({
      name: p.name,
      price: p.price.toFixed(2).replace('.', ','),
      image: p.image || ''
    }));
    
    setProducts(formattedProducts.length > 0 ? formattedProducts : [{ name: '', price: '', image: '' }]);
    setEditingStoreId(store._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a tela para cima para ver o formulário
  };

  // NOVO: Função para excluir uma loja
  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta loja e todos os seus produtos?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/stores/${storeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMyStores(localStorage.getItem('merchantId')!);
        if (editingStoreId === storeId) resetForm();
      } else {
        alert("Erro ao excluir loja.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ATUALIZADO: Função salva nova loja OU atualiza loja existente
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardStatus('Salvando...');
    
    const merchantId = localStorage.getItem('merchantId');

    const formattedProducts = products.map(p => ({
      name: p.name,
      price: parseFloat(p.price.replace(',', '.')),
      image: p.image,
      isPromo: false,
      stock: 1
    }));
    
    const newStore = { ...storeData, products: formattedProducts, merchantId };

    try {
      // Se tiver um ID sendo editado, manda PUT pra URL com ID. Senão, manda POST.
      const url = editingStoreId 
        ? `http://localhost:5000/api/stores/${editingStoreId}` 
        : 'http://localhost:5000/api/stores';
      const method = editingStoreId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        setDashboardStatus(editingStoreId ? '✅ Loja atualizada com sucesso!' : '✅ Loja cadastrada com sucesso!');
        resetForm();
        fetchMyStores(merchantId!);
        setTimeout(() => setDashboardStatus(''), 3000);
      } else setDashboardStatus('❌ Erro ao salvar.');
    } catch (error) {
      setDashboardStatus('❌ Erro de conexão.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 w-full relative">
        <button onClick={() => setAppMode('welcome')} className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Voltar</button>
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-orange-100 p-3 rounded-full inline-block mb-4"><Store className="w-8 h-8 text-orange-500" /></div>
            <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Acesso do Lojista' : 'Criar Conta'}</h2>
            <p className="text-sm text-gray-500 mt-1">{authMode === 'login' ? 'Gerencie seus produtos e lojas.' : 'Comece a vender na sua região.'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input required type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input required type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
            </div>
            {authStatus && <div className={`text-sm text-center font-semibold p-2 rounded ${authStatus.includes('✅') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{authStatus}</div>}
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
              {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {authMode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthStatus(''); }} className="text-orange-500 font-bold ml-1 hover:underline">
              {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full">
      <div className="bg-orange-500 px-6 pt-6 pb-8 rounded-b-[2rem] text-white shadow-md w-full">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-2">
          <button onClick={() => setAppMode('welcome')} className="text-orange-200 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-2xl font-black tracking-tighter">Meu <span className="text-orange-200">Painel</span></h1>
          <button onClick={handleLogout} className="text-orange-200 hover:text-white flex items-center gap-1 text-sm font-bold bg-orange-600/50 px-3 py-1.5 rounded-lg"><LogOut className="w-4 h-4" /> Sair</button>
        </div>
      </div>

      <div className="px-4 mt-8 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div className="lg:col-span-3">
          <form onSubmit={handleSaveStore} className="space-y-6">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border ${editingStoreId ? 'border-blue-400 ring-4 ring-blue-50' : 'border-gray-100'} space-y-4 transition-all`}>
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Store className={`w-6 h-6 ${editingStoreId ? 'text-blue-500' : 'text-orange-500'}`}/> 
                  {editingStoreId ? 'Editando Loja' : 'Nova Loja'}
                </h2>
                {editingStoreId && (
                  <button type="button" onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">Cancelar</button>
                )}
              </div>
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
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Package className={`w-6 h-6 ${editingStoreId ? 'text-blue-500' : 'text-orange-500'}`}/> Vitrine</h2>
                <button type="button" onClick={addProductRow} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${editingStoreId ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}><Plus className="w-4 h-4" /> Adicionar Produto</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group">
                    {products.length > 1 && (
                      <button type="button" onClick={() => removeProductRow(index)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 p-1 bg-gray-50 rounded-lg hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
                    )}
                    <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Produto #{index + 1}</p>
                    <div className="space-y-3">
                      <input required type="text" placeholder="Nome do produto" value={product.name} onChange={e => updateProduct(index, 'name', e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="text" placeholder="Preço" value={product.price} onChange={e => updateProduct(index, 'price', e.target.value)} className="border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none" />
                        <input type="text" placeholder="Link da Imagem" value={product.image} onChange={e => updateProduct(index, 'image', e.target.value)} className="border-b border-gray-200 p-2 text-sm focus:border-orange-400 outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {dashboardStatus && <div className={`p-4 rounded-xl text-sm text-center font-bold ${dashboardStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{dashboardStatus}</div>}

            <button type="submit" className={`w-full text-white font-bold py-4 rounded-2xl transition-all text-lg shadow-lg ${editingStoreId ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}>
              {editingStoreId ? 'Atualizar Loja e Produtos' : 'Salvar Nova Loja e Produtos'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-800 text-lg border-b pb-2 flex items-center gap-2 px-2"><Edit className="w-5 h-5 text-gray-600"/> Minhas Lojas</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {myStores.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Você ainda não possui lojas cadastradas na sua conta.</p>
            ) : (
              myStores.map((store) => (
                <div key={store._id} className={`bg-white p-4 rounded-xl shadow-sm border ${editingStoreId === store._id ? 'border-l-4 border-l-blue-500 border-t-blue-100 border-r-blue-100 border-b-blue-100 bg-blue-50/30' : 'border-gray-100 border-l-4 border-l-orange-500'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{store.name}</h3>
                      <p className="text-xs text-gray-500">{store.products?.length || 0} produtos cadastrados</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditClick(store)} className={`p-1.5 rounded-lg transition-colors ${editingStoreId === store._id ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500'}`} title="Editar"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteStore(store._id)} className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Apagar"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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