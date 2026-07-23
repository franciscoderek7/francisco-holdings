const jobs =
require("../jobs/job-registry.json");

function getJobs(){

return {
time:new Date().toISOString(),
jobs
};

}

console.log(getJobs());

module.exports=getJobs;

