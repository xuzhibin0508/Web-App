'use strict';

//list of bars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];
function bookingPrice(){
  for(var i=0;i<events.length;i++){
    for(var j=0;j<bars.length;j++){
      if(bars[j].id==events[i].barId){
        events[i].price=events[i].persons*bars[j].pricePerPerson+events[i].time*bars[j].pricePerHour;
      }
    }
  }
}
function decreasingPricingForPeople(){
  for(var i=0;i<events.length;i++){
    for(var j=0;j<bars.length;j++){
      if(bars[j].id==events[i].barId){
        if(events[i].persons<10){events[i].price=events[i].persons*bars[j].pricePerPerson+events[i].time*bars[j].pricePerHour;}
        else if(events[i].persons<20){events[i].price=events[i].persons*bars[j].pricePerPerson*0.9+events[i].time*bars[j].pricePerHour;}
        else if(events[i].persons<60){events[i].price=events[i].persons*bars[j].pricePerPerson*0.7+events[i].time*bars[j].pricePerHour;}
        else{events[i].price=events[i].persons*bars[j].pricePerPerson*0.5+events[i].time*bars[j].pricePerHour;}
      }
    }
  }
}
function commission(){
  decreasingPricingForPeople();
  for(var i=0;i<events.length;i++){
    var commission=events[i].price*0.3;
    events[i].commission.insurance=commission*0.5;
    events[i].commission.treasury=events[i].persons*1;
    events[i].commission.privateaser=commission-events[i].commission.insurance-events[i].commission.treasury;
  }
}
function deductible(){
  commission();
  for(var i=0;i<events.length;i++){
    if(events[i].options.deductibleReduction==true){
      events[i].commission.privateaser=events[i].commission.privateaser+events[i].persons*1;
      events[i].price=events[i].price+events[i].persons*1;
    }
  }
}
function payActors(){
  deductible();
  for(var i=0;i<actors.length;i++){
    for(var j=0;j<events.length;j++){
      if(actors[i].eventId==events[j].id){
        for(var k=0;k<actors[i].payment.length;k++){
          if(actors[i].payment[k].who=="booker"){actors[i].payment[k].amount=events[j].price;}
          else if(actors[i].payment[k].who=="bar"){actors[i].payment[k].amount=events[j].price-events[j].commission.insurance-events[j].commission.treasury-events[j].commission.privateaser;}
          else if(actors[i].payment[k].who=="insurance"){actors[i].payment[k].amount=events[j].commission.insurance;}
          else if(actors[i].payment[k].who=="treasury"){actors[i].payment[k].amount=events[j].commission.treasury;}
          else{actors[i].payment[k].amount=events[j].commission.privateaser;}
        }
      }
    }
    
  }
}
//bookingPrice();
//decreasingPricingForPeople();
//commission();
//deductible();
payActors();
console.log(bars);
console.log(events);
console.log(actors);
