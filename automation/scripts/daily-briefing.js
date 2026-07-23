const fs=require("fs");

const report={
date:new Date().toISOString(),
focus:[
"Generate leads",
"Follow up prospects",
"Close first $499 sale"
],
payment:
"https://paypal.me/techpetcage"
};

fs.writeFileSync(
"automation/reports/daily-briefing.json",
JSON.stringify(report,null,2)
);

console.log(report);

