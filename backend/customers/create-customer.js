const fs=require("fs");

function createCustomer(customer){

const file=
"backend/customers/database/customers.json";

const customers=
JSON.parse(fs.readFileSync(file));

customers.push({
...customer,
created:
new Date().toISOString()
});

fs.writeFileSync(
file,
JSON.stringify(customers,null,2)
);

console.log(
"Customer created"
);

}

createCustomer({
name:"Test Customer",
status:"pending"
});

