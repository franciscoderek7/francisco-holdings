const fs=require("fs");

const file="analytics-v2/data/events.json";

function track(event,data={}){

let events=[];

if(fs.existsSync(file)){
events=JSON.parse(fs.readFileSync(file));
}

events.push({
event,
data,
time:new Date().toISOString()
});

fs.writeFileSync(
file,
JSON.stringify(events,null,2)
);

}

track("system_started");

console.log("Event saved");

