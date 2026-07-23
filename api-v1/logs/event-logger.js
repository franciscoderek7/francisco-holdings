const fs=require("fs");

function logEvent(name){

const event={
event:name,
time:new Date().toISOString()
};

fs.appendFileSync(
"api-v1/logs/events.log",
JSON.stringify(event)+"\n"
);

}

logEvent("API layer initialized");

