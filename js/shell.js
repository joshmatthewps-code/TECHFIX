/* TechFix shell: bridge between the research game (game.html) and the Desktop simulator (desk.html). */
(function(){
var gf=document.getElementById('gameFrame'),df=document.getElementById('deskFrame'),pg=document.getElementById('pgGame'),pd=document.getElementById('pgDesk');
function IW(){try{return gf.contentWindow}catch(e){return null}}
window.IW=IW;
window.useLevel=function(){};                          /* one problem set only */
window.tfGo=function(p){var g=p==='game';pg.hidden=!g;pd.hidden=g};
window.tfProblem=function(i){
  var w=IW();if(!w||!w.deskCanPlay||!w.deskCanPlay())return;
  try{var k=localStorage.getItem('tf:last');if(k)localStorage.setItem(k+':desk',JSON.stringify(w.deskSeed()))}catch(e){}
  df.src='desk.html#lesson='+(+i);
  pd.hidden=false;pg.hidden=true;
};
function closeDesk(){df.src='about:blank';tfGo('game');
  try{var w=IW();if(w&&w.home){w.home();w.goLessons&&w.goLessons()}}catch(e){}}
window.addEventListener('message',function(e){
  if(e.source!==df.contentWindow)return;var d=e.data;if(!d||typeof d!=='object')return;var w=IW();if(!w)return;
  try{
    if(d.type==='techfix-desktop-ticket'&&d.result&&w.deskRec)w.deskRec(+d.index,d.result);
    else if(d.type==='techfix-desktop-quiz'&&w.deskQuiz)w.deskQuiz(+d.index,+d.right,+d.n);
    else if(d.type==='techfix-desktop-exit')closeDesk();
  }catch(x){console.error('TechFix bridge',x)}
});
gf.src='game.html';
tfGo('game');
})();
