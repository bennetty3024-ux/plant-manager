let plants = JSON.parse(localStorage.getItem("plants") || "[]");

function render(){
const list=document.getElementById("plantList");
list.innerHTML="";
plants.forEach((p,i)=>{
const li=document.createElement("li");
li.innerHTML=p+" <button onclick='removePlant("+i+")'>삭제</button>";
list.appendChild(li);
});
}

function addPlant(){
const name=document.getElementById("plantName").value;
if(!name) return;
plants.push(name);
localStorage.setItem("plants",JSON.stringify(plants));
document.getElementById("plantName").value="";
render();
}

function removePlant(i){
plants.splice(i,1);
localStorage.setItem("plants",JSON.stringify(plants));
render();
}

render();

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}
