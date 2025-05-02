/*  frontend/src/api/index.js  */

const BASE = process.env.REACT_APP_API_URL || '';

/**  keeps the current bearer token in memory */
let authToken = null;
export function setAuthToken(token) {
  authToken = token || null;
}

/** generic fetch wrapper – now automatically attaches Authorization if we have it */
async function request(path, opts = {}) {
  const headers = new Headers(opts.headers || {});

  // attach token automatically
  if (authToken && !headers.has('Authorization'))
    headers.set('Authorization', `Bearer ${authToken}`);

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    let err = {};
    try { err = await res.json(); } catch (_) {}
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

/* ---------- auth endpoints ---------- */
export function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export function register(username, password) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export function me() {
  return request('/api/me');                    // token auto-added
}

/* ---------- parts CRUD ---------- */
export function fetchParts()          { return request('/api/parts'); }
export function createPart(part)      {
  return request('/api/parts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(part),
  });
}
export function deletePart(id)        {
  return request(`/api/parts/${id}`, { method: 'DELETE' });
}

/* ---------- carts / orders (new) ---------- */
export function createOrGetCart()     { return request('/api/carts', { method: 'POST' }); }
export function cartItems(cid)        { return request(`/api/carts/${cid}/items`); }
export function addCartItem(cid, partId, quantity=1) {
  return request(`/api/carts/${cid}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partId, quantity }),
  });
}
export function checkout(cartId)      { return request('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cartId }),
});}
export function myOrders()            { return request('/api/orders'); }
export function orderItems(oid)       { return request(`/api/orders/${oid}/items`); }
export function adminUpdateOrder(id, status) {
  return request(`/api/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

