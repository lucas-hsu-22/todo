const titles=["Brass: Birmingham","Ark Nova","Pandemic Legacy: Season 1","Gloomhaven","Dune: Imperium – Uprising","Dune: Imperium","Twilight Imperium: Fourth Edition","War of the Ring: Second Edition","Terraforming Mars","Star Wars: Rebellion","Spirit Island","Gloomhaven: Jaws of the Lion","Gaia Project","SETI: Search for Extraterrestrial Intelligence","Slay the Spire: The Board Game","Twilight Struggle","The Castles of Burgundy","The Lord of the Rings: Duel for Middle-earth","Through the Ages: A New Story of Civilization","Frosthaven","Great Western Trail","Brass: Lancashire","Eclipse: Second Dawn for the Galaxy","7 Wonders Duel","Nemesis","A Feast for Odin","Scythe","Clank! Legacy: Acquisitions Incorporated","Concordia","Lost Ruins of Arnak","Great Western Trail: Second Edition","Sky Team","Arkham Horror: The Card Game","Root","Orléans","Terra Mystica","Too Many Bones","Wingspan","Barrage","Mage Knight Board Game","Hegemony: Lead Your Class to Victory","Kanban EV","Crokinole","Clank!: Catacombs","Viticulture Essential Edition","The Crew: Mission Deep Sea","Everdell","Heat: Pedal to the Metal","Ticket to Ride Legacy: Legends of the West","Marvel Champions: The Card Game","The Lord of the Rings: Fate of the Fellowship","Harmonies","Food Chain Magnate","Underwater Cities","Cthulhu: Death May Die","Pax Pamir: Second Edition","Age of Innovation","Puerto Rico","On Mars","Pandemic Legacy: Season 0","Blood on the Clocktower","Cascadia","Caverna: The Cave Farmers","Anachrony","Oathsworn: Into the Deepwood","Endeavor: Deep Sea","Agricola","Obsession","Grand Austria Hotel","Blood Rage","Lisboa","The White Castle","Great Western Trail: New Zealand","Pandemic Legacy: Season 2","Voidfall","Power Grid","Tzolk'in: The Mayan Calendar","Sleeping Gods","Clans of Caledonia","Mansions of Madness: Second Edition","The Quacks of Quedlinburg","Bomb Busters","Paladins of the West Kingdom","Le Havre","Android: Netrunner","Agricola (Revised Edition)","The Gallerist","Star Wars: Imperial Assault","Wingspan Asia","Darwin's Journey","Maracaibo","Revive","Final Girl","Mechs vs. Minions","Race for the Galaxy","Kingdom Death: Monster","The Crew: The Quest for Planet Nine","Five Tribes: The Djinns of Naqala","Azul","Clank!: A Deck-Building Adventure"];
const games=titles.map((name,index)=>({name,rank:index+1}));
const deals=[
{name:"Ticket to Ride: Europe",icon:"🚂",type:"ticket",description:"Family strategy · 2–5 players · 30–60 minutes",sale:true,current:39.95,was:62.49,retailers:[{name:"Walmart",price:"$39.95",href:"https://www.walmart.com/c/kp/tickets-to-ride",note:"Sale listing"},{name:"GameStop",price:"Check price",href:"https://www.gamestop.com/search/?q=Ticket%20to%20Ride",note:"Retailer search"}]},
{name:"CATAN (6th Edition)",icon:"🌋",type:"catan",description:"Strategy & trading · 3–4 players · 60–90 minutes",sale:false,current:39.99,was:null,retailers:[{name:"Target",price:"$39.99",href:"https://www.target.com/p/-/A-94081464",note:"In stock when checked"},{name:"Amazon",price:"$39.99",href:"https://www.amazon.com/s?k=CATAN+6th+Edition+board+game",note:"Price tracker listing"}]},
{name:"Azul",icon:"🟦",type:"azul",description:"Tile drafting · 2–4 players · 30–45 minutes",sale:false,current:31.99,was:null,retailers:[{name:"Target",price:"$31.99",href:"https://www.target.com/p/-/A-53287255",note:"Retailer listing"},{name:"Walmart",price:"$31.99",href:"https://www.walmart.com/c/kp/azul-board-game",note:"Online listing"}]}
];

const gameGrid=document.getElementById("game-grid");
const dealList=document.getElementById("deal-list");
const homeSearch=document.getElementById("home-search");
const dealSearch=document.getElementById("deal-search");
const allowedHosts=new Set(["boardgamegeek.com","www.boardgamegeek.com","walmart.com","www.walmart.com","target.com","www.target.com","amazon.com","www.amazon.com","gamestop.com","www.gamestop.com"]);
function makeElement(tag,className,text){
 const node=document.createElement(tag);
 if(className) node.className=className;
 if(text!==undefined&&text!==null) node.textContent=String(text);
 return node;
}
function makeExternalLink(label,urlValue,className){
 let url;
 try{url=new URL(urlValue)}catch{return makeElement("span",className,label)}
 if(url.protocol!=="https:"||!allowedHosts.has(url.hostname)) return makeElement("span",className,label);
 const link=makeElement("a",className,label);
 link.href=url.href;
 link.target="_blank";
 link.rel="noopener noreferrer";
 link.referrerPolicy="no-referrer";
 return link;
}
function renderGames(query=""){
 const value=String(query).slice(0,100);
 const term=value.trim().toLowerCase().replace(/^#/,"");
 const filtered=games.filter(game=>game.name.toLowerCase().includes(term)||String(game.rank)===term);
 const covers=["catan","ticket","azul","wingspan","codenames","pandemic","carcassonne","dixit"];
 const icons=["🎲","♟","🧩","🌟","🃏","🎯","🏆","🪄"];
 const fragment=document.createDocumentFragment();
 if(!filtered.length){
  const empty=makeElement("div","empty",'No games match "'+value+'". Try a title or rank number.');
  fragment.append(empty);
 }else{
  filtered.forEach(game=>{
   const i=(game.rank-1)%covers.length;
   const card=makeElement("article","game-card");
   const cover=makeElement("div","game-cover cover-"+covers[i]);
   const rank=makeElement("span","rank","#"+String(game.rank).padStart(2,"0"));
   const icon=makeElement("span","cover-symbol",icons[i]);
   icon.setAttribute("aria-hidden","true");
   cover.append(rank,icon);
   const info=makeElement("div","game-info");
   info.append(makeElement("h3","",game.name));
   info.append(makeElement("p","","BoardGameGeek community-ranked game"));
   const meta=makeElement("div","meta");
   meta.append(makeElement("span","","Rank #"+game.rank));
   const gameUrl=new URL("https://boardgamegeek.com/search/boardgame");
   gameUrl.searchParams.set("q",game.name);
   meta.append(makeExternalLink("View on BGG ↗",gameUrl.href,"bgg-link"));
   info.append(meta);
   card.append(cover,info);
   fragment.append(card);
  });
 }
 gameGrid.replaceChildren(fragment);
}
function renderDeals(query=""){
 const value=String(query).slice(0,100);
 const term=value.trim().toLowerCase();
 const filtered=deals.filter(deal=>[deal.name,deal.description,...deal.retailers.map(retailer=>retailer.name)].join(" ").toLowerCase().includes(term));
 const fragment=document.createDocumentFragment();
 if(!filtered.length){
  fragment.append(makeElement("div","empty",'No deals match "'+value+'". Try another game or retailer.'));
 }else{
  filtered.forEach(deal=>{
   const card=makeElement("article","deal-card");
   const icon=makeElement("div","deal-icon "+deal.type,deal.icon);
   icon.setAttribute("aria-hidden","true");
   const details=makeElement("div","");
   const nameRow=makeElement("div","deal-name");
   nameRow.append(makeElement("h3","",deal.name));
   if(deal.sale===true) nameRow.append(makeElement("span","badge","Sale"));
   details.append(nameRow,makeElement("div","deal-details",deal.description));
   const retailerRow=makeElement("div","retailer-row");
   deal.retailers.forEach(retailer=>{
    const link=makeExternalLink(retailer.name+" "+retailer.price,retailer.href,"retailer");
    link.title=retailer.note;
    retailerRow.append(link);
   });
   details.append(retailerRow);
   const priceBlock=makeElement("div","price-block");
   const current=Number(deal.current);
   priceBlock.append(makeElement("div","price",Number.isFinite(current)?"$"+current.toFixed(2):"Price unavailable"));
   const was=Number(deal.was);
   if(deal.was!==null&&Number.isFinite(was)&&Number.isFinite(current)){
    priceBlock.append(makeElement("div","was","Was $"+was.toFixed(2)));
    priceBlock.append(makeElement("div","save","Save $"+(was-current).toFixed(2)));
   }else{
    priceBlock.append(makeElement("div","deal-details","Price example"));
   }
   if(deal.retailers.length) priceBlock.append(makeExternalLink("View listing ↗",deal.retailers[0].href,"buy-btn"));
   card.append(icon,details,priceBlock);
   fragment.append(card);
  });
 }
 dealList.replaceChildren(fragment);
}
function showPage(page){
 const isHome=page==="home";
 document.getElementById("home-page").hidden=!isHome;
 document.getElementById("deals-page").hidden=isHome;
 document.querySelectorAll(".nav-button").forEach(button=>button.classList.toggle("active",button.dataset.page===page));
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-button").forEach(button=>button.addEventListener("click",()=>showPage(button.dataset.page)));
document.getElementById("band-deals-link").addEventListener("click",()=>showPage("deals"));
document.getElementById("home-search-form").addEventListener("submit",event=>{event.preventDefault();renderGames(homeSearch.value);document.querySelector(".section-head").scrollIntoView({behavior:"smooth",block:"start"})});
document.getElementById("deal-search-form").addEventListener("submit",event=>{event.preventDefault();renderDeals(dealSearch.value)});
homeSearch.addEventListener("input",()=>renderGames(homeSearch.value));
dealSearch.addEventListener("input",()=>renderDeals(dealSearch.value));
renderGames();
renderDeals();
