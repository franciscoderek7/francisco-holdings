const fs=require("fs");

const report={
generated:
new Date().toISOString(),

goal:
100000,

status:
"tracking"

};

fs.writeFileSync(
"sales-engine/reports/sales-summary.json",
JSON.stringify(report,null,2)
);

console.log(report);

