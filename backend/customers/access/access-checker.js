const entitlements =
require("./product-entitlements.json");

function checkAccess(product){

const found =
entitlements.find(
item=>item.product===product
);

return found || null;

}

console.log(
checkAccess("PrimeDox AI")
);

module.exports=checkAccess;

