export function generateFloors(){

const floors=[];

for(let i=1;i<=392;i++){

floors.push({
floor:i,
name:`Empire Floor ${i}`
});

}

return floors;

}

