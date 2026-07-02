(function(){
  class ModuleRegistry{
    constructor(){this.modules=new Map()}
    register(name,module,deps=[]){this.modules.set(name,{instance:module,deps,status:"registered",ready:false})}
    get(name){return this.modules.get(name)?.instance}
    initAll(kernel){
      const resolved=new Set();
      const canInit=(name)=>{const mod=this.modules.get(name);return mod.deps.every(d=>resolved.has(d))};
      let progress=true;
      while(progress){
        progress=false;
        for(let[name,mod]of this.modules.entries()){
          if(!mod.ready&&canInit(name)){
            try{if(mod.instance?.init){mod.instance.init(kernel)}mod.ready=true;mod.status="ready";resolved.add(name);progress=true;console.log("[ModuleRegistry] INIT:",name)}catch(e){mod.status="failed";console.error("[ModuleRegistry] FAIL:",name,e)}
          }
        }
      }
      console.log("[ModuleRegistry] BOOT COMPLETE")
    }
    status(){const out={};for(let[k,v]of this.modules.entries()){out[k]=v.status}return out}
  }
  window.EmpireModuleRegistry=ModuleRegistry;
})();
