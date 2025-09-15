(function(){
  function byId(id){return document.getElementById(id);}
  function hideSplash(){
    var sp=byId('splash'); if(sp){sp.className+=' fadeout';}
    setTimeout(function(){
      if(sp){sp.style.display='none';}
      var m=byId('main'); if(m){m.style.transition='opacity .45s ease'; m.style.opacity='1';}
      loadManifest();
    },560);
  }
  window.addEventListener('load',function(){setTimeout(hideSplash,2000);});

  var allData=null,currentCat='all';
  function loadManifest(){
    fetch('quizzes/manifest.json',{cache:'no-store'})
      .then(function(res){return res.json();})
      .then(function(json){allData=json;buildSegments();renderList();})
      .catch(function(e){console.error('manifest load error',e);});
  }
  function catsFromData(){
    var set={},arr=['すべて']; if(!allData||!allData.quizzes)return arr;
    for(var i=0;i<allData.quizzes.length;i++){var q=allData.quizzes[i];var c=q.category||'その他';set[c]=true;}
    var keys=Object.keys(set);keys.sort();for(var j=0;j<keys.length;j++){arr.push(keys[j]);}
    return arr;
  }
  function buildSegments(){
    var holder=byId('segments'); if(!holder)return; holder.innerHTML='';
    var cats=catsFromData();
    for(var i=0;i<cats.length;i++){
      (function(c,idx){
        var val=(c==='すべて')?'all':c;
        var btn=document.createElement('button');
        btn.className='seg'+(idx===0?' seg-active':'');
        btn.setAttribute('role','tab');btn.setAttribute('aria-pressed',idx===0?'true':'false');
        btn.appendChild(document.createTextNode(c));
        btn.onclick=function(){
          var ch=holder.children;for(var k=0;k<ch.length;k++){ch[k].classList.remove('seg-active');ch[k].setAttribute('aria-pressed','false');}
          btn.classList.add('seg-active');btn.setAttribute('aria-pressed','true');currentCat=val;renderList();
        };
        holder.appendChild(btn);
      })(cats[i],i);
    }
  }
  function renderList(){
    var list=byId('quizList'); if(!list)return; list.innerHTML='';
    if(!allData||!allData.quizzes)return;
    for(var i=0;i<allData.quizzes.length;i++){
      var q=allData.quizzes[i]; if(currentCat!=='all'&&((q.category||'その他')!==currentCat))continue;
      var wrap=document.createElement('div');wrap.className='card';
      var row=document.createElement('div');row.className='row';
      var h2=document.createElement('h2');h2.textContent=q.title;row.appendChild(h2);
      if(q.category){var pill=document.createElement('span');pill.className='pill';pill.textContent=q.category;row.appendChild(pill);}
      wrap.appendChild(row);
      var p=document.createElement('p');p.className='muted';p.textContent=q.count+'問 / 更新日: '+q.updated;wrap.appendChild(p);
      var sliderrow=document.createElement('div');sliderrow.className='sliderrow';
      var lab=document.createElement('label');lab.textContent='出題数';sliderrow.appendChild(lab);
      var range=document.createElement('input');range.type='range';range.min='1';range.max=String(q.count);range.value=String(q.count);range.className='slider';
      var valSpan=document.createElement('span');valSpan.className='badge';valSpan.textContent=String(q.count);
      range.oninput=(function(vs,r){return function(){vs.textContent=r.value;};})(valSpan,range);
      sliderrow.appendChild(range);sliderrow.appendChild(valSpan);wrap.appendChild(sliderrow);
      var modeRow=document.createElement('div');modeRow.className='mode-row';
      var nbtn=document.createElement('button');nbtn.className='btn ghost';nbtn.textContent='ノーマル';
      nbtn.onclick=(function(id,r){return function(){startQuiz(id,r.value,'normal');};})(q.id,range);
      var cbtn=document.createElement('button');cbtn.className='btn';cbtn.textContent='チャレンジ';
      cbtn.onclick=(function(id,r){return function(){startQuiz(id,r.value,'challenge');};})(q.id,range);
      modeRow.appendChild(nbtn);modeRow.appendChild(cbtn);wrap.appendChild(modeRow);
      list.appendChild(wrap);
    }
  }
  function startQuiz(id,count,mode){
    location.href='quiz.html?id='+encodeURIComponent(id)+'&count='+encodeURIComponent(count)+'&mode='+encodeURIComponent(mode);
  }
})();