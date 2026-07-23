const fs=require("fs");

const revenue =
JSON.parse(
fs.readFileSync(
"metrics/revenue.json"
)
);

console.log(
"Revenue Goal:",
revenue.monthlyGoal
);

console.log(
"Current Revenue:",
revenue.currentRevenue
);

