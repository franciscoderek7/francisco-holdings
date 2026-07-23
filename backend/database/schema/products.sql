CREATE TABLE products (
id SERIAL PRIMARY KEY,
name TEXT,
category TEXT,
active BOOLEAN DEFAULT true
);
