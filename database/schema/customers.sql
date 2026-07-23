CREATE TABLE customers (

id SERIAL PRIMARY KEY,

name TEXT,

email TEXT,

company TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

