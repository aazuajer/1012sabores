import React from 'react';

const CartComponent = ({ cartItems, total, onUpdateQuantity, onRemove, onClear, onCheckout }) => {

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3>Tu carrito está vacío</h3>
        <p>¡Agregá unas arepas o tequeños para empezar!</p>
      </div>
    );
  }

  return (
    <div className="cart-container" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '4px solid #FFD700', paddingBottom: '10px', color: '#0F2244', textTransform: 'uppercase' }}>Tu Carrito</h2>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0' }}>{item.nombre}</h4>
              {item.selectedExtras && item.selectedExtras.length > 0 && (
                <div style={{ fontSize: '0.8em', color: '#888' }}>
                  {item.selectedExtras.map(extra => (
                    <span key={extra.nombre}>+ {extra.nombre} </span>
                  ))}
                </div>
              )}
              <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                ${item.precioUnitarioTotal.toLocaleString('es-AR')} c/u
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
              >-</button>
              
              <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              
              <button 
                onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}
              >+</button>
              
              <button 
                onClick={() => onRemove(item.cartItemId)}
                style={{ marginLeft: '10px', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
            
            <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
              ${(item.precioUnitarioTotal * item.quantity).toLocaleString('es-AR')}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '2px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span style={{ color: '#E62E3B' }}>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          style={{ width: '100%', padding: '15px', backgroundColor: '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
          onClick={onCheckout}
        >
          Confirmar Pedido
        </button>
        <button 
          onClick={onClear}
          style={{ background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer', fontSize: '0.9em' }}
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};

export default CartComponent;