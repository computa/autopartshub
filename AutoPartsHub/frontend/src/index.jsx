import { CartProvider } from './context/CartContext';

// …
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>          {/* <- NEW */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

