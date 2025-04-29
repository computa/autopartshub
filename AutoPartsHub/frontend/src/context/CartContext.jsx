// frontend/src/context/CartContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      // if part already in cart, bump qty
      return state.some(i => i.part_id === action.item.part_id)
        ? state.map(i =>
            i.part_id === action.item.part_id
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          )
        : [...state, action.item];

    case 'remove':
      return state.filter(i => i.part_id !== action.partId);

    case 'clear':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const addItem = item => dispatch({ type: 'add', item });
  const removeItem = partId => dispatch({ type: 'remove', partId });
  const clearCart = () => dispatch({ type: 'clear' });

  /** derived totals */
  const totalQty = items.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = items.reduce((t, i) => t + i.quantity * Number(i.price), 0);

  const value = { items, addItem, removeItem, clearCart, totalQty, totalPrice };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

