// Путь вычисляется от модуля: поиск и меню работают также на стенде в подпапке.
const siteBase = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const currentPath = decodeURI(location.pathname.slice(siteBase.length)).replace(/\/$/, "") || "/";
for (const link of document.querySelectorAll("header nav a, footer a")) {
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) continue;
  const path = decodeURI(url.pathname.slice(siteBase.length)).replace(/\/$/, "") || "/";
  const exact = currentPath === path;
  if (link.closest(".mainnav")) {
    if (exact || (path !== "/" && currentPath.startsWith(path + "/"))) {
      link.setAttribute("aria-current", "page");
    }
  } else if (exact && link.closest("nav")) {
    link.classList.add("active");
  }
}
const menuButton=document.querySelector('[data-menu]'),menu=document.querySelector('#all-menu');
menuButton?.addEventListener('click',()=>{if(menu.open){menu.close();return}menu.showModal();menuButton.setAttribute('aria-expanded','true');document.documentElement.classList.add('menu-open')});
menu?.querySelector('[data-menu-close]')?.addEventListener('click',()=>menu.close());
menu?.addEventListener('close',()=>{menuButton.setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open');menuButton.focus()});
menu?.addEventListener('click',e=>{const r=menu.getBoundingClientRect();if(e.target===menu&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))menu.close()});
menu?.querySelectorAll('.menu-group').forEach(g=>g.addEventListener('toggle',()=>{if(g.open)menu.querySelectorAll('.menu-group').forEach(other=>{if(other!==g)other.open=false})}));
try{if(localStorage.getItem('sgu-readable')==='1')document.body.classList.add('readable')}catch{}
const readButton=document.querySelector('[data-readable]');readButton?.setAttribute('aria-pressed',String(document.body.classList.contains('readable')));readButton?.addEventListener('click',()=>{const on=document.body.classList.toggle('readable');readButton.setAttribute('aria-pressed',String(on));try{localStorage.setItem('sgu-readable',on?'1':'0')}catch{}});
const note=document.querySelector('.cookie-note');try{if(localStorage.getItem('sgu-storage-notice')==='1')note.hidden=true}catch{}document.querySelector('[data-dismiss]')?.addEventListener('click',()=>{note.hidden=true;try{localStorage.setItem('sgu-storage-notice','1')}catch{}});
const dialog=document.querySelector('#photo-view');document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=b.dataset.photo;img.alt=b.querySelector('img').alt;dialog.showModal()}));dialog?.querySelector('button')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const filter=document.querySelector('[data-row-filter]');if(filter){const rows=[...document.querySelectorAll('[data-filter-item]')];filter.addEventListener('input',()=>{let count=0;const q=filter.value.trim().toLocaleLowerCase('ru');for(const r of rows){r.hidden=!r.textContent.toLocaleLowerCase('ru').includes(q);if(!r.hidden)count++}document.querySelector('[data-filter-count]').textContent=`Найдено: ${count}`})}
const newsYear=document.querySelector('[data-news-year]');if(newsYear)newsYear.addEventListener('change',()=>{location.href=newsYear.value});
const search=document.querySelector('#site-search');if(search){let data=null;let timer;const area=document.querySelector('#search-results');const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));async function run(){const q=search.value.trim().toLocaleLowerCase('ru');if(q.length<2){area.innerHTML='<p class="empty">Введите не менее двух символов.</p>';return}area.innerHTML='<p role="status">Поиск…</p>';try{data??=await fetch(new URL("../assets/search-index.json", import.meta.url)).then(r=>{if(!r.ok)throw Error();return r.json()});if(search.value.trim().toLocaleLowerCase('ru')!==q)return;const parts=q.split(/\s+/),results=data.filter(x=>parts.every(p=>(x.title+' '+x.text).toLocaleLowerCase('ru').includes(p)));area.innerHTML=`<p class="results-count" role="status">Найдено: ${results.length}${results.length>50?' · показаны первые 50':''}</p>`+results.slice(0,50).map(x=>`<article class="search-result"><small>${escape(x.kind)}</small><h2><a href="${escape(siteBase + x.url)}">${escape(x.title)}</a></h2><p>${escape(x.text.slice(0,220))}</p></article>`).join('')+(results.length?'':'<p class="empty">Совпадений нет. Попробуйте другое слово или дату.</p>')}catch{area.innerHTML='<p role="alert">Не удалось загрузить поиск. Попробуйте ещё раз.</p>'}}
search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(run,180)});document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();run()});const q=new URLSearchParams(location.search).get('q');if(q){search.value=q;run()}}
