const fs=require("fs");

const file="prospects.csv";

if(!fs.existsSync(file)){
 console.log("No prospect file");
 process.exit();
}

const data=fs.readFileSync(file,"utf8");

console.log(data);

