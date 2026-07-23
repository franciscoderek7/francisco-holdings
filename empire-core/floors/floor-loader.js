const registry =
require("./floor-registry.json");

function loadFloors(){

console.log(
"Total Floors:",
registry.totalFloors
);

return registry.floors;

}

module.exports=loadFloors;

