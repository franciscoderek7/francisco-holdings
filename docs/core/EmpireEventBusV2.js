(function(){
  class EventBus{
    constructor(){this.events={}}
    on(event,fn){if(!this.events[event])this.events[event]=[];this.events[event].push(fn)}
    emit(event,data){const list=this.events[event];if(!list)return;for(const fn of list){try{fn(data)}catch(e){console.error("[EventBus]",event,e)}}}
    clear(event){if(event)delete this.events[event];else this.events={}}
    namespace(ns,event){return`${ns}:${event}`}
  }
  window.EmpireEventBus=new EventBus();
})();
