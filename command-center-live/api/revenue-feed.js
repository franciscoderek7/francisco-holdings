const fs=require("fs");

function getRevenue(){

return JSON.parse(
fs.readFileSync(
"../data/dashboard-state.json"
)
);

}

console.log(getRevenue());

module.exports={
getRevenue
};

