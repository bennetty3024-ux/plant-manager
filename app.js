let plants = JSON.parse(localStorage.getItem("plants") || "[]")

function save(){
localStorage.setItem("plants", JSON.stringify(plants))
}

function addPlant(){

let category=document.getElementById("category").value
let group=document.getElementById("group").value
let name=document.getElementById("name").value
let pot=document.getElementById("pot").value
let memo=document.getElementById("memo").value

let plant={
category,
group,
name,
pot,
memo
}

plants.push(plant)

save()
renderPlants()

}

function renderPlants(){

let list=document.getElementById("plantList")
let search=document.getElementById("search").value

list.innerHTML=""

plants
.filter(p=>p.name.includes(search))
.forEach((p,i)=>{

let div=document.createElement("div")

div.className="plant"

div.innerHTML=`
<b>${p.name}</b><br>
대분류: ${p.category}<br>
중분류: ${p.group}<br>
화분: ${p.pot}<br>
메모: ${p.memo}
<button onclick="deletePlant(${i})">삭제</button>
`

list.appendChild(div)

})

}

function deletePlant(i){

plants.splice(i,1)

save()

renderPlants()

}


function calcSoil(){

let size=parseFloat(document.getElementById("soilSize").value)

let soil=size*0.6
let sand=size*0.3
let charcoal=size*0.1

document.getElementById("soilResult").innerHTML=`
실내용흙 ${soil} L<br>
산야초 ${sand} L<br>
훈탄 ${charcoal} L
`

}

function calcFertilizer(){

let size=parseFloat(document.getElementById("fertSize").value)

document.getElementById("fertResult").innerHTML=`${size} 알`
}


renderPlants()
