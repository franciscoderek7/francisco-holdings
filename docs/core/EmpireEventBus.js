(function(){
  class EventBus{
    constructor(){this.events={}}
    on(event,fn){if(!this.events[event])this.events[event]=[];this.events[event].push(fn)}
    emit(event,data){if(!this.events[event])return;this.events[event].forEach(fn=>{try{fn(data)}catch(e){console.error("[EventBus Error]",event,e)}})}
    clear(event){if(event)delete this.events[event];else this.events={}}
  }
  window.EmpireEventBus=new EventBus();
})();
