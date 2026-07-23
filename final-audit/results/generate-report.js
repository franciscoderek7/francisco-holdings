const fs=require("fs");

const report={
name:"Francisco Holdings Inc Empire V5",
auditDate:new Date().toISOString(),
decision:"Requires verification"
};

fs.writeFileSync(
"final-audit/results/final-report.json",
JSON.stringify(report,null,2)
);

console.log(report);

