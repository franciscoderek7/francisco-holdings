const events={};

function emit(name,data){
console.log(
"EVENT:",
name,
data
);
}

module.exports={
emit
};

