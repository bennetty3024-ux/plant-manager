const STORAGE="yoonseul_garden_v11";

const FERT_SCHEDULE={
아그로믹파워:90,
멀티코트:180,
오스모코트:120,
골드아이언:45,
벅스킬:30,
토탈싹:30
};

const SOIL={

사랑초:{
soil:{VanEgmond:650,산야초:250,훈탄:100},
after:"분갈이후 3일 차광 / 물은 소량",
prune:"꽃대 마르면 제거"
},

수국:{
soil:{VanEgmond:600,산야초:300,훈탄:100},
after:"5일 반그늘 관리",
prune:"개화 후 바로 전정"
},

베고니아:{
soil:{VanEgmond:500,산야초:300,질석:100,훈탄:100},
after:"통풍 좋은곳",
prune:"웃자란 줄기 컷팅"
}

};

function calcSoil(){

const plant=document.getElementById("soilPlant").value;
const size=parseFloat(document.getElementById("potSize").value);

const recipe=SOIL[plant];

let html="<b>흙 배합</b><br>";

Object.entries(recipe.soil).forEach(([k,v])=>{

const amount=v*size;

html+=`${k} : ${amount} ml<br>`;

});

html+=`<br><b>분갈이 후 관리</b><br>${recipe.after}`;
html+=`<br><b>가지치기</b><br>${recipe.prune}`;

document.getElementById("soilResult").innerHTML=html;

}

function calcFert(){

const fert=document.getElementById("fertType").value;

const days=FERT_SCHEDULE[fert];

const today=new Date();

today.setDate(today.getDate()+days);

const next=today.toISOString().slice(0,10);

document.getElementById("fertResult").innerHTML=
`다음 사용일 : ${next}`;

}
