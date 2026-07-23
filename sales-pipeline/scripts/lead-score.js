function scoreLead(lead){

let score=0;

if(lead.website) score+=20;
if(lead.business) score+=20;
if(lead.needAI) score+=30;
if(lead.replied) score+=30;

return score;

}

module.exports={scoreLead};

