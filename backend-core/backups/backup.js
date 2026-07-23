const fs=require("fs");

const backup={
time:new Date().toISOString(),
status:"backup checkpoint created"
};

fs.writeFileSync(
"backend-core/backups/latest-backup.json",
JSON.stringify(backup,null,2)
);

console.log(backup);

