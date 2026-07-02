(function(){
  class EmpireKernel{
    constructor(){this.modules={};this.ready=false}
    register(name,module){this.modules[name]={instance:module,status:"registered"}}
    get(name){return this.modules[name]?.instance}
    init(){
      Object.keys(this.modules).forEach(name=>{
        const mod=this.modules[name].instance;
        if(mod&&typeof mod.init==="function"){mod.init(this);this.modules[name].status="initialized"}
      });
      this.ready=true;console.log("[EmpireKernel] READY")
    }
    status(){
      const report={};
      Object.keys(this.modules).forEach(name=>{report[name]=this.modules[name].status});
      return report
    }
  }
  window.EmpireKernel=new EmpireKernel();
})();
