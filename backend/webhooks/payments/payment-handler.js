const fs=require("fs");

function handlePayment(event){

const record={
event:event,
received:new Date().toISOString(),
status:"received"
};

fs.appendFileSync(
"backend/webhooks/logs/payment-events.json",
JSON.stringify(record)+"\n"
);

console.log(
"Payment event received"
);

}

handlePayment({
type:"payment.completed"
});

