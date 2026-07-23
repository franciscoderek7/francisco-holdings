const fs=require("fs");

const queue=
"payments/events/payment-queue.json";

function addPaymentEvent(event){

let events=[];

if(fs.existsSync(queue)){
events=JSON.parse(
fs.readFileSync(queue)
);
}

events.push({
...event,
received:
new Date().toISOString()
});

fs.writeFileSync(
queue,
JSON.stringify(events,null,2)
);

console.log(
"Payment event queued"
);

}

addPaymentEvent({

provider:"PayPal",

status:"awaiting webhook verification"

});

