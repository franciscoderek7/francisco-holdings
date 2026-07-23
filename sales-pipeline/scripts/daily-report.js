const fs=require("fs");

const metrics =
JSON.parse(
fs.readFileSync(
"../reports/metrics.json"
)
);

console.log(metrics);

