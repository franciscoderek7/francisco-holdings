const fs=require("fs");

const registry =
require("./system-registry.json");

const state={

time:new Date().toISOString(),

systems:
registry.length,

active:
registry.filter(
x=>x.status==="active"
).length

};

fs.writeFileSync(
"empire-os/reports/orchestrator-report.json",
JSON.stringify(state,null,2)
);

console.log(state);

