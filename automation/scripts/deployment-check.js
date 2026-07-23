const fs=require("fs");

let status={
deployment:"check required",
pwa:"check required",
threejs:"check required"
};

fs.writeFileSync(
"automation/reports/deployment.json",
JSON.stringify(status,null,2)
);

console.log(status);

