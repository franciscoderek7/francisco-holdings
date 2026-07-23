const floors =
require("../../floors/floor-registry.json");

function loadTower(){

console.log(
"Loading floors:",
floors.totalFloors
);

return floors;

}

module.exports=loadTower;

