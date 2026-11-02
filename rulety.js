/* ===== ROULETTE: suroviny upravíte tady (6 položek na kolo, krátké názvy) ===== */
const TIERY={
 klasik:{nazev:"Klasik",cena:249,kola:[
  ["Základ",["Brambory","Knedlík","Rýže","Těstoviny","Bulgur","Pečivo"]],
  ["Hlavní surovina",["Kuřecí","Hovězí","Vepřové","Losos","Tofu","Houby"]],
  ["Omáčka",["Smetanová","Rajčatová","Houbová","Bylinkové máslo","Pivní","Česneková"]]]},
 odvazny:{nazev:"Odvážný",cena:349,kola:[
  ["Základ",["Černá rýže","Gnocchi","Pohanka","Batáty","Ramen","Polenta"]],
  ["Hlavní surovina",["Kachní prsa","Jehněčí","Chobotnice","Králík","Tuňák","Halloumi"]],
  ["Omáčka",["Chilli med","Miso máslo","Granátové jablko","Wasabi smetana","Tamarind","Portské"]]]},
 extrem:{nazev:"Extrém",cena:499,kola:[
  ["Základ",["Mořské řasy","Kimchi","Sépiové těstoviny","Hmyzí mouka","Natto","Černý česnek"]],
  ["Hlavní surovina",["Pečení cvrčci","Žabí stehýnka","Hovězí jazyk","Krokodýl","Hlemýždi","Morek"]],
  ["Omáčka",["Carolina Reaper","Smradlavý sýr","Čokoláda a zelí","Lékořice a chilli","Rybí omáčka","Ghost pepper"]]]}
};
const BARVY=["#7a1426","#1b1613"],TAU=Math.PI*2;
const box=document.getElementById("kola"),vys=document.getElementById("vysledek"),btn=document.getElementById("toc");
const slabe=matchMedia("(prefers-reduced-motion: reduce)").matches;
let tier="klasik",platna=[],uhly=[];

function kresli(c,p,a){
 const x=c.getContext("2d"),r=c.width/2,s=TAU/p.length;
 x.clearRect(0,0,c.width,c.height);
 p.forEach((t,i)=>{
  x.beginPath();x.moveTo(r,r);x.arc(r,r,r-8,a+i*s,a+(i+1)*s);x.closePath();
  x.fillStyle=BARVY[i%2];x.fill();x.strokeStyle="#d9a93f";x.lineWidth=2;x.stroke();
  x.save();x.translate(r,r);x.rotate(a+(i+.5)*s);
  x.fillStyle="#f4ecd8";x.font="600 17px 'Source Sans 3',sans-serif";x.textAlign="right";x.textBaseline="middle";
  x.fillText(t,r-22,0,105);x.restore();
 });
 x.beginPath();x.arc(r,r,24,0,TAU);x.fillStyle="#d9a93f";x.fill();
}
function sestav(){
 box.innerHTML="";platna=[];uhly=[];vys.hidden=true;
 TIERY[tier].kola.forEach(([nazev,p],i)=>{
  const f=document.createElement("figure"),c=document.createElement("canvas");
  f.className="kolo";c.width=c.height=320;
  c.setAttribute("role","img");c.setAttribute("aria-label","Ruleta: "+nazev);
  f.innerHTML="<figcaption>"+nazev+'</figcaption><div class="ukazatel"></div>';
  f.appendChild(c);box.appendChild(f);platna.push(c);uhly.push(0);kresli(c,p,0);
 });
}
function toc(i,cil,delka){
 return new Promise(ok=>{
  const p=TIERY[tier].kola[i][1],s=TAU/p.length,z=uhly[i];
  const konec=-Math.PI/2-(cil+.5)*s;
  const d=(((konec-z)%TAU)+TAU)%TAU+TAU*(4+i);
  const t0=performance.now();
  (function f(t){
   const k=Math.min((t-t0)/delka,1),e=1-Math.pow(1-k,3);
   uhly[i]=z+d*e;kresli(platna[i],p,uhly[i]);
   k<1?requestAnimationFrame(f):ok();
  })(t0);
 });
}
btn.addEventListener("click",async()=>{
 btn.disabled=true;vys.hidden=true;
 const T=TIERY[tier],volba=T.kola.map(([,p])=>Math.floor(Math.random()*p.length));
 await Promise.all(volba.map((v,i)=>toc(i,v,slabe?300:2600+i*800)));
 const n=volba.map((v,i)=>T.kola[i][1][v]);
 vys.innerHTML='<p>Padlo vám:</p><p class="jidlo">'+n.join(" + ")+'</p><p>Cena: <strong>'+T.cena+' Kč</strong> ('+T.nazev+')</p><a class="tlacitko" href="kontakt.html#rezervace">Rezervovat stůl a ochutnat</a>';
 vys.hidden=false;btn.disabled=false;btn.textContent="Zatočit znovu";
});
document.querySelectorAll(".zalozky button").forEach(b=>b.addEventListener("click",()=>{
 tier=b.dataset.tier;
 document.querySelectorAll(".zalozky button").forEach(x=>x.setAttribute("aria-pressed",x===b));
 document.getElementById("popis").textContent=b.dataset.popis;
 btn.textContent="Roztočit ruletu";sestav();
}));
const start=document.querySelector('.zalozky button[data-tier="'+location.hash.slice(1)+'"]')||document.querySelector(".zalozky button");
start.click();
