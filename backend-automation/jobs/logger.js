const fs=require("fs");

function log(message){

const entry={
time:new Date().toISOString(),
message
};

fs.appendFileSync(
"backend-automation/logs/system.log",
JSON.stringify(entry)+"\n"
);

}

log("Backend automation initialized");

