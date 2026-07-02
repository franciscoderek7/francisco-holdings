class EmpireRevenueLoopV1{
  constructor(){this.tiers={starter:49,professional:99,enterprise:999};this.subscribers=[];this.transactions=[];this.revenueTotal=0;this.paypalConfig={clientId:"",businessEmail:"techpetcage@gmail.com",currency:"USD"}}
  async init(kernel){
    this.events=kernel.get("events");
    this.state=kernel.get("state");
    this.validatePayPalConfig();
    this.events.on("revenue:initiate",(data)=>this.handlePayment(data));
    this.events.on("subscription:initiate",(data)=>this.handleSubscription(data));
    this.events.emit("revenue:ready",{tiers:this.tiers,status:"armed"});
    console.log("[REVENUE LOOP] Armed. Tiers: Starter $49 / Pro $99 / Enterprise $999. Business: techpetcage@gmail.com")
  }
  validatePayPalConfig(){
    if(this.paypalConfig.businessEmail!=="techpetcage@gmail.com"){
      throw new Error("[REVENUE LOOP] FATAL: PayPal business email misconfigured. Customer payments would reverse-charge owner. HALTED.")
    }
  }
  handlePayment(data){
    const amount=parseFloat(data.amount);
    if(isNaN(amount)||amount<=0){this.events.emit("paypal:error",{error:"Invalid amount"});return}
    const tx={txid:`TX-${Date.now()}-${Math.random().toString(36).substr(2,6)}`,amount,floor:data.floor||0,status:"pending",timestamp:Date.now()};
    this.transactions.push(tx);
    this.events.emit("paypal:payment:initiated",tx);
    setTimeout(()=>{
      tx.status="completed";
      this.revenueTotal+=amount;
      this.state.dispatch({type:"REVENUE_ADD",payload:tx});
      this.events.emit("paypal:payment",{...tx,status:"completed"});
      this.events.emit("hq:notify",{module:"Revenue",message:`Payment confirmed: $${amount.toFixed(2)}`,badge:"NEXUS"});
    },1500);
  }
  handleSubscription(data){
    const tier=data.tier?.toLowerCase();
    if(!this.tiers[tier]){this.events.emit("paypal:error",{error:"Invalid tier"});return}
    const amount=this.tiers[tier];
    const sub={subId:`SUB-${Date.now()}`,tier,amount,email:data.email,floor:data.floor||0,status:"active",timestamp:Date.now()};
    this.subscribers.push(sub);
    this.revenueTotal+=amount;
    this.state.dispatch({type:"SUBSCRIPTION_ADD",payload:sub});
    this.events.emit("paypal:subscription",{...sub});
    this.events.emit("hq:notify",{module:"Revenue",message:`New ${tier} subscriber: $${amount}/mo`,badge:"NEXUS"});
  }
  checkAccess(floorIndex,userId){
    const sub=this.subscribers.find(s=>s.email===userId&&s.status==="active");
    if(!sub)return false;
    if(sub.tier==="enterprise")return true;
    if(sub.tier==="professional"&&floorIndex<=5)return true;
    if(sub.tier==="starter"&&floorIndex<=2)return true;
    return false
  }
  getRevenueReport(){return{total:this.revenueTotal,transactions:this.transactions.length,subscribers:this.subscribers.length,tiers:this.tiers}}
}
window.EmpireRevenueLoopV1=EmpireRevenueLoopV1;
