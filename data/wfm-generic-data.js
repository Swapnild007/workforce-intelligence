/* Workforce Intelligence — Generic WFM demonstration dataset
 * No client/company/PII data. Designed as a reusable reference dataset.
 */
window.WFM_GENERIC_DATA = {
  organization:{name:"Acme Customer Operations",timezone:"Asia/Kolkata",intervalMinutes:30},
  lobs:[
    {id:"retail",name:"Retail Support",channel:"Voice",targetSL:0.80,aht:300,shrinkage:0.28},
    {id:"billing",name:"Billing & Payments",channel:"Voice",targetSL:0.85,aht:360,shrinkage:0.30},
    {id:"digital",name:"Digital Support",channel:"Chat",targetSL:0.90,aht:420,shrinkage:0.25},
    {id:"claims",name:"Service Requests",channel:"Email",targetSL:0.90,aht:600,shrinkage:0.27}
  ],
  skills:[
    {id:"voice-general",name:"Voice General",lobs:["retail","billing"]},
    {id:"billing",name:"Billing",lobs:["billing"]},
    {id:"chat",name:"Web Chat",lobs:["digital"]},
    {id:"email",name:"Email",lobs:["claims"]},
    {id:"escalations",name:"Escalations",lobs:["retail","billing","digital","claims"]}
  ],
  agents:[
    {id:"AG001",name:"Agent 001",skills:["voice-general","billing"]},
    {id:"AG002",name:"Agent 002",skills:["voice-general"]},
    {id:"AG003",name:"Agent 003",skills:["voice-general","escalations"]},
    {id:"AG004",name:"Agent 004",skills:["billing","escalations"]},
    {id:"AG005",name:"Agent 005",skills:["chat"]},
    {id:"AG006",name:"Agent 006",skills:["chat","escalations"]},
    {id:"AG007",name:"Agent 007",skills:["email"]},
    {id:"AG008",name:"Agent 008",skills:["email","escalations"]},
    {id:"AG009",name:"Agent 009",skills:["voice-general","billing"]},
    {id:"AG010",name:"Agent 010",skills:["voice-general","chat"]}
  ],
  dailyDemand:{
    retail:[24,20,18,16,14,12,10,9,12,18,25,32,38,42,45,44,40,36,31,27,24,22,20,18],
    billing:[18,16,15,14,13,12,10,10,13,17,22,28,33,37,39,38,35,31,27,23,21,19,18,17],
    digital:[10,9,8,8,7,7,8,10,14,18,23,27,30,32,34,35,33,30,27,24,21,18,15,12],
    claims:[8,7,6,6,5,5,5,6,8,11,14,17,19,20,21,21,20,18,16,14,12,11,10,9]
  },
  historicalMonthly:[8200,8050,8300,8550,8720,8900,9150,9020,9280,9460,9700,9920,10150,10080,10320,10640,10920,11180,11450,11320,11760,12040,12380,12620]
};
