let customers=[];

function createCustomer(customer){

customers.push(customer);

return customer;

}

function listCustomers(){

return customers;

}

module.exports={
createCustomer,
listCustomers
};

