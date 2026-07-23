const fs=require("fs");

const report={
date:new Date().toISOString(),
tasks:[
"Review leads",
"Verify payments",
"Check deployments",
"Review revenue"
]
};

fs.writeFileSync(
"backend-automation/reports/daily.json",
JSON.stringify(report,null,2)
);

console.log(report);

