export function createPaymentButton(){

const button =
document.createElement("a");

button.href =
"https://paypal.me/techpetcage";

button.innerText =
"Start AI Consultation - $499";

button.target="_blank";

return button;

}

