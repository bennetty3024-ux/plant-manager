const SOIL_DATA={

사랑초:{
soil:{VanEgmond:650,산야초:250,훈탄:100},
tip:"분갈이 후 3일 반그늘"
},

수국:{
soil:{VanEgmond:600,산야초:300,훈탄:100},
tip:"분갈이 후 5일 차광"
},

베고니아:{
soil:{VanEgmond:500,산야초:300,질석:100,훈탄:100},
tip:"통풍 중요 / 과습 주의"
},

스카푸:{
soil:{VanEgmond:450,산야초:350,질석:100,훈탄:100},
tip:"건조한 환경 선호"
},

미니신닌기아:{
soil:{VanEgmond:400,산야초:350,질석:150,훈탄:100},
tip:"구근 손상 주의"
}

};

const FERT_INTERVAL={

아그로믹파워:90,
멀티코트:180,
오스모코트:120,
골드아이언:45,
벅스킬:30,
토탈싹:30

};

function calcSoil(){

const plant=document.getElementById("plant").value;

const pot=parseFloat(document.getElementById("pot").value);

if(!pot){

alert("화분 용량 입력");

return;

}

const data=SOIL_DATA[plant];

let html="<b>흙 배합</b><br>";

Object.entries(data.soil).forEach(([k,v])=>{

html+=`${k} : ${v*pot} ml<br>`;

});

html+=`<br><b>분갈이 후 관리</b><br>${data.tip}`;

document.getElementById("soilResult").innerHTML=html;

}

function calcFert(){

const fert=document.getElementById("fert").value;

const days=FERT_INTERVAL[fert];

const date=new Date();

date.setDate(date.getDate()+days);

const next=date.toISOString().slice(0,10);

document.getElementById("fertResult").innerHTML=

`다음 사용일 : ${next}`;

}

function showPrune(){

const tips=[

"가지치기는 생장기 초반",
"꽃이 끝난 후 전정하면 꽃수 증가",
"분갈이 후 2주 뒤 영양제 시작",
"토양살충제는 30일 간격 사용",
"벅스킬은 4주 간격"

];

const tip=tips[Math.floor(Math.random()*tips.length)];

document.getElementById("tipResult").innerHTML=tip;

}
