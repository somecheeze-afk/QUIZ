
(function(){
  function byId(id){ return document.getElementById(id); }
  function hideSplash(){
    var sp = byId('splash');
    sp.className += ' fadeout';
    setTimeout(function(){
      sp.style.display = 'none';
      var m = byId('main');
      m.style.transition = 'opacity .45s ease';
      m.style.opacity = '1';
      loadManifest();
    }, 560);
  }
  window.addEventListener('load', function(){ setTimeout(hideSplash, 2000); });

  var allData = null, currentCat = 'all';

  function loadManifest(){
    fetch('quizzes/manifest.json', {cache:'no-store'})
      .then(function(res){ return res.json(); })
      .then(function(json){ allData = json; buildSegments(); renderList(); })
      .catch(function(e){ console.error(e); });
  }

  function catsFromData(){
    var set = {}; var arr = ['すべて'];
    allData.quizzes.forEach(function(q){ var c = q.category || 'その他'; set[c]=true; });
    Object.keys(set).sort().forEach(function(k){ arr.push(k); });
    return arr;
  }

  function buildSegments(){
    var holder = byId('segments'); holder.innerHTML='';
    var cats = catsFromData();
    cats.forEach(function(c,idx){
      var val = (c==='すべて') ? 'all' : c;
      var btn = document.createElement('button');
      btn.className = 'seg' + (idx===0?' seg-active':'');
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-pressed', idx===0?'true':'false');
      btn.appendChild(document.createTextNode(c));
      btn.onclick = function(){
        var ch = holder.children; for(var i=0;i<ch.length;i++){ ch[i].classList.remove('seg-active'); ch[i].setAttribute('aria-pressed','false'); }
        btn.classList.add('seg-active'); btn.setAttribute('aria-pressed','true');
        currentCat = val; renderList();
      };
      holder.appendChild(btn);
    });
  }

  function renderList(){
    var list = byId('quizList'); list.innerHTML='';
    allData.quizzes.forEach(function(q){
      if(currentCat!=='all' && (q.category||'その他')!==currentCat) return;
      var wrap = document.createElement('div'); wrap.className='card';
      var row = document.createElement('div'); row.className='row';
      var h2 = document.createElement('h2'); h2.textContent = q.title; row.appendChild(h2);
      if(q.category){
        var pill = document.createElement('span'); pill.className='pill'; pill.textContent=q.category; row.appendChild(pill);
      }
      wrap.appendChild(row);

      var p = document.createElement('p'); p.className='muted'; p.textContent = q.count + '問 / 更新日: ' + q.updated; wrap.appendChild(p);

      var sliderrow = document.createElement('div'); sliderrow.className='sliderrow';
      var lab = document.createElement('label'); lab.textContent='出題数'; sliderrow.appendChild(lab);
      var range = document.createElement('input'); range.type='range'; range.min='1'; range.max=String(q.count); range.value=String(q.count); range.className='slider';
      var valSpan = document.createElement('span'); valSpan.id='val-'+q.id; valSpan.className='badge'; valSpan.textContent=String(q.count);
      range.oninput=function(){ valSpan.textContent = range.value; };
      sliderrow.appendChild(range); sliderrow.appendChild(valSpan); wrap.appendChild(sliderrow);

      var modeRow = document.createElement('div'); modeRow.style.marginTop='12px'; modeRow.style.display='flex'; modeRow.style.gap='10px';
      var nbtn = document.createElement('button'); nbtn.className='btn ghost'; nbtn.textContent='ノーマル';
      nbtn.onclick=function(){ startQuiz(q.id, range.value, 'normal'); };
      var cbtn = document.createElement('button'); cbtn.className='btn'; cbtn.textContent='チャレンジ';
      cbtn.onclick=function(){ startQuiz(q.id, range.value, 'challenge'); };
      modeRow.appendChild(nbtn); modeRow.appendChild(cbtn); wrap.appendChild(modeRow);

      list.appendChild(wrap);
    });
  }

  function startQuiz(id, count, mode){
    location.href = 'quiz.html?id=' + encodeURIComponent(id) + '&count=' + encodeURIComponent(count) + '&mode=' + encodeURIComponent(mode);
  }

})(); 
