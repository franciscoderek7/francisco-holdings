const fs=require("fs");

const file=
"customer-system/data/payment-ledger.json";

function recordPayment(payment){

let payments=[];

if(fs.existsSync(file)){
payments=
JSON.parse(
fs.readFileSync(file)
);
}

payments.push({
...payment,
timestamp:
new Date().toISOString()
});

fs.writeFileSync(
file,
JSON.stringify(payments,null,2)
);

console.log("Payment recorded");

}

recordPayment({
provider:"PayPal",
link:"https://paypal.me/techpetcage",
status:"awaiting verification"
});

