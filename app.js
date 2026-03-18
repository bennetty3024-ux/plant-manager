// app.js - 윤슬의 정원 매니저 v8 (통합판)
// 저장키
const STORAGE_KEY = "yoonseul_garden_v8_data_v1";

// 기본 데이터 구조 & 설정
const DEFAULT = {
  plants: [],   // {name, category, isSeed?:bool, seedCount?:int}
  logs: [],     // fert logs and repot logs: {type:'fert'|'repot', date, plant, fert:[...], note, next: {fert:date,...}}
  repots: []
};

// 카테고리 리스트 (사용자 필요시 확장 가능)
const CATEGORIES = [
  "사랑초","스카푸","베고니아","구근류","수국","파종 식물","가든멈국화","미니신닌기아","팬지/비올라"
];

{
  "name": "새식물",
  "pot_size": 12,
  "soil_mix": "반에그먼트 + 산야초 + 훈탄 + 마감프K 소립",
  "fertilizers": ["아그로믹파워", "마감프K 3개월용"],
  "pesticides": ["벅스킬"]
}
// 영양제 간격(일수 기준)
const FERT_INTERVALS = {
  "아그로믹파워": 90,
  "오스모코트": 120,
  "멀티코트": 180,
  "잭스 Grow": 14,
  "잭스 Bloom": 14,
  "골드아이언": 45,
  "하이파 멀티미크로": 30,
  "토탈싹": null   // 보통 분갈이 시 1회 / 필요시만
};

// 가지치기 가이드
const PRUNE_GUIDE = {
  "수국":"개화 직후 가지치기 권장. 7월 중순 이후 가지치기 금지(내년 꽃 손상).",
  "사랑초":"꽃이 진 직후 가벼운 솎음. 병든 잎은 즉시 제거.",
  "스카푸":"데드헤드(시든 꽃) 제거. 큰 정리는 개화 후 또는 초봄.",
  "베고니아":"개화후 가벼운 가지치기. 통풍 위해 오래된 잎 제거.",
  "구근류":"개화 후 잎이 완전히 마를 때까지 기다렸다 제거.",
  "팬지/비올라":"시든 꽃 자주 제거(데드헤드)로 개화 연장.",
  "미니신닌기아":"시든 꽃·잎만 정리, 구근 손상 주의."
};

// 흙레시피 (1L 기준, ml와 g 혼합 표기: 흙용량은 ml, 비료는 g)
const RECIPES = {
  "사랑초": {"VanEgmond":650,"산야초":250,"질석":0,"훈탄":100,"마감프K":1.5,"멀티코트":3,"아그로믹파워":1,"토탈싹":0.8},
  "스카푸": {"VanEgmond":450,"산야초":350,"질석":100,"훈탄":100,"멀티코트":2,"마감프K":1,"아그로믹파워":1,"토탈싹":0.8},
  "베고니아": {"VanEgmond":500,"산야초":300,"질석":100,"훈탄":100,"멀티코트":2,"아그로믹파워":1,"토탈싹":0.8},
  "미니신닌기아": {"VanEgmond":400,"산야초":350,"질석":150,"훈탄":100,"멀티코트":3,"아그로믹파워":1,"토탈싹":0.8},
  "구근류": {"VanEgmond":550,"산야초":300,"질석":50,"훈탄":100,"멀티코트":2,"토탈싹":0.8},
  "수국": {"VanEgmond":600,"산야초":300,"질석":0,"훈탄":100,"멀티코트":3,"아그로믹파워":1,"토탈싹":0.8},
  "팬지/비올라": {"VanEgmond":600,"산야초":300,"질석":0,"훈탄":100,"멀티코트":2,"토탈싹":0.8},
  "가든멈국화": {"VanEgmond":600,"산야초":300,"질석":0,"훈탄":100,"멀티코트":3,"토탈싹":0.8},
  "파종 식물": {"VanEgmond":500,"산야초":300,"질석":200,"훈탄":0,"멀티코트":1,"토탈싹":0.5}
};

// 화분 부피 (L)
const POTS = {"5호":0.3,"9호":0.8,"10호":1.0,"15호":2.5};

// 앱 데이터 로드/저장 (localStorage)
function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return JSON.parse(JSON.stringify(DEFAULT));
  try{
    return JSON.parse(raw);
  } catch(e){
    console.error("data parse error", e);
    return JSON.parse(JSON.stringify(DEFAULT));
  }
}
function saveData(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(st.data));
}

// 전역 상태
const st = { data: loadData() };

// DOM 초기화
document.addEventListener("DOMContentLoaded", ()=>{
  initTabs();
  initCategorySelectors();
  renderDashboard();
  renderPlantsPage();
  renderFertPage();
  renderSoilSelectors();
  renderRepotSelectors();
  renderLight();
  bindDataButtons();
});

// 탭 UI
function initTabs(){
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      showPage(btn.dataset.page);
    });
  });
  showPage("dashboard");
}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");
}

// 카테고리 셀렉터 초기화
function initCategorySelectors(){
  const catEls = document.querySelectorAll("#newCategory, #fertPlant, #repotPlant, #soilPlant");
  catEls.forEach(sel=>{
    sel.innerHTML = "";
    CATEGORIES.forEach(c=>{
      const opt = document.createElement("option"); opt.value=c; opt.textContent=c;
      sel.appendChild(opt);
    });
  });
  // plant select in fert uses actual plant names
  updateFertPlantOptions();
}

// 대시보드 렌더
function renderDashboard(){
  // quick top3: user top3 preference: 사랑초, 미니신닌기아, 베고니아
  const top3 = ["사랑초","미니신닌기아","베고니아"];
  const quickEl = document.getElementById("quickCards");
  quickEl.innerHTML = "";
  top3.forEach(cat=>{
    const count = st.data.plants.filter(p=>p.category===cat).length;
    const card = document.createElement("div"); card.className="quick-card";
    card.innerHTML = `<strong>${cat}</strong><div>개체수: ${count}</div>
      <div style="margin-top:8px"><button class="small-btn" onclick="openCategory('${cat}')">열기</button>
      <button class="small-btn" onclick="quickRepot('${cat}')">분갈이 계산</button></div>`;
    quickEl.appendChild(card);
  });

  // stats
  const stats = document.getElementById("stats");
  stats.innerHTML = "";
  const total = st.data.plants.length;
  stats.innerHTML = `<div>총 식물 수: <strong>${total}</strong></div>`;
  const counts = {};
  st.data.plants.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
  Object.keys(counts).forEach(k=>{
    const d = document.createElement("div"); d.textContent = `${k} : ${counts[k]}`; stats.appendChild(d);
  });

  // today recommendations: scan logs for next dates on or before today
  renderTodayRecommendations();
}

// 오늘 권장(영양제 만료)
function renderTodayRecommendations(){
  const el = document.getElementById("todayRecommendations");
  const today = new Date().toISOString().slice(0,10);
  const recs = [];
  st.data.logs.forEach(log=>{
    if(log.next){
      Object.entries(log.next).forEach(([f,d])=>{
        if(!d) return;
        if(d <= today){
          recs.push(`${log.plant} → ${f} 권장(${d})`);
        }
      });
    }
  });
  // also add prune tips for top plants if applicable
  const pruneTips = [];
  ["사랑초","수국","스카푸","베고니아","미니신닌기아"].forEach(cat=>{
    const any = st.data.plants.find(p=>p.category===cat);
    if(any && PRUNE_GUIDE[cat]) pruneTips.push(`${cat}: ${PRUNE_GUIDE[cat]}`);
  });
  const lines = recs.concat(pruneTips);
  el.innerHTML = lines.length ? lines.map(x=>`<div>${x}</div>`).join("") : "- 없음 -";
}

// 식물관리 페이지 렌더
function renderPlantsPage(){
  // category list
  const catList = document.getElementById("categoryList");
  catList.innerHTML = "";
  CATEGORIES.forEach(cat=>{
    const items = st.data.plants.filter(p=>p.category===cat);
    if(items.length===0) return;
    const row = document.createElement("div"); row.className="cat-row";
    const left = document.createElement("div");
    left.innerHTML = `<strong>${cat}</strong> <small>(${items.length})</small>`;
    const right = document.createElement("div");
    right.innerHTML = `<button class="small-btn" onclick="openCategory('${cat}')">열기</button>
                       <button class="small-btn" onclick="exportCategory('${cat}')">내보내기</button>`;
    row.appendChild(left); row.appendChild(right);
    catList.appendChild(row);
  });
}

// open category detail (list items & delete)
window.openCategory = function(cat){
  // show modal-like simple list using prompt for mobile simplicity
  const items = st.data.plants.filter(p=>p.category===cat);
  let text = `${cat} (${items.length})\n\n`;
  items.forEach((p,i)=> text += `${i+1}. ${p.name}\n`);
  text += `\n삭제하려면 정확한 이름을 입력하세요. (취소 누르면 닫힘)`;
  const toDel = prompt(text);
  if(!toDel) return;
  const idx = st.data.plants.findIndex(p=>p.name===toDel && p.category===cat);
  if(idx===-1){ alert("일치하는 식물 이름이 없습니다."); return; }
  // check if logs exist
  const name = st.data.plants[idx].name;
  const used = st.data.logs.some(l=>l.plant===name);
  if(used){
    if(!confirm("이 식물에 기록이 있습니다. 기록도 함께 삭제할까요? (확인=기록 삭제, 취소=취소)")) return;
    // delete logs
    st.data.logs = st.data.logs.filter(l=>l.plant!==name);
  }
  st.data.plants.splice(idx,1);
  saveData(); renderPlantsPage(); renderDashboard(); updateFertPlantOptions();
  alert("삭제되었습니다.");
};

// export single category
window.exportCategory = function(cat){
  const items = st.data.plants.filter(p=>p.category===cat);
  const blob = new Blob([JSON.stringify(items,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`plants_${cat}.json`; a.click();
  URL.revokeObjectURL(url);
};

// add new plant(s)
document.getElementById("addBtn").addEventListener("click", ()=>{
  const name = document.getElementById("newName").value.trim();
  const cat = document.getElementById("newCategory").value;
  if(!name){ alert("이름을 입력하세요."); return; }
  st.data.plants.push({name, category:cat});
  saveData(); document.getElementById("newName").value=""; renderPlantsPage(); renderDashboard(); updateFertPlantOptions();
});

// bulk add
document.getElementById("bulkAddBtn").addEventListener("click", ()=>{
  const text = document.getElementById("bulkNames").value.trim();
  const cat = document.getElementById("newCategory").value;
  const seedCount = parseInt(document.getElementById("seedCount").value) || 0;
  if(!text){ alert("한 줄 이상 입력하세요."); return; }
  // split by newline or comma
  const names = text.split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean);
  names.forEach(n=>{
    if(seedCount>0 && cat==="파종 식물"){
      st.data.plants.push({name:n, category:cat, isSeed:true, seedCount:seedCount});
    } else {
      st.data.plants.push({name:n, category:cat});
    }
  });
  saveData(); document.getElementById("bulkNames").value=""; document.getElementById("seedCount").value="";
  renderPlantsPage(); renderDashboard(); updateFertPlantOptions();
});

// search plants
document.getElementById("searchPlant").addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const container = document.getElementById("categoryList");
  container.innerHTML = "";
  const filtered = st.data.plants.filter(p=>p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  // group by category
  const byCat = {};
  filtered.forEach(p=>{ byCat[p.category]=byCat[p.category]||[]; byCat[p.category].push(p); });
  Object.keys(byCat).forEach(cat=>{
    const row = document.createElement("div"); row.className="cat-row";
    const left = document.createElement("div"); left.innerHTML = `<strong>${cat}</strong> <small>(${byCat[cat].length})</small>`;
    const right = document.createElement("div"); right.innerHTML = `<button class="small-btn" onclick="openCategory('${cat}')">열기</button>`;
    row.appendChild(left); row.appendChild(right);
    container.appendChild(row);
  });
});

// FERT page render
function updateFertPlantOptions(){
  const sel = document.getElementById("fertPlant");
  sel.innerHTML = "";
  st.data.plants.forEach(p=>{
    const opt = document.createElement("option"); opt.value=p.name; opt.textContent = `${p.category} - ${p.name}`;
    sel.appendChild(opt);
  });
}
function renderFertPage(){
  updateFertPlantOptions();
  // render options
  const fertContainer = document.getElementById("fertOptions");
  fertContainer.innerHTML = "";
  Object.keys(FERT_INTERVALS).forEach(f=>{
    const div = document.createElement("div"); div.className="option";
    div.innerHTML = `<label><input type="checkbox" value="${f}"> ${f}</label>`;
    fertContainer.appendChild(div);
  });
  renderFertLogs();
}
document.getElementById("saveFert").addEventListener("click", ()=>{
  const plant = document.getElementById("fertPlant").value;
  const checked = Array.from(document.querySelectorAll("#fertOptions input[type=checkbox]:checked")).map(i=>i.value);
  if(checked.length===0){ alert("영양제 하나 이상 선택하세요."); return; }
  const note = document.getElementById("fertMemo").value.trim();
  const date = (new Date()).toISOString().slice(0,10);
  const next = {};
  checked.forEach(f=>{
    const days = FERT_INTERVALS[f];
    if(days==null) next[f] = null;
    else {
      const d = new Date(); d.setDate(d.getDate()+days);
      next[f] = d.toISOString().slice(0,10);
    }
  });
  const log = {type:"fert", date, plant, fert:checked, note, next};
  st.data.logs.push(log);
  saveData();
  document.getElementById("fertMemo").value="";
  document.querySelectorAll("#fertOptions input[type=checkbox]").forEach(c=>c.checked=false);
  renderFertLogs(); renderDashboard();
  alert("기록 저장 완료");
});

function renderFertLogs(){
  const el = document.getElementById("fertLogs"); el.innerHTML="";
  const list = st.data.logs.filter(l=>l.type==="fert").slice().reverse();
  if(list.length===0){ el.innerHTML = "<div class='hint'>기록이 없습니다.</div>"; return; }
  list.forEach(l=>{
    const d = document.createElement("div"); d.className = "card";
    let nextText = "";
    if(l.next){
      nextText = "<div>다음 권장: " + Object.entries(l.next).map(([k,v])=> `${k}: ${v||"필요시만"}`).join(" | ") + "</div>";
    }
    d.innerHTML = `<strong>${l.date}</strong> | ${l.plant} | ${l.fert.join(", ")} ${nextText}
      <div style="margin-top:6px;"><em>${l.note||""}</em></div>
      <div style="margin-top:6px;"><button class="small-btn" onclick='deleteLog("${l.date}","${l.plant}","${JSON.stringify(l.fert).replace(/"/g,'&quot;')}")'>삭제</button></div>`;
    el.appendChild(d);
  });
}
window.deleteLog = function(date, plant, fertJson){
  // careful removal
  const fert = JSON.parse(fertJson.replace(/&quot;/g,'"'));
  const idx = st.data.logs.findIndex(l=>l.date===date && l.plant===plant && JSON.stringify(l.fert)===JSON.stringify(fert));
  if(idx===-1) return alert("기록을 찾을 수 없습니다.");
  if(confirm("기록을 삭제하시겠습니까?")){ st.data.logs.splice(idx,1); saveData(); renderFertLogs(); renderDashboard(); }
};

// Soil / recipe
function renderSoilSelectors(){
  const sel = document.getElementById("soilPlant");
  sel.innerHTML = "";
  Object.keys(RECIPES).forEach(k=>{
    const opt = document.createElement("option"); opt.value=k; opt.textContent=k; sel.appendChild(opt);
  });
  document.getElementById("showRecipe").addEventListener("click", ()=>{
    const plant = document.getElementById("soilPlant").value;
    showRecipe(plant);
  });
}
function showRecipe(plant){
  const rec = RECIPES[plant];
  const el = document.getElementById("recipeResult");
  el.innerHTML = `<strong>${plant} (1L 기준)</strong><br>`;
  Object.entries(rec).forEach(([k,v])=>{
    if(["VanEgmond","산야초","질석","훈탄"].includes(k)) el.innerHTML += `${k}: ${v} ml<br>`;
    else el.innerHTML += `${k}: ${v} g<br>`;
  });
}

// Repot calculator
function renderRepotSelectors(){
  const sel = document.getElementById("repotPlant");
  sel.innerHTML = "";
  Object.keys(RECIPES).forEach(k=> sel.appendChild(new Option(k,k)));
  document.getElementById("calcRepot").addEventListener("click", calcRepotHandler);
  document.getElementById("saveRepotRecord").addEventListener("click", saveRepotRecord);
  renderRepotLogs();
}
function calcRepotHandler(){
  const plant = document.getElementById("repotPlant").value;
  const potVol = parseFloat(document.getElementById("repotPot").value);
  const count = Math.max(1, parseInt(document.getElementById("repotCount").value||1));
  const total = +(potVol * count).toFixed(2);
  const recipe = RECIPES[plant];
  let out = `<strong>총 흙: ${total} L (화분 ${count}개)</strong><br><br>`;
  Object.entries(recipe).forEach(([k,v])=>{
    if(["VanEgmond","산야초","질석","훈탄"].includes(k)){
      // recipe numbers are ml per 1L, so scale by total L
      const ml = v * total;
      out += `${k}: ${ml.toFixed(0)} ml<br>`;
    } else {
      const g = v * total;
      out += `${k}: ${g.toFixed(1)} g<br>`;
    }
  });
  document.getElementById("repotResult").innerHTML = out;
}
function saveRepotRecord(){
  const plant = document.getElementById("repotPlant").value;
  const potVol = parseFloat(document.getElementById("repotPot").value);
  const count = Math.max(1, parseInt(document.getElementById("repotCount").value||1));
  const total = +(potVol * count).toFixed(2);
  const date = (new Date()).toISOString().slice(0,10);
  const recipe = RECIPES[plant];
  const record = {type:"repot", date, plant, pot:potVol, count, total, recipe};
  st.data.repots = st.data.repots || [];
  st.data.repots.push(record);
  st.data.logs.push({type:"repot_log", date, plant, note:`분갈이 ${count}개, 총 ${total}L`});
  saveData(); renderRepotLogs(); renderFertLogs(); renderDashboard();
  alert("분갈이 기록 저장됨");
}
function renderRepotLogs(){
  const el = document.getElementById("repotLogs"); el.innerHTML="";
  (st.data.repots||[]).slice().reverse().forEach(r=>{
    const d = document.createElement("div"); d.className="card";
    d.innerHTML = `<strong>${r.date}</strong> | ${r.plant} | ${r.count}개 | 총 ${r.total}L`;
    el.appendChild(d);
  });
}

// Light calc
function renderLight(){
  const el = document.getElementById("lightInfo");
  const month = new Date().getMonth()+1;
  let light;
  if([3,4,5].includes(month)) light = "봄: 식물등 권장 6시간 (자연광 보조)";
  else if([6,7,8].includes(month)) light = "여름: 식물등 권장 4~5시간 (차광 고려)";
  else if([9,10,11].includes(month)) light = "가을: 식물등 권장 6시간";
  else light = "겨울: 식물등 권장 9~10시간";
  el.innerHTML = `<div>${light}</div><div style="margin-top:6px">환경: 정남향 베란다 · 소나무 차광</div>`;
}

// Data export/import
document.getElementById("exportBtn").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(st.data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "garden_backup.json"; a.click();
  URL.revokeObjectURL(url);
});
document.getElementById("importBtn").addEventListener("click", ()=>{
  const f = document.getElementById("importFile").files[0];
  if(!f){ alert("파일 선택하세요"); return; }
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const json = JSON.parse(e.target.result);
      if(!confirm("현재 데이터가 백업됩니다. 불러오시겠습니까?")) return;
      localStorage.setItem(STORAGE_KEY+"_backup_"+Date.now(), JSON.stringify(st.data));
      st.data = json;
      saveData(); location.reload();
    } catch(err){ alert("JSON 파싱 실패"); }
  };
  reader.readAsText(f);
});
document.getElementById("resetBtn").addEventListener("click", ()=>{
  if(!confirm("앱 데이터를 완전히 초기화합니다. 계속할까요?")) return;
  localStorage.removeItem(STORAGE_KEY); st.data = JSON.parse(JSON.stringify(DEFAULT)); saveData(); location.reload();
});

// helpers: quick functions
function quickRepot(category){
  // pick first recipe matching category if exists
  const plantTypes = Object.keys(RECIPES);
  let plant = plantTypes.find(p=>p===category) || plantTypes[0];
  document.getElementById("repotPlant").value = plant;
  showPage("repot");
}
function openCategory(cat){ showPage("plants"); document.getElementById("searchPlant").value = cat; const ev = new Event('input'); document.getElementById("searchPlant").dispatchEvent(ev); }

// update plant select options where necessary
function updateFertPlantOptions(){ const sel = document.getElementById("fertPlant"); sel.innerHTML=""; st.data.plants.forEach(p=> sel.appendChild(new Option(`${p.category} - ${p.name}`, p.name))); }
function updateAll(){ initCategorySelectors(); renderPlantsPage(); renderDashboard(); renderFertPage(); renderSoilSelectors(); renderRepotSelectors(); renderLight(); }

// initial update
updateAll();

// bind generic elements
function bindDataButtons(){
  // ensure selectors reflect data
  updateFertPlantOptions();
}
