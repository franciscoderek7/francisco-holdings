CREATE TABLE payments (

id SERIAL PRIMARY KEY,

customer_id INTEGER,

provider TEXT DEFAULT 'PayPal',

amount NUMERIC,

status TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

