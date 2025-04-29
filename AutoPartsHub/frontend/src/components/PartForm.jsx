// frontend/src/components/PartForm.jsx
import React, { useState, useContext } from 'react';
import { createPart } from '../api/index.js';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PartForm() {
  const [form, setForm] = useState({
    name: '', make: '', model: '', year: '', price: '', partNumber: '', image: ''
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPart(form, user.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Part</h2>
      {error && <div className="error">{error}</div>}
      {Object.entries(form).map(([k, v]) => (
        <label key={k}>
          {k}
          <input name={k} value={v} onChange={onChange} />
        </label>
      ))}
      <button type="submit">Create</button>
    </form>
  );
}

