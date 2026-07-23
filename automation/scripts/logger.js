const fs=require("fs");

const entry={
time:new Date().toISOString(),
event:"system_run"
};

fs.appendFileSync(
"automation/logs/system.log",
JSON.stringify(entry)+"\n"
);

console.log(entry);

