function activateCustomer(payment){

return {
customerStatus:"active",
productAccess:"pending verification",
payment:payment
};

}

module.exports=activateCustomer;

