const events=[];

function validateEvent(id){

if(events.includes(id)){
return {
valid:false,
reason:"duplicate_event"
};
}

events.push(id);

return {
valid:true,
reason:"new_event"
};

}

console.log(
validateEvent("TEST_EVENT")
);

module.exports=validateEvent;

