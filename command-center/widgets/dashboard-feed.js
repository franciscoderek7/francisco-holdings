const fs=require("fs");

const dashboard={

system:
require("../data/system-status.json"),

revenue:
require("../data/revenue-status.json"),

products:
require("../data/product-status.json"),

floors:
require("../data/floor-status.json")

};

fs.writeFileSync(
"command-center/reports/dashboard-feed.json",
JSON.stringify(dashboard,null,2)
);

console.log(
"Dashboard feed generated"
);

