import React, { useState, useEffect } from 'react';
import MenuComponent from './MenuComponent';
import CartComponent from './CartComponent';
import CheckoutForm from './CheckoutForm';
import CommentsSection from './CommentsSection';
import AdminPage from './AdminPage'; // Importar el nuevo componente AdminPage
import { initMercadoPago } from '@mercadopago/sdk-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Inicializamos Mercado Pago con tu Public Key
if (process.env.REACT_APP_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);
} else {
  console.error("Error: REACT_APP_MP_PUBLIC_KEY no encontrada en el archivo .env");
}

const AppContent = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // Para controlar la visibilidad del carrito
  const navigate = useNavigate(); // Hook para la navegación programática

  // Función para navegar al checkout
  const goToCheckout = () => {
    navigate('/checkout');
  };

  const addToCart = (product, selectedExtras = []) => {
    // Creamos un ID único basado en el producto y sus extras
    const extrasId = selectedExtras.map(e => e.nombre).sort().join('-');
    const cartItemId = extrasId ? `${product.id}-${extrasId}` : product.id;
    
    const extraPrice = selectedExtras.reduce((sum, extra) => sum + extra.precio, 0);
    const finalPrice = product.precio + extraPrice;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prevCart, { 
        ...product, 
        cartItemId, 
        selectedExtras, 
        precioUnitarioTotal: finalPrice, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, amount) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.precioUnitarioTotal * item.quantity), 0);

  // Componentes de Feedback
  const SuccessPage = () => {
    // Limpiamos el carrito automáticamente al llegar a la página de éxito
    useEffect(() => {
      clearCart();
    }, []);

    return (
      <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '500px', margin: 'auto' }}>
        <img src="/assets/logo.png" alt="1012 Sabores" style={{ width: '150px', marginBottom: '20px' }} />
        <h2 style={{ color: '#1dd1a1' }}>¡Pago Recibido! 🎉</h2>
        <p>Gracias por tu compra en 1012Sabores.</p>
        <p>Tu pedido está siendo procesado. Si no enviaste el mensaje de WhatsApp anteriormente, por favor contáctanos.</p>
        <button 
          onClick={() => {
            navigate('/'); // Vuelve al inicio usando el router de forma suave
          }}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#C0392B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Volver al Inicio
        </button>
      </div>
    );
  };

  const FailurePage = () => (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '500px', margin: 'auto' }}>
      <h2 style={{ color: '#ff6b6b' }}>Hubo un problema con el pago ❌</h2>
      <p>No pudimos procesar tu pago de Mercado Pago. Por favor, intenta nuevamente o elige otro método de pago.</p>
      <button 
        onClick={() => navigate('/checkout')}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0F2244', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Reintentar Checkout
      </button>
    </div>
  );

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#0F2244', padding: '15px 20px', borderBottom: '4px solid #FFD700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/assets/logo.png" alt="1012 Sabores" style={{ height: '60px', width: 'auto', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />
          <h1 style={{ color: '#FFD700', margin: 0, fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '1.5rem' }}>1012Sabores</h1>
        </div>
        <button 
          onClick={() => setShowCart(!showCart)} 
          style={{ padding: '10px 15px', backgroundColor: '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🛒 Carrito ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
        {/* Enlace temporal para el panel de administración */}
        <button 
          onClick={() => navigate('/admin')}
          style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#636e72', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Admin
        </button>
      </header>

      <main style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <Routes>
          <Route path="/" element={
            <>
              <div style={{ flex: 3, minWidth: '300px' }}>
                <MenuComponent addToCart={addToCart} />
              </div>
              <div style={{ flex: 1, minWidth: '280px', maxWidth: '350px', position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
                <CommentsSection />
              </div>
              {showCart && (
                <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
                  <CartComponent 
                    cartItems={cart} 
                    total={total}
                    onUpdateQuantity={updateQuantity} 
                    onRemove={removeFromCart} 
                    onClear={clearCart}
                    onCheckout={goToCheckout}
                  />
                </div>
              )}
            </>
          } />
          <Route path="/checkout" element={
            <CheckoutForm 
              cartItems={cart} 
              total={total} 
              onBack={() => navigate('/')}
              onOrderSuccess={() => { clearCart(); navigate('/success'); }}
            />
          } />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/pending" element={<SuccessPage />} /> {/* Mercado Pago a veces redirige a /pending */}
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;