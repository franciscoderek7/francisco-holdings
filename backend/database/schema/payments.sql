CREATE TABLE payments (
id SERIAL PRIMARY KEY,
customer_id INTEGER,
provider TEXT,
transaction_id TEXT,
amount DECIMAL,
status TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
