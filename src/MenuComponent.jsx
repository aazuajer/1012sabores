import React, { useState } from 'react';
import { menuItems, categorias } from './menu';
import BrandIcon from './BrandIcon';

const MenuComponent = ({ addToCart }) => {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [productoEnModal, setProductoEnModal] = useState(null);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [pulsingId, setPulsingId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Lógica de filtrado base por categoría
  const obtenerItemsBase = () => {
    if (categoriaActiva === 'Todas') return menuItems;
    if (categoriaActiva === 'Los más pedidos') return menuItems.filter(item => item.masPedido);
    return menuItems.filter(item => item.categoria === categoriaActiva);
  };

  // Filtrado final combinando categoría y búsqueda por texto
  const productosFiltrados = obtenerItemsBase().filter(item => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const triggerPulse = (id) => {
    setPulsingId(id);
    setTimeout(() => setPulsingId(null), 400); // Mismo tiempo que la animación CSS
  };

  const abrirModal = (producto) => {
    if (producto.opciones && producto.opciones.length > 0) {
      setProductoEnModal(producto);
      setExtrasSeleccionados([]);
    } else {
      addToCart(producto, []);
      triggerPulse(producto.id);
    }
  };

  const toggleExtra = (extra) => {
    setExtrasSeleccionados(prev => 
      prev.find(e => e.nombre === extra.nombre)
        ? prev.filter(e => e.nombre !== extra.nombre)
        : [...prev, extra]
    );
  };

  const confirmarAdicion = () => {
    addToCart(productoEnModal, extrasSeleccionados);
    triggerPulse(productoEnModal.id);
    setProductoEnModal(null);
  };

  const renderGridProductos = (items) => (
    <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
      {items.map(producto => (
        <div key={producto.id} className="product-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'white', position: 'relative' }}>
          <img 
            src={producto.imagen_url} 
            alt={producto.nombre} 
            style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
          />
          {/* Badges de "Nuevo" y "5 Estrellas" */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
            {producto.nuevo && (
              <span style={{ 
                backgroundColor: '#0F2244', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '0.7em', 
                fontWeight: 'bold' 
              }}>NUEVO</span>
            )}
            {producto.estrellas && producto.estrellas >= 4 && ( // Mostrar solo si tiene 4 o 5 estrellas
              <span style={{ 
                backgroundColor: '#FFD700', 
                color: '#0F2244', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '0.7em', 
                fontWeight: 'bold' 
              }}>⭐ {producto.estrellas}</span>
            )}
          </div>
          <div style={{ padding: '15px', flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{producto.nombre}</h3>
            <p style={{ fontSize: '0.9em', color: '#666', height: '40px', overflow: 'hidden' }}>{producto.descripcion}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <BrandIcon 
                size={22} 
                className={pulsingId === producto.id ? 'pulse-active' : ''} 
              />
              <p style={{ fontWeight: 'bold', fontSize: '1.4em', color: '#0F2244', margin: 0 }}>${producto.precio.toLocaleString('es-AR')}</p>
            </div>
            
            <button 
              onClick={() => abrirModal(producto)}
              disabled={!producto.disponible}
              style={{ width: '100%', padding: '12px', backgroundColor: producto.disponible ? '#E62E3B' : '#dfe6e9', color: 'white', border: 'none', borderRadius: '5px', cursor: producto.disponible ? 'pointer' : 'not-allowed', marginTop: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              {producto.disponible ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="menu-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#0F2244', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '2px' }}>Nuestros Sabores</h1>
      
      {/* Selector de Categorías */}
      <div className="categories-filter" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '20px', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#0F2244', borderRadius: '12px', marginBottom: '30px' }}>
        <button 
          onClick={() => setCategoriaActiva('Todas')}
          style={{ padding: '10px 20px', borderRadius: '20px', border: '2px solid #FFD700', backgroundColor: categoriaActiva === 'Todas' ? '#FFD700' : 'transparent', color: categoriaActiva === 'Todas' ? '#0F2244' : '#FFD700', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0 }}
        >
          Todas
        </button>
        <button 
          onClick={() => setCategoriaActiva('Los más pedidos')}
          style={{ padding: '10px 20px', borderRadius: '20px', border: '2px solid #E62E3B', backgroundColor: categoriaActiva === 'Los más pedidos' ? '#E62E3B' : 'transparent', color: categoriaActiva === 'Los más pedidos' ? 'white' : '#E62E3B', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0 }}
        >
          🔥 Los más pedidos
        </button>
        {categorias.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            style={{ padding: '10px 20px', borderRadius: '20px', border: '2px solid #FFD700', backgroundColor: categoriaActiva === cat ? '#FFD700' : 'transparent', color: categoriaActiva === cat ? '#0F2244' : '#FFD700', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0 }}
          >
            {cat}
          </button>
        ))}

        {/* Buscador y Espacio para interacción a la derecha */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '180px' }}>
          <input 
            type="text" 
            placeholder="Buscar sabor..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 15px 8px 35px', 
              borderRadius: '20px', 
              border: '1px solid #FFD700', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              color: '#FFD700',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: '12px', color: '#FFD700' }}>🔍</span>
          </div>
        </div>
      </div>

      {/* Listado de Productos agrupados o filtrados */}
      <div className="menu-sections">
        {categoriaActiva === 'Todas' && busqueda === '' ? (
          <>
            {/* Sección Destacada: Los más pedidos */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#0F2244', borderBottom: '4px solid #E62E3B', paddingBottom: '5px', marginBottom: '20px', display: 'inline-block', textTransform: 'uppercase' }}>
                🔥 Los más pedidos
              </h2>
              {renderGridProductos(menuItems.filter(item => item.masPedido))}
            </div>

            {categorias.map(cat => {
            const itemsDeCategoria = menuItems.filter(item => item.categoria === cat);
            if (itemsDeCategoria.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#0F2244', borderBottom: '4px solid #FFD700', paddingBottom: '5px', marginBottom: '20px', display: 'inline-block', textTransform: 'uppercase' }}>
                  {cat}
                </h2>
                {renderGridProductos(itemsDeCategoria)}
              </div>
            );
          })}
          </>
        ) : (
          renderGridProductos(productosFiltrados)
        )}
      </div>

      {/* Modal de Personalización */}
      {productoEnModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
            <h3>Personaliza tu {productoEnModal.nombre}</h3>
            <p>Selecciona los extras que desees:</p>
            <div style={{ margin: '15px 0' }}>
              {productoEnModal.opciones.map(opcion => (
                <div key={opcion.nombre} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <label>
                    <input 
                      type="checkbox" 
                      onChange={() => toggleExtra(opcion)}
                      checked={extrasSeleccionados.some(e => e.nombre === opcion.nombre)}
                    /> {opcion.nombre}
                  </label>
                  <span>+ ${opcion.precio}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setProductoEnModal(null)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarAdicion}
                style={{ flex: 2, padding: '10px', backgroundColor: '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <BrandIcon size={18} />
                Agregar por ${(productoEnModal.precio + extrasSeleccionados.reduce((s, e) => s + e.precio, 0)).toLocaleString('es-AR')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuComponent;