const agents =
require("./agent-registry.json");

function loadAgents(){

console.log(
"AI Agents:",
agents.length
);

return agents;

}

module.exports=loadAgents;

