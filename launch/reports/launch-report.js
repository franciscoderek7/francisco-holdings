const fs=require("fs");

const report={
time:new Date().toISOString(),
status:"candidate",
message:"Launch verification required"
};

fs.writeFileSync(
"launch/reports/current-report.json",
JSON.stringify(report,null,2)
);

console.log(report);

