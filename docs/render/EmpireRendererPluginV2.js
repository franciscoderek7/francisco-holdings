(function(){
  class RendererPlugin{
    init(kernel){
      this.kernel=kernel;
      const THREE=window.THREE;
      if(!THREE)throw new Error("THREE not loaded");
      this.scene=new THREE.Scene();
      this.camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,1000);
      this.camera.position.set(8,10,14);
      this.renderer=new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(innerWidth,innerHeight);
      document.body.appendChild(this.renderer.domElement);
      const ambient=new THREE.AmbientLight(0xffffff,0.7);
      const dir=new THREE.DirectionalLight(0xffffff,1);
      dir.position.set(10,20,10);
      this.scene.add(ambient);this.scene.add(dir);
      const cube=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xff0000}));
      cube.position.y=2;this.scene.add(cube);
      this.animate();
      window.addEventListener("resize",()=>this.resize())
    }
    animate(){requestAnimationFrame(()=>this.animate());this.renderer.render(this.scene,this.camera)}
    resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight)}
  }
  window.EmpireRendererPluginV2=RendererPlugin;
})();
