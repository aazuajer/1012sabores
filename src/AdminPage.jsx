import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  // Usar la URL de la API de producción o localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Recuperar contraseña de la sesión al cargar
  useEffect(() => {
    console.log("AdminPage: Iniciando componente...");
    const storedPass = window.sessionStorage.getItem('adminPass');
    if (storedPass) {
      setIsAuthenticated(true);
      fetchPedidos(storedPass);
      fetchComentarios(storedPass);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPedidos = async (pass) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: { 'x-admin-password': pass }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Contraseña incorrecta o sesión expirada');
        throw new Error(`Error del servidor: ${response.status}`);
      }
      const data = await response.json();
      
      // Ordenar por fecha: el más reciente primero
      const sortedData = [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setPedidos(sortedData);

      setIsAuthenticated(true);
      window.sessionStorage.setItem('adminPass', pass);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      sessionStorage.removeItem('adminPass');
    } finally {
      setLoading(false);
    }
  };

  const fetchComentarios = async (pass) => {
    try {
      const response = await fetch(`${API_URL}/comments`);
      const data = await response.json();
      setComentarios(data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    fetchPedidos(passwordInput);
    fetchComentarios(passwordInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPass');
    setIsAuthenticated(false);
    setPedidos([]);
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    const pass = window.sessionStorage.getItem('adminPass');
    try {
      const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': pass
        },
        body: JSON.stringify({ nuevoEstado })
      });

      if (response.ok) {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
      } else {
        alert("No se pudo actualizar el estado");
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  const eliminarComentario = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;
    const pass = window.sessionStorage.getItem('adminPass');
    try {
      const response = await fetch(`${API_URL}/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pass }
      });

      if (response.ok) {
        setComentarios(prev => prev.filter(c => c.id !== id));
      } else {
        alert("No se pudo eliminar el comentario");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Cálculo de estadísticas rápidas
  const totalVentas = pedidos.filter(p => p.estado !== 'cancelado').reduce((sum, p) => sum + p.total, 0);
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  if (!isAuthenticated && !loading) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '40px' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <img src="/assets/logo.png" alt="1012 Sabores" style={{ width: '120px', marginBottom: '20px' }} />
          <h2 style={{ color: '#0F2244', textTransform: 'uppercase', letterSpacing: '1px' }}>Acceso Administrativo</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Contraseña Maestra" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Entrar
            </button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
          <button onClick={() => navigate('/')} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#3498db', cursor: 'pointer' }}>← Volver al Menú</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando pedidos...</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Menú</button>
        <h2 style={{ color: '#0F2244', margin: 0, textTransform: 'uppercase' }}>Panel de Pedidos</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => {
            fetchPedidos(window.sessionStorage.getItem('adminPass'));
            fetchComentarios();
          }} style={{ padding: '8px 12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔄 Actualizar</button>
          <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Salir</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '8px', borderLeft: '5px solid #0F2244' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#0F2244', textTransform: 'uppercase', fontSize: '0.8em' }}>Total Facturado</h4>
          <p style={{ margin: 0, fontSize: '1.4em', fontWeight: 'bold' }}>${totalVentas.toLocaleString('es-AR')}</p>
        </div>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#f4fbf7', borderRadius: '8px', borderLeft: '5px solid #27ae60' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#1dd1a1' }}>Pedidos Pendientes</h4>
          <p style={{ margin: 0, fontSize: '1.4em', fontWeight: 'bold' }}>{pedidosPendientes}</p>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay pedidos registrados aún.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID Pedido</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(pedido.fecha).toLocaleString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.cliente.nombre} ({pedido.cliente.metodoPago})</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${pedido.total.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <select 
                      value={pedido.estado} 
                      onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en preparación">En Preparación</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.items.map(item => `${item.quantity}x ${item.nombre}`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gestión de Comentarios */}
      <div style={{ marginTop: '50px' }}>
        <h3 style={{ color: '#0F2244', borderBottom: '2px solid #FFD700', paddingBottom: '10px', textTransform: 'uppercase' }}>Gestión de Comentarios</h3>
        {comentarios.length === 0 ? (
          <p>No hay comentarios para moderar.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            {comentarios.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #E62E3B' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <strong style={{ color: '#0F2244' }}>{c.nombre}</strong>
                    <span style={{ color: '#FFD700' }}>{'★'.repeat(c.rating)}{'☆'.repeat(5-c.rating)}</span>
                    <small style={{ color: '#999' }}>{new Date(c.fecha).toLocaleDateString()}</small>
                  </div>
                  <p style={{ margin: '5px 0 0 0', color: '#333' }}>{c.texto}</p>
                </div>
                <button 
                  onClick={() => eliminarComentario(c.id)}
                  style={{ marginLeft: '20px', padding: '8px 12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8em' }}
                >🗑️ Borrar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;