import React, { useState, useEffect } from 'react';

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', texto: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_URL}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error cargando comentarios:", err));
  }, []);

  const renderStars = (rating, interactive = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span 
        key={star} 
        onClick={() => interactive && setFormData({...formData, rating: star})}
        style={{ cursor: interactive ? 'pointer' : 'default', color: star <= rating ? '#FFD700' : '#ccc', fontSize: interactive ? '1.5em' : '1em' }}
      >★</span>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.texto.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/create_comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setFormData({ nombre: '', texto: '', rating: 5 });
    } catch (err) {
      console.error("Error enviando comentario:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0F2244', borderBottom: '4px solid #FFD700', paddingBottom: '10px', textTransform: 'uppercase', fontSize: '1.2rem' }}>Opiniones</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>{renderStars(formData.rating, true)}</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Tu nombre (opcional)" 
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
          />
        </div>
        <textarea 
          placeholder="Cuéntanos tu experiencia..." 
          required
          value={formData.texto}
          onChange={(e) => setFormData({...formData, texto: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '60px', marginBottom: '10px', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#E62E3B', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Enviando...' : 'Publicar Comentario'}
        </button>
      </form>

      {/* Resumen de Calificaciones */}
      {comments.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#0F2244', textTransform: 'uppercase', fontSize: '1em' }}>Calificación Promedio</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#0F2244' }}>
              {(comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)}
            </span>
            <span style={{ color: '#FFD700', fontSize: '1.5em' }}>★</span>
            <small style={{ color: '#666' }}>({comments.length} opiniones)</small>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #FFD700' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#0F2244' }}>{comment.nombre}</strong>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div>{renderStars(comment.rating)}</div>
                  <small style={{ color: '#999' }}>{new Date(comment.fecha).toLocaleDateString()}</small>
                </div>
              </div>
              <p style={{ margin: 0, color: '#333' }}>{comment.texto}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;