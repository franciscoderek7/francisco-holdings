const agents =
require("./registry/agents.json");

function getAgent(name){

return agents.find(
agent=>agent.name===name
);

}

console.log(
getAgent("Jarvis")
);

module.exports={
getAgent
};

