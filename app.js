const STORAGE="yoonseul_garden_pro";

let data=JSON.parse(localStorage.getItem(STORAGE)) || {

plants:[],
logs:[]

};

function save(){

localStorage.setItem(STORAGE,JSON.stringify(data));

}

function showPage(id){

document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));

document.getElementById(id).classList.remove("hidden");

}

function addPlant(){

const name=document.getElementById("plantName").value;

const type=document.getElementById("plantType").value;

if(!name)return;

data.plants.push({name,type});

save();

renderPlants();

}

function renderPlants(){

const list=document.getElementById("plantList");

list.innerHTML="";

data.plants.forEach(p=>{

const div=document.createElement("div");

div.innerHTML=p.type+" - "+p.name;

list.appendChild(div);

});

updatePlantSelect();

}

function updatePlantSelect(){

const sel=document.getElementById("logPlant");

sel.innerHTML="";

data.plants.forEach(p=>{

const o=document.createElement("option");

o.value=p.name;

o.textContent=p.name;

sel.appendChild(o);

});

}

function saveLog(){

const plant=document.getElementById("logPlant").value;

const type=document.getElementById("logType").value;

const memo=document.getElementById("logMemo").value;

const date=new Date().toISOString().slice(0,10);

data.logs.push({plant,type,memo,date});

save();

renderLogs();

}

function renderLogs(){

const list=document.getElementById("logList");

list.innerHTML="";

data.logs.slice().reverse().forEach(l=>{

const div=document.createElement("div");

div.innerHTML=l.date+" | "+l.plant+" | "+l.type;

list.appendChild(div);

});

}

function calcSoil(){

const plant=document.getElementById("soilPlant").value;

const size=parseFloat(document.getElementById("potSize").value);

const recipe={

사랑초:{VanEgmond:650,산야초:250,훈탄:100},

수국:{VanEgmond:600,산야초:300,훈탄:100},

베고니아:{VanEgmond:500,산야초:300,질석:100,훈탄:100}

};

const soil=recipe[plant];

let html="";

Object.entries(soil).forEach(([k,v])=>{

html+=k+" : "+(v*size)+" ml<br>";

});

document.getElementById("soilResult").innerHTML=html;

}

renderPlants();

renderLogs();
