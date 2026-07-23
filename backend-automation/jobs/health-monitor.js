const fs=require("fs");

const health={
api:"pending",
database:"pending",
payments:"pending",
timestamp:new Date().toISOString()
};

fs.writeFileSync(
"backend-automation/reports/health.json",
JSON.stringify(health,null,2)
);

console.log(health);

