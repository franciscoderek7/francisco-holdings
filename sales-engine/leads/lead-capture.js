const fs=require("fs");

const file=
"sales-engine/leads/leads.json";

function addLead(lead){

let leads=[];

if(fs.existsSync(file)){
leads=JSON.parse(
fs.readFileSync(file)
);
}

leads.push({
...lead,
created:
new Date().toISOString()
});

fs.writeFileSync(
file,
JSON.stringify(leads,null,2)
);

console.log("Lead added");

}

addLead({
source:"website",
status:"new"
});

