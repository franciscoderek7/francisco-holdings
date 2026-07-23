const fs=require("fs");

const dashboard =
{
generated:
new Date().toISOString(),

revenue:
require("../data/dashboard-state.json"),

leads:
require("../data/lead-metrics.json"),

agents:
require("../data/agent-status.json")

};

fs.writeFileSync(
"command-center-report.json",
JSON.stringify(dashboard,null,2)
);

console.log(
"Dashboard report created"
);

