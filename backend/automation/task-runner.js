const workflows =
require("./workflows/workflow-registry.json");

function runEvent(event){

const match =
workflows.find(
w=>w.trigger===event
);

return match || {
status:"no_workflow_found"
};

}

console.log(
runEvent("payment.completed")
);

module.exports=runEvent;

