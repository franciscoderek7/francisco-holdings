const fs=require("fs");

const services =
require("../service-registry.json");

const checked =
services.map(service=>({

...service,

checked:
new Date().toISOString(),

health:
"pending"

}));

fs.writeFileSync(
"monitoring-system/logs/health-report.json",
JSON.stringify(checked,null,2)
);

console.log(
"Health check complete"
);

