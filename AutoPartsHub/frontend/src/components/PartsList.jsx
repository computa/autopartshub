// frontend/src/components/PartsList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { fetchParts, deletePart } from '../api/index.js';
import { AuthContext } from '../context/AuthContext';

export default function PartsList() {
  const [parts, setParts] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchParts(user?.token).then(setParts).catch(e => setError(e.message));
  }, [user]);

  const onDelete = async id => {
    try {
      await deletePart(id, user.token);
      setParts(parts.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;
  return (
    <ul>
      {parts.map(p => (
        <li key={p.id}>
          {p.name} ({p.partNumber})
          {user?.isAdmin && (
            <button onClick={() => onDelete(p.id)}>Delete</button>
          )}
        </li>
      ))}
    </ul>
  );
}

