import React, { useState } from 'react';
import { Wallet } from '@mercadopago/sdk-react';
import BrandIcon from './BrandIcon';

// Configuration and styles defined outside the component to prevent re-creation on every render
const RESTAURANTE_WHATSAPP = "5491112345678"; // Should ideally be in process.env.REACT_APP_WHATSAPP_NUMBER

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

const CheckoutForm = ({ cartItems, total, onBack, onOrderSuccess }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    calle: '',
    altura: '',
    pisoDepto: '',
    barrio: '',
    metodoPago: 'Efectivo',
    notas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!formData.telefono.trim() || formData.telefono.length < 8) {
      nuevosErrores.telefono = "Ingresa un teléfono válido";
    }
    if (!formData.calle.trim()) nuevosErrores.calle = "La calle es obligatoria";
    if (!formData.altura.trim()) nuevosErrores.altura = "Requerido";
    if (!formData.barrio) nuevosErrores.barrio = "Selecciona un barrio";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Esta función se conectará con tu backend de Node.js próximamente
  const crearPreferencia = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/create_preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, total }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.id;
      } else {
        throw new Error(data.error || 'Error desconocido al crear la preferencia');
      }
    } catch (error) {
      console.error("Error de conexión con el backend:", error);
      if (error.message.includes('Failed to fetch')) {
        alert("No se pudo conectar con el servidor. Por favor, asegúrate de que el backend esté activo.");
      } else {
        alert("Error: " + error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      // Registramos el pedido en el servidor independientemente del método de pago
      const response = await fetch(`${API_URL}/create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, cartItems, total }),
      });

      if (!response.ok) throw new Error('No se pudo registrar el pedido en el servidor');

      // Si es Mercado Pago, seguimos con la lógica de pago
      if (formData.metodoPago === 'Mercado Pago' && !preferenceId) {
        const id = await crearPreferencia();
        if (id) {
          setPreferenceId(id);
          alert("Preferencia de pago generada. Completá el pago para finalizar.");
        }
        setLoading(false);
        return;
      }

      // Si es Efectivo o Transferencia, enviamos WhatsApp directamente
      enviarWhatsApp();
    } catch (error) {
      alert("Error al procesar el pedido: " + error.message);
      setLoading(false);
    }
  };

  const enviarWhatsApp = () => {
    const detallePedido = cartItems
      .map(item => {
        const extras = item.selectedExtras?.length > 0
          ? ` (Extras: ${item.selectedExtras.map(e => e.nombre).join(', ')})`
          : '';
        return `• ${item.quantity}x ${item.nombre}${extras}`;
      })
      .join('\n');

    const direccion = `${formData.calle} ${formData.altura}${formData.pisoDepto ? ', ' + formData.pisoDepto : ''}, ${formData.barrio}`;

    const mensajeRaw = [
      `*¡Nuevo Pedido de 1012Sabores!* 🛍️`,
      `*Cliente:* ${formData.nombre}`,
      `*Teléfono:* ${formData.telefono}`,
      `*Dirección:* ${direccion}`,
      `\n*Pedido:*\n${detallePedido}`,
      `\n*Total:* $${total.toLocaleString('es-AR')}`,
      `*Método de Pago:* ${formData.metodoPago}`,
      `*Notas:* ${formData.notas || 'Ninguna'}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${RESTAURANTE_WHATSAPP}?text=${encodeURIComponent(mensajeRaw)}`;

    window.open(whatsappUrl, '_blank');
    onOrderSuccess();
  };

  return (
    <div style={{ maxWidth: '500px', width: '100%', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <button onClick={onBack} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#3498db', cursor: 'pointer' }}>← Volver al menú</button>
      
      <h2 style={{ color: '#0F2244', marginBottom: '20px', textTransform: 'uppercase', fontSize: '1.2rem' }}>Datos de Entrega</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          name="nombre" placeholder="Nombre completo" required 
          style={inputStyle} onChange={handleChange} value={formData.nombre} 
        />
        <input 
          name="telefono" placeholder="Teléfono (ej: 11 1234 5678)" required 
          style={inputStyle} onChange={handleChange} value={formData.telefono} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            name="calle" placeholder="Calle" required 
            style={{ ...inputStyle, flex: 3 }} onChange={handleChange} value={formData.calle} 
          />
          <input 
            name="altura" placeholder="Altura" required 
            style={{ ...inputStyle, flex: 1 }} onChange={handleChange} value={formData.altura} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            name="pisoDepto" placeholder="Piso / Depto (opcional)" 
            style={{ ...inputStyle, flex: 1 }} onChange={handleChange} value={formData.pisoDepto} 
          />
          <select 
            name="barrio" required style={{ ...inputStyle, flex: 1 }} 
            onChange={handleChange} value={formData.barrio}
          >
            <option value="">Seleccionar Barrio</option>
            <option value="Palermo">Palermo</option>
            <option value="Belgrano">Belgrano</option>
            <option value="Recoleta">Recoleta</option>
            <option value="Villa Crespo">Villa Crespo</option>
            <option value="Almagro">Almagro</option>
          </select>
        </div>

        <h3 style={{ fontSize: '1em', margin: '10px 0', color: '#0F2244', textTransform: 'uppercase' }}>Método de Pago</h3>
        <select name="metodoPago" style={inputStyle} onChange={handleChange} value={formData.metodoPago}>
          <option value="Efectivo">Efectivo (al repartidor)</option>
          <option value="Mercado Pago">Mercado Pago</option>
          <option value="Transferencia">Transferencia Bancaria</option>
        </select>

        <textarea 
          name="notas" placeholder="Notas adicionales (ej: no funciona el timbre)" 
          style={{ ...inputStyle, height: '80px' }} onChange={handleChange} value={formData.notas}
        />

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px' }}>
            <span>Total a pagar:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrandIcon size={22} />
              <span style={{ color: '#E62E3B' }}>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>
          
          {formData.metodoPago === 'Mercado Pago' && preferenceId ? (
            <div style={{ marginTop: '10px' }}>
              <Wallet initialization={{ preferenceId }} />
              <p style={{ fontSize: '0.8em', textAlign: 'center', color: '#666', marginTop: '10px' }}>
                Una vez realizado el pago, avisar por WhatsApp.
              </p>
            </div>
          ) : (
            <button 
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1em', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Procesando...' : (formData.metodoPago === 'Mercado Pago' ? 'Pagar con Mercado Pago' : 'Finalizar Pedido')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;