// 윤슬 정원 매니저 v10 (GitHub Pages 안정판)

const STORAGE_KEY="yoonseul_garden_v10";

const DEFAULT={
plants:[],
logs:[]
};

const CATEGORIES=[
"사랑초","스카푸","베고니아","구근류","수국",
"미니신닌기아","팬지/비올라","가든멈국화","파종 식물"
];

const SOIL_RECIPES={

"사랑초":{
soil:{VanEgmond:650,산야초:250,훈탄:100},
fert:{마감프K:1.5,멀티코트:3,아그로믹파워:1},
pest:{토탈싹:0.8},
tips:"배수 중요. 분갈이 후 3일 반그늘"
},

"스카푸":{
soil:{VanEgmond:450,산야초:350,질석:100,훈탄:100},
fert:{멀티코트:2,마감프K:1},
pest:{토탈싹:0.8},
tips:"통풍 중요. 과습 주의"
},

"베고니아":{
soil:{VanEgmond:500,산야초:300,질석:100,훈탄:100},
fert:{멀티코트:2},
pest:{토탈싹:0.8},
tips:"밝은 반그늘. 잎 물묻힘 주의"
},

"미니신닌기아":{
soil:{VanEgmond:400,산야초:350,질석:150,훈탄:100},
fert:{멀티코트:3},
pest:{토탈싹:0.8},
tips:"구근 손상 주의"
},

"수국":{
soil:{VanEgmond:600,산야초:300,훈탄:100},
fert:{멀티코트:3,아그로믹파워:1},
pest:{토탈싹:0.8},
tips:"분갈이 후 5일 반그늘"
},

"구근류":{
soil:{VanEgmond:550,산야초:300,질석:50,훈탄:100},
fert:{멀티코트:2},
pest:{토탈싹:0.8},
tips:"개화후 잎 마를때까지 유지"
}

};

const FERT_INTERVAL={

"아그로믹파워":90,
"멀티코트":180,
"오스모코트":120,
"골드아이언":45,
"잭스Grow":14,
"잭스Bloom":14,
"하이파멀티미크로":30,
"벅스킬":30

};

let data=load();

function load(){

const raw=localStorage.getItem(STORAGE_KEY);

if(!raw) return DEFAULT;

return JSON.parse(raw);

}

function save(){

localStorage.setItem(STORAGE_KEY,JSON.stringify(data));

}

document.addEventListener("DOMContentLoaded",init);

function init(){

initTabs();
initCategory();
renderPlants();
renderFertPlants();
renderRecipes();
renderLogs();

}

function initTabs(){

document.querySelectorAll(".tab").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
btn.classList.add("active");

document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));

document.getElementById(btn.dataset.page).classList.remove("hidden");

};

});

}

function initCategory(){

const sel=document.getElementById("newCategory");

CATEGORIES.forEach(c=>{

const o=document.createElement("option");
o.value=c;
o.textContent=c;

sel.appendChild(o);

});

}

function renderPlants(){

const box=document.getElementById("categoryList");

box.innerHTML="";

data.plants.forEach(p=>{

const row=document.createElement("div");

row.className="cat-row";

row.innerHTML=`${p.category} - ${p.name}`;

box.appendChild(row);

});

}

document.getElementById("addBtn").onclick=function(){

const name=document.getElementById("newName").value.trim();
const cat=document.getElementById("newCategory").value;

if(!name) return alert("이름 입력");

data.plants.push({name,category:cat});

save();

renderPlants();
renderFertPlants();

document.getElementById("newName").value="";

};

function renderFertPlants(){

const sel=document.getElementById("fertPlant");

if(!sel) return;

sel.innerHTML="";

data.plants.forEach(p=>{

const o=document.createElement("option");

o.value=p.name;
o.textContent=p.category+" - "+p.name;

sel.appendChild(o);

});

}

document.getElementById("saveFert").onclick=function(){

const plant=document.getElementById("fertPlant").value;
const note=document.getElementById("fertMemo").value;

const date=new Date().toISOString().slice(0,10);

data.logs.push({plant,date,note});

save();

renderLogs();

};

function renderLogs(){

const el=document.getElementById("fertLogs");

if(!el) return;

el.innerHTML="";

data.logs.slice().reverse().forEach(l=>{

const div=document.createElement("div");

div.innerHTML=l.date+" | "+l.plant+" | "+(l.note||"");

el.appendChild(div);

});

}

function renderRecipes(){

const sel=document.getElementById("soilPlant");

if(!sel) return;

Object.keys(SOIL_RECIPES).forEach(p=>{

const o=document.createElement("option");

o.value=p;
o.textContent=p;

sel.appendChild(o);

});

}

document.getElementById("showRecipe").onclick=function(){

const plant=document.getElementById("soilPlant").value;

const rec=SOIL_RECIPES[plant];

let html="<b>흙배합 (1L 기준)</b><br>";

Object.entries(rec.soil).forEach(([k,v])=>{

html+=k+" "+v+"ml<br>";

});

html+="<br><b>영양제</b><br>";

Object.entries(rec.fert).forEach(([k,v])=>{

html+=k+" "+v+"g<br>";

});

html+="<br><b>토양살충제</b><br>";

Object.entries(rec.pest).forEach(([k,v])=>{

html+=k+" "+v+"g<br>";

});

html+="<br><b>분갈이 후 관리</b><br>"+rec.tips;

document.getElementById("recipeResult").innerHTML=html;

};
