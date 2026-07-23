function calculateRevenue(payments){

return payments.reduce(
(total,payment)=>
total + Number(payment.amount || 0),
0
);

}

console.log(
"Revenue calculator ready"
);

module.exports={
calculateRevenue
};

