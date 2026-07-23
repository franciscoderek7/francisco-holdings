export function mountTower(container){

if(!container){

console.error(
"Tower container missing"
);

return false;

}

container.dataset.tower="active";

console.log(
"Empire Tower mounted"
);

return true;

}

