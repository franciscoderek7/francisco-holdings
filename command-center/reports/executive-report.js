const fs=require("fs");

const report={
generated:new Date().toISOString(),
status:"operational review required"
};

fs.writeFileSync(
"command-center/reports/latest-report.json",
JSON.stringify(report,null,2)
);

console.log(report);

