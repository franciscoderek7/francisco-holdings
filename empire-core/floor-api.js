const floors=require("./data/floors.json");

function getFloor(number){
return floors.find(
f=>f.floor===number
);
}

console.log(getFloor(3));

