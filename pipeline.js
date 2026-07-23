const fs=require("fs");

const data=fs.readFileSync("prospects.csv","utf8")
.split("\n")
.length-2;

console.log("Prospects:",data);

