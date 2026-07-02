(function(){
  function injectBeacon(){
    const wait=setInterval(()=>{
      if(window.scene&&window.THREE){
        clearInterval(wait);
        const cube=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0xff0000}));
        cube.position.set(0,3,0);
        window.scene.add(cube);
        console.log("[BEACON] RED CUBE INJECTED");
      }
    },200);
  }
  window.addEventListener("load",injectBeacon);
})();
