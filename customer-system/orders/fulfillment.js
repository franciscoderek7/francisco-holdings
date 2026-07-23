function startFulfillment(order){

return {
order,
status:"delivery started",
next:[
"Confirm requirements",
"Build solution",
"Test",
"Deliver"
]
};

}

console.log(
startFulfillment("NEW_ORDER")
);

