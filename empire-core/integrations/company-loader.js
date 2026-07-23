const companies =
require("../data/company-registry.json");

function loadCompany(name){

return companies.find(
company=>company.name===name
);

}

console.log(
loadCompany("PrimeDox AI")
);

module.exports={
loadCompany
};

