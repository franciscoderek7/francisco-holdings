(function(){
  class EmpireRendererPlugin{
    constructor(){this.scene=null;this.camera=null;this.renderer=null;this.floors=[]}
    init(kernel){
      this.kernel=kernel;
      if(!window.THREE){console.error("[Renderer] THREE not loaded");return}
      this.scene=new THREE.Scene();
      this.camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
      this.camera.position.set(8,10,14);
      this.renderer=new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth,window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      const a=new THREE.AmbientLight(0xffffff,0.6);
      const d=new THREE.DirectionalLight(0xffffff,1);
      d.position.set(10,20,10);
      this.scene.add(a);this.scene.add(d);
      const geo=new THREE.BoxGeometry(1,1,1);
      const mat=new THREE.MeshStandardMaterial({color:0xff3300});
      const cube=new THREE.Mesh(geo,mat);
      cube.position.y=2;
      this.scene.add(cube);
      this.animate();
      window.addEventListener("resize",()=>this.onResize())
    }
    animate(){requestAnimationFrame(()=>this.animate());this.renderer.render(this.scene,this.camera)}
    onResize(){this.camera.aspect=window.innerWidth/window.innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(window.innerWidth,window.innerHeight)}
  }
  window.EmpireRendererPlugin=EmpireRendererPlugin;
})();
