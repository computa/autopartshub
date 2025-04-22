-- 2025‑04‑21: seed carts & orders
INSERT INTO carts (user_id) VALUES (1), (2);
INSERT INTO cart_items (cart_id, part_id, quantity) VALUES (1,1,2), (2,2,1);
INSERT INTO orders (user_id, total) VALUES (1, 99.98), (2, 9.99);
INSERT INTO order_items (order_id, part_id, quantity, price_at_purchase)
  VALUES (1,1,2,49.99), (2,2,1,9.99);

