(function(){
  class OmniGuardModule{
    init(kernel){
      this.kernel=kernel;
      this.bus=kernel.get("events");
      this.namespace="omniaguard";
      this.bus.on("system:tick",()=>this.scan());
      console.log("[OmniGuard] ACTIVE")
    }
    scan(){
      this.bus.emit(this.bus.namespace(this.namespace,"threat"),{level:"low",timestamp:Date.now()})
    }
  }
  window.OmniGuardModule=OmniGuardModule;
})();
