const permissions =
require("./permissions.json");

function checkAccess(product){

return {
product,
available:
Object.values(permissions)
.flat()
.includes(product)
};

}

console.log(
checkAccess("PrimeDox AI")
);

module.exports=checkAccess;

