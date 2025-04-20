-- backend/db/seeds/20250420_seed_parts.sql

INSERT INTO parts (name, make, model, year, price, part_number, image)
VALUES
  ('Brake Pad Set', 'Toyota', 'Corolla', 2019, 49.99, 'BP-TOY-COR-2019', '/images/brake-pad.jpg'),
  ('Oil Filter',     'Honda',  'Civic',   2020,  9.99, 'OF-HON-CIV-2020', '/images/oil-filter.jpg');

