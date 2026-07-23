const fs=require("fs");

const checks={
website:"pending",
payment:"https://paypal.me/techpetcage",
analytics:"active",
sales:"active"
};

fs.writeFileSync(
"automation/reports/health.json",
JSON.stringify(checks,null,2)
);

console.log("Health report generated");

