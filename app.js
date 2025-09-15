(function(){
function $(id){return document.getElementById(id);}
function hideSplash(){var sp=$("splash");if(sp){sp.className+=" fadeout";}setTimeout(function(){if(sp)sp.style.display="none";$("main").style.opacity=1;loadManifest();},600);}
window.addEventListener("load",function(){setTimeout(hideSplash,2000);});
var allData=null,currentCat="all";
function loadManifest(){fetch("quizzes/manifest.json",{cache:"no-store"}).then(r=>r.json()).then(j=>{allData=j;buildSeg();render();});}
function cats(){var set={},arr=["すべて"];if(!allData)return arr;allData.quizzes.forEach(q=>set[q.category||"その他"]=1);return arr.concat(Object.keys(set));}
function buildSeg(){var h=$("segments");h.innerHTML="";cats().forEach((c,i)=>{var b=document.createElement("button");b.className="seg"+(i==0?" seg-active":"");b.innerText=c;b.onclick=()=>{Array.from(h.children).forEach(x=>x.classList.remove("seg-active"));b.classList.add("seg-active");currentCat=(c==="すべて")?"all":c;render();};h.appendChild(b);});}
function render(){var list=$("quizList");list.innerHTML="";if(!allData)return;allData.quizzes.forEach(q=>{if(currentCat!=="all"&&(q.category||"その他")!==currentCat)return;
 var wrap=document.createElement("div");wrap.className="card";
 var h2=document.createElement("h2");h2.innerText=q.title;wrap.appendChild(h2);
 var p=document.createElement("p");p.className="muted";p.innerText=q.count+"問 / 更新日:"+q.updated;wrap.appendChild(p);
 var range=document.createElement("input");range.type="range";range.min=1;range.max=q.count;range.value=q.count;
 var lab=document.createElement("span");lab.innerText=" 出題数:"+q.count;
 range.oninput=()=>lab.innerText=" 出題数:"+range.value;
 wrap.appendChild(range);wrap.appendChild(lab);
 var row=document.createElement("div");row.className="end-actions";
 var nbtn=document.createElement("button");nbtn.className="btn ghost";nbtn.innerText="ノーマル";nbtn.onclick=()=>start(q.id,range.value,"normal");
 var cbtn=document.createElement("button");cbtn.className="btn";cbtn.innerText="チャレンジ";cbtn.onclick=()=>start(q.id,range.value,"challenge");
 row.appendChild(nbtn);row.appendChild(cbtn);
 // ベストタイム表示
 var best=bestTime(q.id,"challenge");var span=document.createElement("span");span.className="small muted";
 if(best!=null){span.innerText="⏱"+best.toFixed(2)+"秒";var avg=best/q.count;var trophy=document.createElement("span");trophy.style.marginLeft="6px";
 if(avg<=2)trophy.innerText="👑";else if(avg<=3)trophy.innerText="🥈";else{trophy.innerText="👑";trophy.style.opacity=.3;}span.appendChild(trophy);}else{span.innerText="記録なし 👑";span.style.opacity=.3;}
 row.appendChild(span);
 wrap.appendChild(row);
 list.appendChild(wrap);});}
function start(id,count,mode){location.href="quiz.html?id="+id+"&count="+count+"&mode="+mode;}
function bestTime(id,mode){try{var arr=JSON.parse(localStorage.getItem("quizRecords:"+id+":"+mode)||"[]");var best=null;arr.forEach(r=>{if(r.correct===r.total&&typeof r.time==="number"){if(best==null||r.time<best)best=r.time;}});return best;}catch(e){return null;}}
})();