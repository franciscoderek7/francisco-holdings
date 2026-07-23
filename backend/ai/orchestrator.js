const agents =
require("./config/agent-registry.json");

function assignTask(task){

return {
task,
assignedTo:"jarvis",
status:"queued",
agents:agents.length
};

}

console.log(
assignTask("system-check")
);

module.exports=assignTask;

