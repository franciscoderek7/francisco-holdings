function verifyPayment(payment){

return {
payment,
verified:false,
status:"awaiting_provider_confirmation"
};

}

module.exports=verifyPayment;

