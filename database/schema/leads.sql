CREATE TABLE leads (

id SERIAL PRIMARY KEY,

name TEXT,

email TEXT,

source TEXT,

status TEXT DEFAULT 'new',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

