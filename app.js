let plants = JSON.parse(localStorage.getItem("plants")) || []
let records = JSON.parse(localStorage.getItem("records")) || []

function saveData(){
localStorage.setItem("plants",JSON.stringify(plants))
localStorage.setItem("records",JSON.stringify(records))
}

function renderPlants(){
const list=document.getElementById("plantList")
list.innerHTML=""
plants.forEach((p,i)=>{
const div=document.createElement("div")
div.className="plant"
div.innerHTML=`
<b>${p.name}</b>
<br>
${p.category} / ${p.sub}
<br>
<button onclick="deletePlant(${i})">삭제</button>
`
list.appendChild(div)
})
}

function renderRecords(){
const box=document.getElementById("records")
box.innerHTML=""
records.slice().reverse().forEach(r=>{
const div=document.createElement("div")
div.className="record"
div.innerHTML=`
${r.date}
<br>
${r.type}
<br>
${r.note}
`
box.appendChild(div)
})
}

function addPlant(){
const category=document.getElementById("category").value
const sub=document.getElementById("subCategory").value
const name=document.getElementById("plantName").value
if(!name)return
plants.push({
category:category,
sub:sub,
name:name
})
saveData()
renderPlants()
}

function deletePlant(i){
plants.splice(i,1)
saveData()
renderPlants()
}

function saveRecord(){
const type=document.getElementById("actionType").value
const note=document.getElementById("note").value
records.push({
type:type,
note:note,
date:new Date().toLocaleDateString()
})
saveData()
renderRecords()
}

renderPlants()
renderRecords()
