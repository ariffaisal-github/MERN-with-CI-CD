import React, { useEffect, useState } from 'react';

export default function App() {
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadTexts() {
    try {
      const res = await fetch('/api/texts');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setTexts(data);
    } catch (e) {
      setError('Could not load texts');
    }
  }

  useEffect(() => {
    loadTexts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });
      if (!res.ok) throw new Error('Failed to save');
      const item = await res.json();
      setTexts((prev) => [...prev, item]);
      setNewText('');
    } catch (e) {
      setError('Could not save text');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/texts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTexts((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError('Could not delete text');
    }
  }

  return (
    <div className="container">
      <h1>Simple Text Saver</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="text">Type anything</label>
        <textarea
          id="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Type anything..."
          rows={4}
        />
        <button type="submit" disabled={isSubmitting || !newText.trim()}>
          {isSubmitting ? 'Saving...' : 'OK'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="list">
        {texts.length === 0 ? (
          <div className="empty">No texts yet. Add your first one above.</div>
        ) : (
          texts.map((item) => (
            <div className="list-item" key={item.id}>
              <div className="text">{item.text}</div>
              <button className="delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 