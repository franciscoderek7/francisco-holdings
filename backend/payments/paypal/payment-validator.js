const fs=require("fs");

function validatePayment(transaction){

const record={
id:transaction.id,
amount:transaction.amount,
status:"pending_verification",
time:new Date().toISOString()
};

let file=
"backend/payments/paypal/transactions/transactions.json";

let data=
JSON.parse(fs.readFileSync(file));

data.push(record);

fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);

console.log(
"Payment queued for verification"
);

}

validatePayment({
id:"TEST_TRANSACTION",
amount:499
});

