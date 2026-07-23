const tasks =
require("./tasks/task-queue.json");

function nextTask(){

return tasks.find(
task=>task.status==="pending"
);

}

console.log(nextTask());

module.exports={
nextTask
};

