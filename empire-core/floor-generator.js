const fs=require("fs");

const floors =
JSON.parse(
fs.readFileSync(
"data/floors.json"
)
);

console.log(
"Active Floors:",
floors.length
);

for(const floor of floors){
console.log(
floor.floor,
floor.name,
floor.cta
);
}

