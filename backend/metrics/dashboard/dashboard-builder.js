const fs=require("fs");

const dashboard={

revenue:
require("../revenue/revenue-metrics.json"),

customers:
require("../customers/customer-metrics.json"),

products:
require("../products/product-metrics.json"),

generated:
new Date().toISOString()

};

fs.writeFileSync(
"backend/metrics/dashboard/dashboard.json",
JSON.stringify(dashboard,null,2)
);

console.log(
"Dashboard updated"
);

