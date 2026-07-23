const events=[];

function trackRevenueEvent(company,event){

events.push({
company,
event,
time:new Date().toISOString()
});

console.log(
events[events.length-1]
);

}

module.exports={
trackRevenueEvent
};

