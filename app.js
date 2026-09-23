"use strict";
/* ============================================================
   0. UTILITÁRIOS
   ============================================================ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl=n=>"R$ "+Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const brlShort=n=>{n=Number(n||0);
  if(n>=1e6)return "R$ "+(n/1e6).toLocaleString("pt-BR",{maximumFractionDigits:1})+" mi";
  if(n>=1e3)return "R$ "+(n/1e3).toLocaleString("pt-BR",{maximumFractionDigits:1})+" mil";
  return brl(n);};
const num=n=>Number(n||0).toLocaleString("pt-BR");
const uid=p=>p+"_"+Math.random().toString(36).slice(2,9);
const today=()=>new Date();
const dISO=d=>new Date(d).toISOString().slice(0,10);
const dBR=d=>{if(!d)return "—";const x=new Date(d);return x.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"})};
const dBRlong=d=>new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"});
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const daysBetween=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const initials=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();

/* PRNG determinístico — mesma semente, mesma imagem */
function rng(seed){let h=1779033703^String(seed).length;
  for(let i=0;i<String(seed).length;i++){h=Math.imul(h^String(seed).charCodeAt(i),3432918353);h=h<<13|h>>>19}
  let a=h>>>0;
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}

/* ============================================================
   1. ÍCONES
   ============================================================ */
const I={
  logo:`<svg class="logo-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="1.5" y="3" width="21" height="12.5" rx="2" stroke="#7B01F7" stroke-width="2"/><path d="M8 15.5v5M16 15.5v5M6 21h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M6 7.5h7" stroke="#7B01F7" stroke-width="2" stroke-linecap="round"/></svg>`,
  cart:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.6l2.2 11.2a2 2 0 002 1.6h7.9a2 2 0 002-1.6L21 7H5.4"/></svg>`,
  check:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  x:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  arrow:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  burger:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  grid:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  megaphone:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z"/><path d="M16 9a4 4 0 010 6M19 6.5a8 8 0 010 11"/></svg>`,
  upload:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 9l5-5 5 5M12 4v12"/></svg>`,
  receipt:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z"/><path d="M9 8h6M9 12h6"/></svg>`,
  gear:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 14a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V20a2 2 0 11-4 0v-.1A1.6 1.6 0 007 18.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.1-2.7H3a2 2 0 110-4h.1A1.6 1.6 0 004.2 7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 002.7-1.1V3a2 2 0 114 0v.1A1.6 1.6 0 0018.4 4.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 001.1 2.7H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></svg>`,
  out:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>`,
  users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.9"/></svg>`,
  building:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 21h18M5 21V4a1 1 0 011-1h7a1 1 0 011 1v17M14 10h4a1 1 0 011 1v10"/><path d="M8 7h3M8 11h3M8 15h3"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.6C7.4 20.4 4 17 4 12V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>`,
  chart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 21h18"/><rect x="5" y="11" width="3.4" height="7" rx="1"/><rect x="10.3" y="6" width="3.4" height="12" rx="1"/><rect x="15.6" y="14" width="3.4" height="4" rx="1"/></svg>`,
  money:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>`,
  img:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>`,
  play:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5v-7z"/></svg>`,
  trash:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>`,
  edit:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
  plus:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  google:`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 01-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5z"/><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0012 23.5z"/><path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 010-4.4v-3H1.8a11.5 11.5 0 000 10.4l3.8-3z"/><path fill="#EA4335" d="M12 5.1c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 001.8 6.8l3.8 3C6.5 7.1 9 5.1 12 5.1z"/></svg>`,
  bell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>`,
  home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/></svg>`,
  zoomIn:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>`,
  zoomOut:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 12h12"/></svg>`,
  target:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-linecap="round"/></svg>`,
  eye:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.8"/></svg>`,
  instagram:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  linkedin:`<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21h-4z"/></svg>`,
  facebook:`<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z"/></svg>`,
  whats:`<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.3A10 10 0 1012 2zm0 2a8 8 0 016.3 12.9l.7 2.6-2.7-.7A8 8 0 1112 4zm-3.3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.8-.4-1.4-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.3-.1-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5z"/></svg>`,
};

/* ============================================================
   2. ARTE GERADA — cenas noturnas de mídia exterior em SVG
   Todas as imagens do produto são desenhadas em SVG (sem
   dependência de arquivos externos).
   ============================================================ */
const PANEL={ /* área do painel, em % da cena, usada no mockup de veiculação */
  outdoor:{x:16,y:26,w:68,h:36},
  dooh:{x:22,y:16,w:56,h:46},
  shopping:{x:38,y:18,w:24,h:52},
  frontlight:{x:12,y:10,w:44,h:56},
  mobiliario:{x:56,y:34,w:20,h:40}
};
function scene(seed,tipo,opts={}){
  const r=rng(seed+"|"+tipo),W=800,H=500;
  const g=[];
  const skyTop=["#101A2E","#141026","#0E1B24","#181225"][Math.floor(r()*4)];
  const skyBot=["#2A1E3A","#1E2A3A","#33202B","#1A2434"][Math.floor(r()*4)];
  const id="g"+Math.floor(r()*1e6);
  g.push(`<defs>
    <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05060A"/><stop offset=".45" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient>
    <linearGradient id="road${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16161B"/><stop offset="1" stop-color="#0A0A0C"/></linearGradient>
    <radialGradient id="glow${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
    <linearGradient id="scr${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E7BFF"/><stop offset=".5" stop-color="#8A3BFF"/><stop offset="1" stop-color="#FF3D8B"/></linearGradient>
  </defs>`);
  g.push(`<rect width="${W}" height="${H}" fill="url(#sky${id})"/>`);
  for(let i=0;i<46;i++){const x=r()*W,y=r()*H*.5,o=(r()*.5+.15).toFixed(2);g.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(r()*1.1+.3).toFixed(1)}" fill="#fff" opacity="${o}"/>`)}
  /* skyline distante */
  let x=-20;
  while(x<W+20){
    const w=40+r()*80,h=90+r()*180,top=H*.62-h;
    g.push(`<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${w.toFixed(0)}" height="${(h+40).toFixed(0)}" fill="#0C0E15" opacity=".95"/>`);
    for(let wy=top+14;wy<H*.6;wy+=16){
      for(let wx=x+8;wx<x+w-8;wx+=14){
        if(r()<.36){const c=r()<.22?"#FFD98A":"#7FA6D8";g.push(`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="8" fill="${c}" opacity="${(r()*.55+.25).toFixed(2)}"/>`)}
      }
    }
    x+=w+(4+r()*16);
  }
  /* rua */
  g.push(`<rect x="0" y="${H*.72}" width="${W}" height="${H*.28}" fill="url(#road${id})"/>`);
  g.push(`<path d="M0 ${H*.72}H${W}" stroke="#2A2A33" stroke-width="2"/>`);
  for(let i=0;i<7;i++){const ly=H*.78+i*14,lw=60+i*34,lx=r()*W;
    g.push(`<rect x="${lx.toFixed(0)}" y="${ly.toFixed(0)}" width="${lw}" height="3" rx="1.5" fill="${r()<.5?"#FF6B5C":"#FFE2A8"}" opacity="${(.14+r()*.3).toFixed(2)}"/>`)}

  const p=PANEL[tipo]||PANEL.outdoor, px=W*p.x/100, py=H*p.y/100, pw=W*p.w/100, ph=H*p.h/100;

  if(tipo==="shopping"){
    /* interior de shopping */
    g.push(`<rect width="${W}" height="${H}" fill="#0B0D12"/>`);
    g.push(`<rect x="0" y="${H*.74}" width="${W}" height="${H*.26}" fill="#15161C"/>`);
    for(let i=0;i<9;i++)g.push(`<rect x="${i*92}" y="${H*.74}" width="2" height="${H*.26}" fill="#1D1F27"/>`);
    g.push(`<rect x="0" y="0" width="${W}" height="${H*.2}" fill="#101219"/>`);
    for(let i=0;i<6;i++)g.push(`<ellipse cx="${70+i*135}" cy="${H*.2}" rx="70" ry="34" fill="url(#glow${id})"/>`);
    [80,200,600,720].forEach(bx=>{g.push(`<rect x="${bx}" y="${H*.2}" width="86" height="${H*.54}" fill="#14161D" stroke="#1E2029"/>`);
      g.push(`<rect x="${bx+10}" y="${H*.3}" width="66" height="26" rx="3" fill="#2A2D38"/>`)});
    for(let i=0;i<10;i++){const hx=40+r()*720,hy=H*.6+r()*60,s=.5+r()*.5;
      g.push(`<g opacity=".55" transform="translate(${hx.toFixed(0)},${hy.toFixed(0)}) scale(${s.toFixed(2)})"><circle cx="0" cy="-26" r="8" fill="#191C24"/><path d="M-9 -18h18v26h-18z" fill="#191C24"/></g>`)}
  }
  if(tipo==="outdoor"){
    g.push(`<rect x="${px+pw*.22}" y="${py+ph}" width="12" height="${H-py-ph}" fill="#17171C"/>`);
    g.push(`<rect x="${px+pw*.74}" y="${py+ph}" width="12" height="${H-py-ph}" fill="#17171C"/>`);
    g.push(`<rect x="${px-10}" y="${py-10}" width="${pw+20}" height="${ph+20}" rx="4" fill="#1B1B21" stroke="#2C2C34"/>`);
    for(let i=0;i<4;i++){const lx=px+pw*(.14+i*.24);
      g.push(`<rect x="${lx}" y="${py+ph+8}" width="26" height="7" rx="3" fill="#2E2E37"/>`);
      g.push(`<ellipse cx="${lx+13}" cy="${py+ph}" rx="46" ry="34" fill="url(#glow${id})" opacity=".8"/>`)}
  }
  if(tipo==="dooh"){
    g.push(`<rect x="${px+pw/2-9}" y="${py+ph}" width="18" height="${H-py-ph}" fill="#15151A"/>`);
    g.push(`<rect x="${px-8}" y="${py-8}" width="${pw+16}" height="${ph+16}" rx="8" fill="#101015" stroke="#2C2C34" stroke-width="2"/>`);
    g.push(`<ellipse cx="${px+pw/2}" cy="${py+ph/2}" rx="${pw*.9}" ry="${ph*.85}" fill="#3B5BFF" opacity=".12"/>`);
  }
  if(tipo==="frontlight"){
    g.push(`<rect x="0" y="0" width="${W*.72}" height="${H*.86}" fill="#0E1016"/>`);
    for(let wy=40;wy<H*.84;wy+=34){for(let wx=W*.6;wx<W*.71;wx+=22){
      if(r()<.5)g.push(`<rect x="${wx}" y="${wy}" width="12" height="18" fill="#FFD98A" opacity="${(r()*.5+.2).toFixed(2)}"/>`)}}
    g.push(`<rect x="${px-6}" y="${py-6}" width="${pw+12}" height="${ph+12}" fill="#15151B" stroke="#2C2C34"/>`);
    for(let i=0;i<5;i++)g.push(`<ellipse cx="${px+pw*(.1+i*.2)}" cy="${py+ph+16}" rx="40" ry="46" fill="url(#glow${id})"/>`);
  }
  if(tipo==="mobiliario"){
    g.push(`<rect x="${W*.18}" y="${H*.36}" width="${W*.5}" height="10" rx="3" fill="#1B1B21"/>`);
    g.push(`<rect x="${W*.19}" y="${H*.36}" width="8" height="${H*.44}" fill="#1B1B21"/>`);
    g.push(`<rect x="${W*.18}" y="${H*.46}" width="${W*.34}" height="${H*.3}" fill="#101318" opacity=".85"/>`);
    g.push(`<rect x="${px-7}" y="${py-7}" width="${pw+14}" height="${ph+14}" rx="6" fill="#141419" stroke="#2C2C34"/>`);
    g.push(`<rect x="${W*.2}" y="${H*.66}" width="${W*.3}" height="8" rx="3" fill="#20222A"/>`);
  }
  /* superfície do painel */
  const art=opts.art;
  if(art){
    g.push(`<image href="${art}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>`);
  }else{
    const digital=tipo==="dooh"||tipo==="shopping"||(tipo==="mobiliario"&&r()<.6);
    if(digital){
      g.push(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="url(#scr${id})" opacity=".82"/>`);
      for(let i=0;i<5;i++)g.push(`<rect x="${px}" y="${(py+ph*(.1+i*.19)).toFixed(0)}" width="${pw}" height="${(ph*.04).toFixed(0)}" fill="#fff" opacity=".07"/>`);
      g.push(`<rect x="${px+pw*.1}" y="${py+ph*.62}" width="${pw*.5}" height="${ph*.09}" rx="3" fill="#fff" opacity=".5"/>`);
      g.push(`<rect x="${px+pw*.1}" y="${py+ph*.24}" width="${pw*.66}" height="${ph*.22}" rx="4" fill="#fff" opacity=".82"/>`);
    }else{
      const base=["#F2F2F0","#E8E4DC","#EDEFF2"][Math.floor(r()*3)];
      g.push(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${base}"/>`);
      g.push(`<rect x="${px}" y="${py}" width="${pw*.36}" height="${ph}" fill="#1F2430" opacity=".9"/>`);
      g.push(`<rect x="${px+pw*.42}" y="${py+ph*.26}" width="${pw*.46}" height="${ph*.16}" rx="3" fill="#20242E"/>`);
      g.push(`<rect x="${px+pw*.42}" y="${py+ph*.5}" width="${pw*.3}" height="${ph*.1}" rx="3" fill="#20242E" opacity=".55"/>`);
      g.push(`<rect x="${px+pw*.06}" y="${py+ph*.4}" width="${pw*.22}" height="${ph*.2}" rx="3" fill="#7B01F7" opacity=".9"/>`);
    }
  }
  g.push(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="none" stroke="#000" stroke-opacity=".25"/>`);
  g.push(`<rect width="${W}" height="${H}" fill="url(#vig${id})"/>`);
  g.push(`<defs><radialGradient id="vig${id}" cx=".5" cy=".45" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>`);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(opts.alt||"Imagem do ponto de mídia")}">${g.join("")}</svg>`;
}
const _sceneCache=new Map();
function sceneURI(seed,tipo,opts){
  const k=seed+"|"+tipo+"|"+(opts&&opts.art?"art":"");
  if(_sceneCache.has(k))return _sceneCache.get(k);
  const v="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(scene(seed,tipo,opts));
  if(_sceneCache.size<200)_sceneCache.set(k,v);
  return v;
}

/* ============================================================
   3. DADOS SEMENTE
   ============================================================ */
const TIPOS={
  outdoor:{nome:"Outdoor Estático",curto:"Outdoor"},
  dooh:{nome:"Painel Digital (DOOH)",curto:"Painel Digital"},
  shopping:{nome:"Mídia em Shopping",curto:"Shopping"},
  frontlight:{nome:"Front Light / Empena",curto:"Front Light"},
  mobiliario:{nome:"Mobiliário Urbano",curto:"Mobiliário"}
};
const PRODUTOS=[
  {id:"outdoor",titulo:"Outdoor Estático",
   texto:"O formato clássico da mídia exterior. Painéis impressos de grande formato em avenidas de alto fluxo, garantindo presença constante da sua marca no trajeto diário do consumidor.",
   bullets:["Formato 9x3m","Impressão em lona","Exposição por bissemana"]},
  {id:"dooh",titulo:"Painel Digital (DOOH)",
   texto:"Telas de LED de alta resolução que exibem sua campanha em rotação programada. Permite trocar a arte quando quiser e veicular vídeos com movimento e som.",
   bullets:["Vídeo em MP4","Rotação programada","Troca de arte remota"]},
  {id:"shopping",titulo:"Mídia em Shopping",
   texto:"Telas posicionadas em corredores, praças de alimentação e acessos de shoppings, alcançando um público em momento de consumo.",
   bullets:["Público qualificado","Ambiente climatizado","Alta frequência"]},
  {id:"frontlight",titulo:"Front Light / Empena",
   texto:"Painéis iluminados de grandes dimensões aplicados em fachadas e empenas de edifícios, com visibilidade a longa distância e impacto 24 horas por dia.",
   bullets:["Iluminação noturna","Grande escala","Ponto icônico"]},
  {id:"mobiliario",titulo:"Mobiliário Urbano",
   texto:"Abrigos de ônibus, relógios e totens digitais espalhados pela cidade, com alcance capilar e proximidade do pedestre.",
   bullets:["Altura do olhar","Cobertura capilar","Formato estático ou digital"]}
];
const ST_CAMP={
  preparacao:{label:"Em preparação",cls:"badge-mute"},
  analise:{label:"Em análise",cls:"badge-warn"},
  aprovada:{label:"Aprovada",cls:"badge-info"},
  exibicao:{label:"Em exibição",cls:"badge-ok"},
  finalizada:{label:"Finalizada",cls:""}
};
const ST_ARQ={
  pendente:{label:"Pendente",cls:"badge-mute"},
  analise:{label:"Em análise",cls:"badge-warn"},
  aprovada:{label:"Aprovada",cls:"badge-ok"},
  reprovada:{label:"Reprovada",cls:"badge-danger"}
};
const ST_PONTO={
  disponivel:{label:"Disponível",cls:"badge-ok"},
  ocupado:{label:"Ocupado",cls:"badge-warn"},
  manutencao:{label:"Em manutenção",cls:"badge-mute"}
};

/* ============================================================
   4. ESTADO DA APLICAÇÃO — agora vem de uma API de verdade
   ============================================================ */
const API_BASE="https://outdoorhub-api.onrender.com";
const TOKEN_KEY="outdoorhub.token";
const CART_KEY="outdoorhub.carrinho";
const UI_KEY="outdoorhub.ui";
let S=null;

/* ---------- cliente HTTP ---------- */
async function api(path,opts){
  opts=opts||{};
  const headers={"Content-Type":"application/json",...(opts.headers||{})};
  if(S&&S.token)headers.Authorization="Bearer "+S.token;
  let res;
  try{
    res=await fetch(API_BASE+path,{
      method:opts.method||"GET",headers,
      body:opts.body!==undefined?JSON.stringify(opts.body):undefined,
    });
  }catch(e){
    const err=new Error("Não deu para falar com o servidor. Se ele ficou alguns minutos sem uso, a primeira chamada pode demorar até 1 minuto para acordar — tenta de novo em instantes.");
    err.rede=true;throw err;
  }
  let body=null;
  try{body=await res.json()}catch(e){}
  if(!res.ok){
    const err=new Error((body&&body.erro)||("O servidor respondeu com um erro ("+res.status+")."));
    err.status=res.status;throw err;
  }
  return body;
}

/* ---------- tradução entre os nomes de campo da API e os do front ---------- */
function normFoto(f){return{id:f.id,data:f.dados,seed:null,ordem:f.ordem,area:f.area||null}}
function normPonto(p){
  return{
    id:p.id,nome:p.nome,cidade:p.cidade,empresaId:p.empresaId,tipo:p.tipo,
    lat:Number(p.latitude),lng:Number(p.longitude),endereco:p.endereco,publico:p.publico,
    alcance:p.alcance,valor:Number(p.valor),status:p.status,formatos:p.formatos&&p.formatos.length?p.formatos:["PNG"],
    fotos:(p.fotos||[]).map(normFoto),fotoPrincipal:p.fotoPrincipalId||null,criadoEm:p.criadoEm
  };
}
function normEmpresa(e){return{id:e.id,nome:e.nome,cnpj:e.cnpj,cidade:e.cidade,email:e.email,tel:e.telefone,status:e.status,criadoEm:e.criadoEm}}
function normUsuario(u){return{id:u.id,nome:u.nome,email:u.email,papel:u.papel,empresaId:u.empresaId,empresa:u.empresa,cnpj:u.cnpj,tel:u.telefone,status:u.status,criadoEm:u.criadoEm}}
function normArquivo(a){return{id:a.id,nome:a.nome,tipo:a.tipo,data:a.dados,status:a.status,motivo:a.motivo,enviadoEm:a.enviadoEm,avaliadoEm:a.avaliadoEm}}
function normCampanha(c){return{id:c.id,userId:c.userId,pontoId:c.pontoId,pedidoId:c.pedidoId,nome:c.nome,inicio:c.inicio,fim:c.fim,status:c.status,
  usuarioNome:c.usuarioNome||null,usuarioEmpresa:c.usuarioEmpresa||null,valor:c.valor!=null?Number(c.valor):null,
  arquivos:(c.arquivos||[]).map(normArquivo),criadoEm:c.criadoEm}}
function normPedido(p){return{id:p.id,userId:p.usuarioId,total:Number(p.total),status:p.status,pagamento:p.pagamento||{},dados:p.dados||{},itens:(p.itens||[]).map(i=>({pontoId:i.pontoId,valor:Number(i.valor),inicio:i.inicio,fim:i.fim})),criadoEm:p.criadoEm}}

/* ---------- persistência local — só o essencial (token, carrinho, preferência de UI) ---------- */
function salvarToken(t){S.token=t;try{t?localStorage.setItem(TOKEN_KEY,t):localStorage.removeItem(TOKEN_KEY)}catch(e){}}
function carregarToken(){try{return localStorage.getItem(TOKEN_KEY)||null}catch(e){return null}}
function salvarCarrinho(){try{localStorage.setItem(CART_KEY,JSON.stringify(S.carrinho))}catch(e){}}
function carregarCarrinho(){try{const r=localStorage.getItem(CART_KEY);return r?JSON.parse(r):[]}catch(e){return[]}}
function save(){ /* preferências de UI, leves — o resto dos dados vive no servidor agora */
  try{localStorage.setItem(UI_KEY,JSON.stringify(S.ui))}catch(e){}
  salvarCarrinho();
}
function carregarUI(){try{const r=localStorage.getItem(UI_KEY);return r?JSON.parse(r):{sideCollapsed:false}}catch(e){return{sideCollapsed:false}}}

function estadoVazio(){
  return{token:null,usuario:null,users:[],empresas:[],pontos:[],campanhas:[],pedidos:[],carrinho:carregarCarrinho(),ui:carregarUI(),
    _adminCarregado:false,_empresaCarregado:false,_clienteCarregado:false};
}

/* seletores */
const me=()=>S.usuario;
const papel=()=>me()?me().papel:null;
const ponto=id=>S.pontos.find(p=>p.id===id);
const empresa=id=>S.empresas.find(e=>e.id===id);
const usuario=id=>S.users.find(u=>u.id===id);
const campanha=id=>S.campanhas.find(c=>c.id===id);
const empresaDoUsuario=()=>{const u=me();return u&&u.empresaId?empresa(u.empresaId):null};
/* usa o próprio empresaId do usuário contra a lista global de pontos —
   não depende de S.empresas conter a empresa dele. */
const meusPontos=()=>{const u=me();return u&&u.empresaId?S.pontos.filter(p=>p.empresaId===u.empresaId):[]};
const arquivoAtual=c=>c.arquivos.length?c.arquivos[c.arquivos.length-1]:null;
const fotoPrincipal=p=>p.fotos.find(f=>f.id===p.fotoPrincipal)||p.fotos[0]||null;
const fotoSrc=(f,tipo)=>f?(f.data||sceneURI(f.seed||"x",tipo)):sceneURI("vazio",tipo);
const capaPonto=p=>fotoSrc(fotoPrincipal(p),p.tipo);
const pontosDisponiveis=()=>S.pontos.filter(p=>p.status!=="manutencao");
const receitaTotal=()=>S.pedidos.reduce((a,p)=>a+p.total,0);
const campanhasDoPonto=id=>S.campanhas.filter(c=>c.pontoId===id);
const campanhaVeiculando=id=>S.campanhas.find(c=>c.pontoId===id&&c.status==="exibicao"&&arquivoAtual(c)&&arquivoAtual(c).status==="aprovada");
const pendentesAprovacao=()=>S.campanhas.flatMap(c=>c.arquivos.filter(a=>a.status==="analise"||a.status==="pendente").map(a=>({c,a})));
const empresasPendentes=()=>S.empresas.filter(e=>e.status==="pendente");
const campanhasVencendo=()=>S.campanhas.filter(c=>c.status==="exibicao"&&daysBetween(today(),c.fim)<=5&&daysBetween(today(),c.fim)>=0);

/* ============================================================
   4b. CARREGADORES — buscam dados reais da API e populam S
   ============================================================ */
/* pontos e empresas ativas são públicos e usados em quase toda página —
   sempre recarregados no boot e depois de qualquer mutação relevante. */
async function carregarPontos(){
  const r=await api("/pontos");
  S.pontos=(r.pontos||[]).map(normPonto);
}
async function carregarEmpresasPublicas(){
  const r=await api("/empresas");
  S.empresas=(r.empresas||[]).map(normEmpresa);
}
async function carregarPontoUnico(id){
  const r=await api("/pontos/"+id);
  const np=normPonto(r.ponto);
  const i=S.pontos.findIndex(p=>p.id===id);
  if(i>=0)S.pontos[i]=np;else S.pontos.push(np);
  return np;
}
/* dados do painel admin — todos os registros da plataforma. Buscados juntos
   e cacheados (S._adminCarregado) para não repetir a cada clique dentro do
   próprio painel; invalidados manualmente após mutações administrativas. */
async function carregarDadosAdmin(force){
  if(S._adminCarregado&&!force)return;
  const [rUsers,rEmp,rCamp,rPed]=await Promise.all([
    api("/usuarios"), api("/empresas"), api("/campanhas"), api("/pedidos")
  ]);
  S.users=(rUsers.usuarios||[]).map(normUsuario);
  S.empresas=(rEmp.empresas||[]).map(normEmpresa);
  S.campanhas=(rCamp.campanhas||[]).map(normCampanha);
  S.pedidos=(rPed.pedidos||[]).map(normPedido);
  S._adminCarregado=true;
}
/* campanhas de uma empresa parceira nos seus próprios pontos */
async function carregarDadosEmpresa(force){
  if(S._empresaCarregado&&!force)return;
  const r=await api("/campanhas");
  S.campanhas=(r.campanhas||[]).map(normCampanha);
  S._empresaCarregado=true;
}
/* campanhas + pedidos do próprio cliente */
async function carregarDadosCliente(force){
  if(S._clienteCarregado&&!force)return;
  const [rCamp,rPed]=await Promise.all([api("/campanhas"), api("/pedidos")]);
  S.campanhas=(rCamp.campanhas||[]).map(normCampanha);
  S.pedidos=(rPed.pedidos||[]).map(normPedido);
  S._clienteCarregado=true;
}
function invalidarCacheDoPapel(){S._adminCarregado=false;S._empresaCarregado=false;S._clienteCarregado=false}

/* ============================================================
   5. FEEDBACK (toasts) E MODAIS
   ============================================================ */
function toast(msg,tipo){
  const el=document.createElement("div");
  el.className="toast"+(tipo?" "+tipo:"");
  el.innerHTML=`<span style="color:${tipo==="err"?"var(--danger)":tipo==="info"?"var(--info)":"var(--accent-text)"};flex:none;margin-top:1px">${tipo==="err"?I.x:I.check}</span><span>${esc(msg)}</span>`;
  $("#toasts").appendChild(el);
  setTimeout(()=>{el.style.transition="opacity .3s,transform .3s";el.style.opacity="0";el.style.transform="translateX(20px)";setTimeout(()=>el.remove(),320)},3600);
}
let modalCloseCb=null;
function openModal(html,size){
  $("#modal-root").innerHTML=`<div class="modal-backdrop" data-backdrop><div class="modal ${size||""}" role="dialog" aria-modal="true">
    <button class="modal-close" data-close aria-label="Fechar">${I.x}</button>${html}</div></div>`;
  document.body.style.overflow="hidden";
  const first=$("#modal-root input,#modal-root button:not([data-close])");
  if(first&&window.innerWidth>760)setTimeout(()=>first.focus(),60);
}
function closeModal(){
  $("#modal-root").innerHTML="";document.body.style.overflow="";
  if(modalCloseCb){const f=modalCloseCb;modalCloseCb=null;f()}
}
document.addEventListener("click",e=>{
  if(e.target.closest("[data-close]")||e.target.hasAttribute("data-backdrop"))closeModal();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeDropdown()}});

/* ============================================================
   6. ROTEADOR E ESTRUTURA DO SITE
   ============================================================ */
const NAV=[["#/","Início"],["#/produtos","Produtos"],["#/pontos","Pontos Disponíveis"],["#/parceiras","Empresas Parceiras"],["#/contato","Contato"]];
const MENUS={
  cliente:[["#/painel","Meu Painel","grid"],["#/alugados","Meus Pontos Alugados","pin"],["#/campanhas","Minhas Campanhas","megaphone"],["#/arquivos","Envio de Arquivos","upload"],["#/pedidos","Meus Pedidos","receipt"],["#/config","Configurações","gear"]],
  empresa:[["#/empresa","Painel da Empresa","grid"],["#/empresa/pontos","Meus Pontos Cadastrados","pin"],["#/empresa/campanhas","Campanhas nos Meus Pontos","megaphone"],["#/empresa/artes","Aprovação de Artes","shield"],["#/empresa/financeiro","Financeiro","money"],["#/config","Configurações","gear"]],
  admin:[["#/admin","Painel Administrativo","grid"],["#/admin/pontos","Gestão de Pontos","pin"],["#/admin/clientes","Gestão de Clientes","users"],["#/admin/empresas","Gestão de Empresas","building"],["#/admin/campanhas","Gestão de Campanhas","megaphone"],["#/admin/aprovacoes","Central de Aprovação","shield"],["#/admin/relatorios","Relatórios","chart"],["#/config","Configurações","gear"]]
};
const SIDEBAR={
  cliente:MENUS.cliente,
  empresa:MENUS.empresa,
  admin:[["#/admin","Painel","grid"],["#/admin/pontos","Pontos","pin"],["#/admin/clientes","Clientes","users"],["#/admin/empresas","Empresas","building"],["#/admin/campanhas","Campanhas","megaphone"],["#/admin/aprovacoes","Aprovações","shield"],["#/admin/relatorios","Relatórios","chart"]]
};
function route(){const h=location.hash||"#/";return h.split("?")[0]}
function qs(){const h=location.hash||"";const i=h.indexOf("?");return i<0?{}:Object.fromEntries(new URLSearchParams(h.slice(i+1)))}
function go(h,keepScroll){
  if(location.hash===h){render();return}
  if(!keepScroll)window.__scrollTop=true;
  location.hash=h;
}
document.addEventListener("click",e=>{
  const a=e.target.closest("a[href^='#/']");
  if(a){const h=a.getAttribute("href");if(h===location.hash){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}else{window.__scrollTop=true}closeDropdown();$(".nav-main")&&$(".nav-main").classList.remove("mobile-open")}
});
window.addEventListener("hashchange",()=>render());

/* ---------- cabeçalho ---------- */
function closeDropdown(){$$(".dropdown.open").forEach(d=>d.classList.remove("open"));$$(".avatar.is-open").forEach(a=>a.classList.remove("is-open"))}
function renderHeader(){
  const u=me(),r=route();
  const links=NAV.map(([h,t])=>`<a href="${h}" class="${r===h?"active":""}">${t}</a>`).join("");
  const cart=`<a href="#/carrinho" class="icon-btn cart-btn" aria-label="Carrinho">${I.cart}${S.carrinho.length?`<span class="cart-count">${S.carrinho.length}</span>`:""}</a>`;
  let right;
  if(!u){
    right=`${S.carrinho.length?cart:""}<button class="btn btn-sm btn-outline-accent" data-act="login">Entrar na Minha Conta</button>`;
  }else{
    const menu=MENUS[u.papel]||[];
    right=`${cart}
    <div class="user-menu">
      <button class="avatar" data-act="toggle-menu" aria-haspopup="true" aria-expanded="false">${initials(u.nome)}</button>
      <div class="dropdown" id="userdd">
        <div class="dropdown-head">
          <div class="ink" style="font-weight:600;font-size:14.5px">${esc(u.nome)}</div>
          <div class="tiny" style="margin-top:2px">${esc(u.email)}</div>
          <div class="tiny" style="margin-top:8px"><span class="badge no-dot">${u.papel==="cliente"?"Cliente Anunciante":u.papel==="empresa"?"Empresa Parceira":"Administrador"}</span></div>
        </div>
        ${menu.map(([h,t,ic])=>`<a href="${h}">${t}</a>`).join("")}
        <div class="sep"></div>
        <button data-act="logout">Sair</button>
      </div>
    </div>`;
  }
  $("#hdr").innerHTML=`<div class="header-inner">
    <a href="#/" class="logo">${I.logo}OutdoorHub</a>
    <nav class="nav-main">${links}</nav>
    <div class="header-right">${right}
      <button class="icon-btn burger" data-act="burger" aria-label="Abrir menu">${I.burger}</button>
    </div></div>`;
}
function renderFooter(){
  $("#ftr").innerHTML=`<footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div>
        <a href="#/" class="logo">${I.logo}OutdoorHub</a>
        <p class="small" style="margin-top:16px;max-width:34ch">Marketplace de mídia exterior: encontre pontos de OOH e DOOH, contrate online e acompanhe a veiculação da sua campanha.</p>
        <div class="socials">
          <a href="#/contato" aria-label="Instagram">${I.instagram}</a>
          <a href="#/contato" aria-label="LinkedIn">${I.linkedin}</a>
          <a href="#/contato" aria-label="Facebook">${I.facebook}</a>
          <a href="#/contato" aria-label="WhatsApp">${I.whats}</a>
        </div>
      </div>
      <div><h4>Plataforma</h4><ul>
        <li><a href="#/pontos">Pontos Disponíveis</a></li>
        <li><a href="#/#como-funciona">Como Funciona</a></li>
        <li><a href="#/parceiras">Empresas Parceiras</a></li>
        <li><a href="#/parceiras#seja-parceiro">Seja um Parceiro</a></li>
      </ul></div>
      <div><h4>Institucional</h4><ul>
        <li><a href="#/contato">Sobre</a></li>
        <li><a href="#/contato">Blog</a></li>
        <li><a href="#/contato">Trabalhe Conosco</a></li>
        <li><a href="#/contato">Política de Privacidade</a></li>
        <li><a href="#/contato">Termos de Uso</a></li>
      </ul></div>
      <div><h4>Contato</h4><ul>
        <li>Av. Paulista, 1471 — conj. 1108<br>Bela Vista, São Paulo/SP<br>CEP 01311-927</li>
        <li><a href="tel:+551130301000">(11) 3030-1000</a></li>
        <li><a href="#/contato">WhatsApp (11) 99000-1000</a></li>
        <li><a href="#/contato">comercial@outdoorhub.com.br</a></li>
        <li>Seg. a sex., 9h às 18h</li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 OutdoorHub — CNPJ 00.000.000/0001-00. Projeto acadêmico. Todos os direitos reservados.</span>
      <span>Feito para o TCC — dados fictícios, sem cobrança real.</span>
    </div>
  </div></footer>`;
}

/* ---------- animação de entrada por seção ---------- */
let io=null;
function observeReveals(){
  if(io)io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.12,rootMargin:"0px 0px -40px"});
  $$(".reveal").forEach(el=>io.observe(el));
}

/* ============================================================
   7. PÁGINA INICIAL
   ============================================================ */
/* fotografias reais usadas na home (hero e seção de produtos) */
const FOTO_PRODUTO={
  outdoor:"images/produto-outdoor.jpg",
  dooh:"images/produto-dooh.jpg",
  shopping:"images/produto-shopping.jpg",
  frontlight:"images/produto-frontlight.jpg",
  mobiliario:"images/produto-mobiliario.jpg"
};
const FOTO_HERO="images/hero-bg.jpg";
const VIDEO_HERO="images/hero-bg.mp4";
function heroFallback(){
  return `<video autoplay muted loop playsinline preload="auto" poster="${FOTO_HERO}"
      onerror="this.style.display='none'" aria-hidden="true">
    <source src="${VIDEO_HERO}" type="video/mp4">
  </video>
  <img class="hero-img-fallback" src="${FOTO_HERO}" alt="Outdoor de mídia exterior em avenida de grande fluxo">`;
}
function viewHome(){
  const stats=[
    [String(S.pontos.length),"Pontos disponíveis"],
    [String(new Set(S.pontos.map(p=>p.cidade)).size),"Cidades atendidas"],
    [String(S.empresas.filter(e=>e.status==="ativa").length),"Empresas parceiras"],
    ["+2 milhões","Impactos mensais estimados"]
  ];
  const produtos=PRODUTOS.map((pr,i)=>`
    <section class="product-row ${i%2?"flip":""} reveal">
      <div class="product-media"><img src="${FOTO_PRODUTO[pr.id]}" alt="${esc(pr.titulo)}" loading="lazy"></div>
      <div class="product-copy">
        <h3>${pr.titulo}</h3>
        <p>${pr.texto}</p>
        <ul class="feature-list">${pr.bullets.map(b=>`<li>${I.check}${b}</li>`).join("")}</ul>
        <a class="btn-link" href="#/pontos?tipo=${pr.id}">Ver pontos disponíveis</a>
      </div>
    </section>`).join("");
  const passos=[
    ["01","Escolha os pontos.","Navegue pelo mapa, compare preços, alcance e perfil de público. Sem cadastro para olhar."],
    ["02","Finalize sua contratação.","Adicione ao carrinho, informe os dados da empresa e conclua o pedido pela plataforma."],
    ["03","Envie seus arquivos e acompanhe sua campanha.","Suba a arte de cada ponto, acompanhe a aprovação e veja a campanha entrar no ar."]
  ];
  const marcas=S.empresas.filter(e=>e.status==="ativa");
  const chips=m=>`<div class="brand-chip"><span style="color:var(--accent-text);flex:none">${I.logo.replace('class="logo-mark"','width="22" height="22"')}</span><span><span class="bname">${esc(m.nome)}</span><br><span class="bcity">${esc(m.cidade)}</span></span></div>`;
  return `
  <section class="hero">
    <div class="hero-media">${heroFallback()}</div>
    <div class="hero-duotone"></div>
    <div class="hero-scrim"></div>
    <div class="hero-inner">
      <h1 class="display">Sua marca nos melhores pontos de mídia exterior.</h1>
      <p class="lede">Escolha locais estratégicos, gerencie campanhas e envie seus materiais publicitários em uma única plataforma.</p>
      <div class="hero-ctas">
        <a class="btn btn-lg btn-primary" href="#/pontos">Explorar Pontos Disponíveis</a>
        <a class="btn btn-lg btn-ghost" href="#/#como-funciona">Como Funciona</a>
      </div>
    </div>
    <div class="scroll-hint" aria-hidden="true"><div class="scroll-rail"></div>Role para ver mais</div>
  </section>

  <section class="stats-strip"><div class="wrap" style="padding-inline:0">
    <div class="stats-grid">
      ${stats.map(([n,c])=>`<div class="stat-cell"><div class="stat-num">${n}</div><div class="stat-cap">${c}</div></div>`).join("")}
    </div></div>
  </section>

  <section class="section" id="produtos">
    <div class="wrap reveal">
      <h2 class="h-section">Nossos produtos</h2>
      <p class="lede" style="margin-top:20px">Cinco formatos de mídia exterior, do painel impresso em avenida ao LED de aeroporto. Cada ponto tem preço, alcance e público estimado abertos para consulta.</p>
    </div>
    <div style="margin-top:72px">${produtos}</div>
  </section>

  <section class="section" id="como-funciona" style="border-top:1px solid var(--border)">
    <div class="wrap">
      <div class="reveal"><h2 class="h-section">Como funciona</h2></div>
      <div class="steps">
        ${passos.map(([n,t,d],i)=>`<div class="step reveal" style="transition-delay:${i*90}ms"><div class="step-num">${n}</div><h3>${t}</h3><p class="small" style="max-width:30ch">${d}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section-tight" style="border-top:1px solid var(--border)">
    <div class="wrap reveal" style="margin-bottom:38px">
      <h2 class="h-page">Empresas parceiras</h2>
      <p class="small" style="margin-top:10px">Exibidores que cadastram e operam os pontos anunciados aqui.</p>
    </div>
    <div class="marquee"><div class="marquee-track">${marcas.map(chips).join("")}${marcas.map(chips).join("")}</div></div>
  </section>

  <section class="section cta-band">
    <div class="wrap reveal">
      <h2 class="h-section">Pronto para colocar sua marca na rua?</h2>
      <div style="margin-top:34px"><a class="btn btn-lg btn-primary" href="#/pontos">Explorar Pontos Disponíveis</a></div>
    </div>
  </section>`;
}

function viewProdutos(){
  return `<div class="wrap section-tight">
    <h1 class="h-page reveal">Formatos de mídia exterior</h1>
    <p class="lede reveal" style="margin-top:16px">Compare os cinco formatos disponíveis na plataforma e vá direto para os pontos de cada tipo.</p>
  </div>
  ${PRODUTOS.map((pr,i)=>`
    <section class="product-row ${i%2?"flip":""} reveal">
      <div class="product-media"><img src="${FOTO_PRODUTO[pr.id]}" alt="${esc(pr.titulo)}" loading="lazy"></div>
      <div class="product-copy">
        <h3>${pr.titulo}</h3>
        <p>${pr.texto}</p>
        <ul class="feature-list">${pr.bullets.map(b=>`<li>${I.check}${b}</li>`).join("")}</ul>
        <div class="flex gap-10 wrapf mt-24">
          <a class="btn btn-primary" href="#/pontos?tipo=${pr.id}">Ver pontos disponíveis</a>
          <span class="badge no-dot">${S.pontos.filter(p=>p.tipo===pr.id).length} pontos na plataforma</span>
        </div>
      </div>
    </section>`).join("")}
  <section class="section cta-band"><div class="wrap reveal">
    <h2 class="h-section">Não sabe qual formato escolher?</h2>
    <p class="lede" style="margin:18px auto 30px">Nossa equipe monta uma proposta com base no seu público e na sua verba.</p>
    <a class="btn btn-lg btn-primary" href="#/contato">Falar com o comercial</a>
  </div></section>`;
}

function viewParceiras(){
  const ativas=S.empresas.filter(e=>e.status==="ativa");
  return `<div class="wrap section-tight">
    <h1 class="h-page reveal">Empresas parceiras</h1>
    <p class="lede reveal" style="margin-top:16px">Exibidores que operam os pontos anunciados no OutdoorHub. Cada parceiro cadastra seus próprios painéis, define preços e aprova as artes veiculadas.</p>
    <div class="grid-cards mt-32">
      ${ativas.map(e=>{
        const n=S.pontos.filter(p=>p.empresaId===e.id).length;
        return `<div class="card pad reveal">
          <div class="flex items-center gap-10 mb-16"><span class="accent" style="flex:none">${I.building.replace("<svg",'<svg width="22" height="22"')}</span>
          <h3 style="font-size:17px">${esc(e.nome)}</h3></div>
          <div class="spec-list">
            <div class="spec-row"><span>Cidade</span><span>${esc(e.cidade)}</span></div>
            <div class="spec-row"><span>Pontos cadastrados</span><span>${n}</span></div>
            <div class="spec-row"><span>Parceiro desde</span><span>${dBR(e.criadoEm)}</span></div>
          </div>
          <a class="btn btn-sm btn-ghost btn-block mt-16" href="#/pontos?empresa=${e.id}">Ver pontos desta empresa</a>
        </div>`}).join("")}
    </div>
    <div class="card pad-lg mt-32 reveal" id="seja-parceiro">
      <h2 class="h-page">Seja um parceiro</h2>
      <p class="lede" style="margin-top:14px">Tem painéis, telas ou mobiliário urbano ociosos? Cadastre sua empresa, publique seus pontos e receba pedidos de anunciantes de todo o estado.</p>
      <div class="flex gap-10 wrapf mt-24">
        <button class="btn btn-primary" data-act="signup-empresa">Cadastrar minha empresa</button>
        <a class="btn btn-ghost" href="#/contato">Falar com o comercial</a>
      </div>
    </div>
  </div>`;
}

function viewContato(){
  return `<div class="wrap section-tight">
    <div class="two-col">
      <div class="reveal">
        <h1 class="h-page">Fale com a gente</h1>
        <p class="lede" style="margin-top:16px">Conte o que você quer anunciar, em qual cidade e qual a verba prevista. Respondemos em até 1 dia útil.</p>
        <form class="card pad-lg mt-24" data-form="contato" novalidate>
          <div class="grid-2">
            <div class="field"><input id="ct-nome" placeholder=" " required><label for="ct-nome">Nome completo</label></div>
            <div class="field"><input id="ct-empresa" placeholder=" "><label for="ct-empresa">Empresa</label></div>
          </div>
          <div class="grid-2">
            <div class="field"><input id="ct-email" type="email" placeholder=" " required><label for="ct-email">E-mail</label></div>
            <div class="field"><input id="ct-tel" placeholder=" "><label for="ct-tel">Telefone</label></div>
          </div>
          <div class="field"><textarea id="ct-msg" placeholder=" " required></textarea><label for="ct-msg">Como podemos ajudar?</label></div>
          <button class="btn btn-primary btn-block" type="submit">Enviar mensagem</button>
        </form>
      </div>
      <div class="reveal">
        <div class="card pad-lg">
          <h3 style="font-size:17px;margin-bottom:18px">Atendimento comercial</h3>
          <div class="spec-list">
            <div class="spec-row"><span>Telefone</span><span>(11) 3030-1000</span></div>
            <div class="spec-row"><span>WhatsApp</span><span>(11) 99000-1000</span></div>
            <div class="spec-row"><span>E-mail</span><span>comercial@outdoorhub.com.br</span></div>
            <div class="spec-row"><span>Horário</span><span>Seg. a sex., 9h às 18h</span></div>
          </div>
        </div>
        <div class="card pad-lg mt-16">
          <h3 style="font-size:17px;margin-bottom:12px">Endereço</h3>
          <p class="small">Av. Paulista, 1471 — conj. 1108<br>Bela Vista, São Paulo/SP<br>CEP 01311-927</p>
          <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-top:16px">${miniMapa(-23.5613,-46.6560)}</div>
        </div>
        <div class="card pad mt-16">
          <p class="tiny" style="margin:0">Este é um projeto acadêmico (TCC). Nenhuma cobrança é processada e os dados exibidos são fictícios.</p>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   8. MAPA
   Mapa vetorial próprio: as coordenadas reais (lat/lng) de cada
   ponto são projetadas sobre uma malha viária estilizada.
   ============================================================ */
const MAPB={n:-22.74,s:-24.06,w:-47.20,e:-46.30};
const MW=1760,MH=1180;
const projX=lng=>((lng-MAPB.w)/(MAPB.e-MAPB.w))*MW;
const projY=lat=>((MAPB.n-lat)/(MAPB.n-MAPB.s))*MH;
const CIDADES=[{n:"São Paulo",lat:-23.5505,lng:-46.6333,r:250},{n:"Guarulhos",lat:-23.4543,lng:-46.5337,r:130},{n:"Campinas",lat:-22.9056,lng:-47.0608,r:150},{n:"Santos",lat:-23.9608,lng:-46.3336,r:120}];
function mapaBase(){
  const r=rng("malha-viaria"),g=[];
  g.push(`<rect width="${MW}" height="${MH}" fill="#0B0D10"/>`);
  /* massa de água / litoral */
  g.push(`<path d="M0 ${MH} L0 ${MH-90} Q ${MW*.3} ${MH-170} ${MW*.62} ${MH-60} Q ${MW*.8} ${MH-10} ${MW} ${MH-70} L${MW} ${MH} Z" fill="#0A1620"/>`);
  /* manchas urbanas */
  CIDADES.forEach(c=>{
    const x=projX(c.lng),y=projY(c.lat);
    g.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${c.r}" fill="#12161C"/>`);
    g.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(c.r*.55).toFixed(0)}" fill="#161B22"/>`);
  });
  /* rodovias entre cidades */
  const link=(a,b)=>`<path d="M${projX(a.lng).toFixed(0)} ${projY(a.lat).toFixed(0)} Q ${((projX(a.lng)+projX(b.lng))/2+60).toFixed(0)} ${((projY(a.lat)+projY(b.lat))/2-40).toFixed(0)} ${projX(b.lng).toFixed(0)} ${projY(b.lat).toFixed(0)}" stroke="#23282F" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  g.push(link(CIDADES[0],CIDADES[1]),link(CIDADES[0],CIDADES[2]),link(CIDADES[0],CIDADES[3]),link(CIDADES[1],CIDADES[2]));
  /* malha local */
  CIDADES.forEach(c=>{
    const x=projX(c.lng),y=projY(c.lat);
    for(let i=0;i<26;i++){
      const a=r()*Math.PI*2,len=c.r*(.35+r()*.9);
      const x1=x+Math.cos(a)*c.r*.1,y1=y+Math.sin(a)*c.r*.1;
      const x2=x1+Math.cos(a)*len,y2=y1+Math.sin(a)*len*.7;
      g.push(`<path d="M${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)}" stroke="#1D2229" stroke-width="${(1+r()*2).toFixed(1)}" fill="none"/>`);
    }
    for(let i=0;i<14;i++){
      const bx=x-c.r+r()*c.r*2,by=y-c.r*.8+r()*c.r*1.6;
      g.push(`<rect x="${bx.toFixed(0)}" y="${by.toFixed(0)}" width="${(18+r()*46).toFixed(0)}" height="${(14+r()*34).toFixed(0)}" rx="2" fill="#171C22"/>`);
    }
    g.push(`<text x="${x.toFixed(0)}" y="${(y-c.r-14).toFixed(0)}" text-anchor="middle" font-family="Inter,Arial" font-size="19" font-weight="700" fill="#4A5059" letter-spacing="1">${c.n}</text>`);
  });
  return `<svg width="${MW}" height="${MH}" viewBox="0 0 ${MW} ${MH}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">${g.join("")}</svg>`;
}
function miniMapa(lat,lng,h){
  const r=rng(lat+","+lng),g=[];const W=560,H=h||220;
  g.push(`<rect width="${W}" height="${H}" fill="#0B0D10"/>`);
  for(let i=0;i<12;i++){const y=r()*H;g.push(`<path d="M0 ${y.toFixed(0)} L${W} ${(y+(r()*80-40)).toFixed(0)}" stroke="#1C2128" stroke-width="${(1+r()*3).toFixed(1)}"/>`)}
  for(let i=0;i<10;i++){const x=r()*W;g.push(`<path d="M${x.toFixed(0)} 0 L${(x+(r()*60-30)).toFixed(0)} ${H}" stroke="#1C2128" stroke-width="${(1+r()*2.4).toFixed(1)}"/>`)}
  for(let i=0;i<26;i++)g.push(`<rect x="${(r()*W).toFixed(0)}" y="${(r()*H).toFixed(0)}" width="${(14+r()*40).toFixed(0)}" height="${(10+r()*26).toFixed(0)}" rx="2" fill="#151A20"/>`);
  g.push(`<circle cx="${W/2}" cy="${H/2}" r="26" fill="#7B01F7" opacity=".16"/><circle cx="${W/2}" cy="${H/2}" r="8" fill="#7B01F7" stroke="#0A0A0B" stroke-width="3"/>`);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">${g.join("")}</svg>`;
}
let MAPST={z:1.35,x:0,y:0,sel:null,init:false};
function mountMapa(pontos){
  const host=$("#mapa");if(!host)return;
  const world=$("#mapa-world");
  function apply(){world.style.transform=`translate(${MAPST.x}px,${MAPST.y}px) scale(${MAPST.z})`}
  if(!MAPST.init){
    const rect=host.getBoundingClientRect();
    const first=pontos[0]||S.pontos[0];
    MAPST.x=rect.width/2-projX(first.lng)*MAPST.z;
    MAPST.y=rect.height/2-projY(first.lat)*MAPST.z;
    MAPST.init=true;
  }
  apply();
  let drag=null;
  host.addEventListener("pointerdown",e=>{
    if(e.target.closest(".map-pin"))return;
    drag={sx:e.clientX,sy:e.clientY,ox:MAPST.x,oy:MAPST.y};host.classList.add("dragging");host.setPointerCapture(e.pointerId);
  });
  host.addEventListener("pointermove",e=>{if(!drag)return;MAPST.x=drag.ox+(e.clientX-drag.sx);MAPST.y=drag.oy+(e.clientY-drag.sy);apply()});
  const end=()=>{drag=null;host.classList.remove("dragging")};
  host.addEventListener("pointerup",end);host.addEventListener("pointercancel",end);
  host.addEventListener("wheel",e=>{
    e.preventDefault();const rect=host.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const nz=clamp(MAPST.z*(e.deltaY<0?1.14:.88),.55,4);
    MAPST.x=mx-(mx-MAPST.x)*(nz/MAPST.z);MAPST.y=my-(my-MAPST.y)*(nz/MAPST.z);MAPST.z=nz;apply();
  },{passive:false});
  host.addEventListener("click",e=>{
    const zi=e.target.closest("[data-zoom]");
    if(zi){const rect=host.getBoundingClientRect(),mx=rect.width/2,my=rect.height/2;
      const nz=clamp(MAPST.z*(zi.dataset.zoom==="in"?1.3:.77),.55,4);
      MAPST.x=mx-(mx-MAPST.x)*(nz/MAPST.z);MAPST.y=my-(my-MAPST.y)*(nz/MAPST.z);MAPST.z=nz;apply();return}
    if(e.target.closest("[data-fit]")){fitMapa(pontos);return}
  });
  window.__fitMapa=()=>fitMapa(pontos);
  function fitMapa(list){
    const rect=host.getBoundingClientRect();if(!list.length)return;
    const xs=list.map(p=>projX(p.lng)),ys=list.map(p=>projY(p.lat));
    const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
    const pad=120;
    const z=clamp(Math.min(rect.width/(maxx-minx+pad*2),rect.height/(maxy-miny+pad*2)),.55,2.4);
    MAPST.z=z;MAPST.x=rect.width/2-((minx+maxx)/2)*z;MAPST.y=rect.height/2-((miny+maxy)/2)*z;apply();
  }
}
function pinHTML(p,sel){
  const cls=p.status==="disponivel"?"livre":p.status==="ocupado"?"ocupado":"manut";
  const tip=sel===p.id?`<div class="pin-tip" data-stop>
      <div class="pt-media">${imgTag(capaPonto(p),p.nome)}</div>
      <div class="pt-body">
        <div class="tiny">${esc(TIPOS[p.tipo].curto)} · ${esc(p.cidade)}</div>
        <div class="ink" style="font-weight:600;font-size:14px;margin:3px 0 8px">${esc(p.nome)}</div>
        <div class="flex items-center justify-between gap-10">
          <span class="price" style="font-size:16px">${brl(p.valor)}<small>/bissemana</small></span>
        </div>
        <div class="card-actions"><a class="btn btn-sm btn-ghost" href="#/ponto/${p.id}">Ver Detalhes</a>
        <button class="btn btn-sm btn-primary" data-act="add-cart" data-id="${p.id}">Adicionar</button></div>
      </div></div>`:"";
  return `<div class="map-pin ${cls} ${sel===p.id?"active":""}" style="left:${projX(p.lng).toFixed(1)}px;top:${projY(p.lat).toFixed(1)}px" data-pin="${p.id}">
    ${tip}<div class="pin-body"><i></i>${brlShort(p.valor).replace("R$ ","R$")}</div></div>`;
}
const imgTag=(src,alt)=>`<img src="${src}" alt="${esc(alt||"")}" loading="lazy">`;

/* ============================================================
   9. MARKETPLACE
   ============================================================ */
let FILTROS={tipo:"",cidade:"",empresa:"",busca:"",so:""};
function aplicaFiltros(){
  return S.pontos.filter(p=>{
    if(FILTROS.tipo&&p.tipo!==FILTROS.tipo)return false;
    if(FILTROS.cidade&&p.cidade!==FILTROS.cidade)return false;
    if(FILTROS.empresa&&p.empresaId!==FILTROS.empresa)return false;
    if(FILTROS.so==="disponivel"&&p.status!=="disponivel")return false;
    if(FILTROS.busca){
      const t=(p.nome+" "+p.endereco+" "+p.cidade+" "+(empresa(p.empresaId)||{}).nome).toLowerCase();
      if(!t.includes(FILTROS.busca.toLowerCase()))return false;
    }
    return true;
  });
}
function cardPonto(p){
  const e=empresa(p.empresaId)||{nome:"—"};
  return `<article class="point-card" data-card="${p.id}">
    <div class="point-thumb">${imgTag(capaPonto(p),p.nome)}
      <div class="thumb-tag"><span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span></div>
    </div>
    <div class="point-card-body">
      <div class="tiny">${esc(TIPOS[p.tipo].curto)} · ${esc(p.cidade)}</div>
      <h3>${esc(p.nome)}</h3>
      <div class="tiny" style="margin-bottom:12px">${esc(e.nome)} · alcance estimado ${num(p.alcance*14)} impactos/bissemana</div>
      <div class="price">${brl(p.valor)} <small>/bissemana</small></div>
      <div class="card-actions">
        <a class="btn btn-sm btn-ghost" href="#/ponto/${p.id}">Ver Detalhes</a>
        <button class="btn btn-sm btn-primary" data-act="add-cart" data-id="${p.id}">Adicionar ao Carrinho</button>
      </div>
    </div>
  </article>`;
}
function viewPontos(){
  const q=qs();
  if(q.tipo!==undefined)FILTROS.tipo=q.tipo;
  if(q.empresa!==undefined)FILTROS.empresa=q.empresa;
  const lista=aplicaFiltros();
  const cidades=[...new Set(S.pontos.map(p=>p.cidade))];
  return `<div class="market">
    <div class="market-map" id="mapa">
      <div class="map-canvas" id="mapa-world" style="width:${MW}px;height:${MH}px;transform-origin:0 0;position:absolute">
        ${mapaBase()}
        ${lista.map(p=>pinHTML(p,MAPST.sel)).join("")}
      </div>
      <div class="map-ui">
        <button class="icon-btn" data-zoom="in" aria-label="Aproximar">${I.zoomIn}</button>
        <button class="icon-btn" data-zoom="out" aria-label="Afastar">${I.zoomOut}</button>
        <button class="icon-btn" data-fit aria-label="Enquadrar todos os pontos">${I.target}</button>
      </div>
      <div class="map-legend">
        <div class="lg-row"><i style="background:var(--accent)"></i>Disponível para contratação</div>
        <div class="lg-row"><i style="background:var(--warn)"></i>Ocupado por campanha ativa</div>
        <div class="lg-row"><i style="background:var(--muted)"></i>Em manutenção</div>
        <div class="tiny" style="margin-top:2px">Arraste para navegar · role para aproximar</div>
      </div>
    </div>
    <aside class="market-list">
      <div class="market-list-head">
        <div class="flex items-center justify-between gap-10 mb-16">
          <h1 style="font-size:19px">Pontos disponíveis</h1>
          <span class="tiny">${lista.length} de ${S.pontos.length}</span>
        </div>
        <input class="search-input" id="busca" placeholder="Buscar por nome, endereço ou cidade" value="${esc(FILTROS.busca)}">
        <div class="filters">
          <button class="chip ${!FILTROS.tipo?"on":""}" data-filtro="tipo" data-val="">Todos os formatos</button>
          ${Object.entries(TIPOS).map(([k,v])=>`<button class="chip ${FILTROS.tipo===k?"on":""}" data-filtro="tipo" data-val="${k}">${v.curto}</button>`).join("")}
        </div>
        <div class="filters">
          <button class="chip ${!FILTROS.cidade?"on":""}" data-filtro="cidade" data-val="">Todas as cidades</button>
          ${cidades.map(c=>`<button class="chip ${FILTROS.cidade===c?"on":""}" data-filtro="cidade" data-val="${esc(c)}">${esc(c)}</button>`).join("")}
          <button class="chip ${FILTROS.so==="disponivel"?"on":""}" data-filtro="so" data-val="${FILTROS.so==="disponivel"?"":"disponivel"}">Só livres</button>
        </div>
      </div>
      <div class="point-cards">
        ${lista.length?lista.map(cardPonto).join(""):`<div class="empty"><div class="big">Nenhum ponto com esses filtros</div><p class="small">Tente outra cidade ou remova o filtro de formato.</p><button class="btn btn-sm btn-ghost mt-16" data-act="limpar-filtros">Limpar filtros</button></div>`}
      </div>
    </aside>
  </div>`;
}

function viewPonto(id){
  const p=ponto(id);
  if(!p)return `<div class="wrap section-tight"><div class="empty"><div class="big">Ponto não encontrado</div><a class="btn btn-ghost mt-16" href="#/pontos">Voltar para os pontos</a></div></div>`;
  const e=empresa(p.empresaId)||{nome:"—",cidade:""};
  const cv=campanhaVeiculando(p.id);
  const arte=cv?arquivoAtual(cv):null;
  const gal=p.fotos.length?p.fotos:[{id:"x",seed:p.id+"-0"}];
  const ativa=window.__galIdx||0;
  const atual=gal[Math.min(ativa,gal.length-1)];
  return `<div class="wrap section-tight">
    <a class="btn-link" href="#/pontos">← Voltar para o mapa</a>
    <div class="two-col mt-24">
      <div>
        <div class="detail-hero">${imgTag(fotoSrc(atual,p.tipo),p.nome)}</div>
        ${gal.length>1?`<div class="gallery-strip">${gal.map((f,i)=>`<button class="${i===Math.min(ativa,gal.length-1)?"on":""}" data-gal="${i}">${imgTag(fotoSrc(f,p.tipo),"Foto "+(i+1))}</button>`).join("")}</div>`:""}
        <div class="mt-32">
          <div class="flex items-center gap-10 wrapf mb-8">
            <span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span>
            <span class="badge no-dot">${TIPOS[p.tipo].nome}</span>
          </div>
          <h1 class="h-page">${esc(p.nome)}</h1>
          <p class="lede" style="margin-top:12px">${esc(p.endereco)}</p>
        </div>
        ${arte?`<div class="card pad mt-24">
          <h3 style="font-size:16px;margin-bottom:6px">Arte em veiculação</h3>
          <p class="tiny" style="margin-bottom:16px">Campanha “${esc(cv.nome||"Campanha")}” no ar até ${dBR(cv.fim)}.</p>
          ${mockupHTML(p,arte)}
        </div>`:""}
        <div class="card pad-lg mt-24">
          <h3 style="font-size:17px;margin-bottom:16px">Ficha técnica</h3>
          <div class="spec-list">
            <div class="spec-row"><span>Empresa parceira</span><span>${esc(e.nome)}</span></div>
            <div class="spec-row"><span>Formato</span><span>${TIPOS[p.tipo].nome}</span></div>
            <div class="spec-row"><span>Público-alvo</span><span>${esc(p.publico)}</span></div>
            <div class="spec-row"><span>Alcance estimado</span><span>${num(p.alcance)} pessoas/dia</span></div>
            <div class="spec-row"><span>Impactos por bissemana</span><span>${num(p.alcance*14)}</span></div>
            <div class="spec-row"><span>Arquivos aceitos</span><span>${p.formatos.join(" · ")}</span></div>
            <div class="spec-row"><span>Coordenadas</span><span>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</span></div>
          </div>
        </div>
        <div class="card pad-lg mt-24">
          <h3 style="font-size:17px;margin-bottom:6px">Localização</h3>
          <p class="tiny" style="margin-bottom:16px">${esc(p.endereco)}</p>
          <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border)">${miniMapa(p.lat,p.lng,260)}</div>
        </div>
      </div>
      <div class="sticky-buy">
        <div class="card pad-lg">
          <div class="price" style="font-size:32px">${brl(p.valor)}</div>
          <div class="tiny" style="margin-bottom:22px">por bissemana (14 dias de exposição)</div>
          <div class="spec-list" style="margin-bottom:22px">
            <div class="spec-row"><span>Cidade</span><span>${esc(p.cidade)}</span></div>
            <div class="spec-row"><span>Disponibilidade</span><span>${ST_PONTO[p.status].label}</span></div>
            <div class="spec-row"><span>Início previsto</span><span>${dBR(addDays(today(),7))}</span></div>
          </div>
          ${p.status==="manutencao"
            ?`<button class="btn btn-primary btn-block" disabled>Indisponível no momento</button>`
            :`<button class="btn btn-lg btn-primary btn-block" data-act="add-cart" data-id="${p.id}">${p.status==="ocupado"?"Alugar este Ponto (fila)":"Adicionar ao Carrinho"}</button>`}
          <button class="btn btn-ghost btn-block mt-16" data-act="alugar-agora" data-id="${p.id}">Alugar este Ponto</button>
          <p class="tiny mt-16" style="margin-bottom:0">Você só precisa entrar na conta para contratar. Navegar e consultar preços é livre.</p>
        </div>
        <div class="card pad mt-16">
          <div class="tiny mb-8">Exibido por</div>
          <div class="flex items-center gap-10">
            <span class="accent">${I.building.replace("<svg",'<svg width="20" height="20"')}</span>
            <div><div class="ink" style="font-weight:600;font-size:14.5px">${esc(e.nome)}</div><div class="tiny">${esc(e.cidade)}</div></div>
          </div>
          <a class="btn btn-sm btn-ghost btn-block mt-16" href="#/pontos?empresa=${p.empresaId}">Ver outros pontos da empresa</a>
        </div>
      </div>
    </div>
  </div>`;
}
function mockupHTML(p,arq,opts){
  if(!arq)return "";
  opts=opts||{};
  const isVideo=(arq.tipo||"").startsWith("video");
  if(!arq.data){
    return `<div class="media-preview"><div class="empty"><div class="small">${isVideo?"Vídeo":"Imagem"} enviado (${esc(arq.nome)}). A pré-visualização não ficou guardada nesta sessão.</div></div></div>`;
  }
  const f=fotoPrincipal(p);
  const pn=(f&&f.area)?f.area:(PANEL[p.tipo]||PANEL.outdoor);
  const rotulo=opts.rotulo||"Prévia de veiculação";
  const midia=isVideo
    ?`<video class="mk-art" style="left:${pn.x}%;top:${pn.y}%;width:${pn.w}%;height:${pn.h}%" src="${arq.data}" autoplay muted loop playsinline></video>`
    :`<img class="mk-art" src="${arq.data}" alt="Arte posicionada no painel" style="left:${pn.x}%;top:${pn.y}%;width:${pn.w}%;height:${pn.h}%">`;
  return `<div class="mockup">
    ${imgTag(fotoSrc(f,p.tipo),"Foto do ponto")}
    ${midia}
    <span class="mk-tag">${I.check}${esc(rotulo)}</span>
  </div>`;
}

/* ============================================================
   10. LOGIN, CADASTRO E TRAVA DE COMPRA
   ============================================================ */
let INTENCAO=null; /* {pontoId, rota} — retomado após o login */
function modalLogin(aba,ctx){
  const t=aba||"entrar";
  INTENCAO=ctx||INTENCAO;
  const titulo=INTENCAO&&INTENCAO.pontoId?"Entre para continuar":"Entrar na sua conta";
  const sub=INTENCAO&&INTENCAO.pontoId?"Você precisa de uma conta para contratar pontos de mídia.":"Acesse seu painel para acompanhar campanhas e artes.";
  openModal(`
    <h2 style="font-size:23px">${titulo}</h2>
    <p class="small" style="margin-top:8px;color:var(--body)">${sub}</p>
    <div class="tabs" role="tablist">
      <button class="${t==="entrar"?"active":""}" data-tab="entrar">Entrar</button>
      <button class="${t==="criar"?"active":""}" data-tab="criar">Criar conta</button>
    </div>
    <div id="auth-body">${t==="entrar"?formEntrar():formCriar()}</div>
  `);
}
function formEntrar(){
  return `<form data-form="entrar" novalidate>
    <div class="field"><input id="lg-email" type="email" placeholder=" " autocomplete="email" required><label for="lg-email">E-mail</label></div>
    <div class="field"><input id="lg-senha" type="password" placeholder=" " autocomplete="current-password" required><label for="lg-senha">Senha</label></div>
    <div class="form-msg" id="lg-msg"></div>
    <button class="btn btn-primary btn-block" type="submit">Entrar</button>
    <div class="or-div">ou</div>
    <button class="btn btn-ghost btn-block" type="button" data-act="google">${I.google} Continuar com Google</button>
    <div style="text-align:center;margin-top:18px"><button class="btn-link" type="button" data-act="esqueci">Esqueci minha senha</button></div>
    <div class="card pad mt-24" style="background:#101014">
      <div class="tiny mb-8">Contas de demonstração (senha 123456)</div>
      <div class="flex gap-6 wrapf">
        <button class="chip" type="button" data-demo="cliente@outdoorhub.com.br">Cliente</button>
        <button class="chip" type="button" data-demo="empresa@outdoorhub.com.br">Empresa</button>
        <button class="chip" type="button" data-demo="admin@outdoorhub.com.br">Administrador</button>
      </div>
    </div>
  </form>`;
}
function formCriar(){
  return `<form data-form="criar" novalidate>
    <div class="field"><input id="cd-nome" placeholder=" " required><label for="cd-nome">Nome completo</label></div>
    <div class="field"><input id="cd-email" type="email" placeholder=" " required><label for="cd-email">E-mail</label></div>
    <div class="grid-2">
      <div class="field"><input id="cd-empresa" placeholder=" "><label for="cd-empresa">Empresa</label></div>
      <div class="field"><input id="cd-cnpj" placeholder=" "><label for="cd-cnpj">CNPJ</label></div>
    </div>
    <div class="field"><input id="cd-senha" type="password" placeholder=" " required><label for="cd-senha">Senha (mín. 6 caracteres)</label></div>
    <div class="form-msg" id="cd-msg"></div>
    <button class="btn btn-primary btn-block" type="submit">Criar conta</button>
    <div class="or-div">ou</div>
    <button class="btn btn-ghost btn-block" type="button" data-act="google">${I.google} Continuar com Google</button>
    <p class="tiny mt-16" style="margin-bottom:0">Ao criar a conta você concorda com os Termos de Uso e a Política de Privacidade.</p>
  </form>`;
}
/* login/registro já validados pelo servidor — aqui só aplica o resultado */
async function aplicarSessao(usuarioNorm,token){
  salvarToken(token);
  S.usuario=usuarioNorm;
  invalidarCacheDoPapel();
  const ctx=INTENCAO;INTENCAO=null;
  closeModal();
  toast("Bem-vindo, "+usuarioNorm.nome.split(" ")[0]+".");
  if(ctx&&ctx.pontoId&&usuarioNorm.papel==="cliente"){
    await addCarrinho(ctx.pontoId,true);
    go(ctx.rota||("#/ponto/"+ctx.pontoId));
    await render();
    return;
  }
  go(usuarioNorm.papel==="admin"?"#/admin":usuarioNorm.papel==="empresa"?"#/empresa":"#/painel");
  await render();
}
async function tentarRestaurarSessao(){
  const t=carregarToken();
  if(!t){S.token=null;return}
  S.token=t;
  try{
    const r=await api("/auth/me");
    S.usuario=normUsuario(r.usuario);
  }catch(e){
    salvarToken(null);S.token=null;S.usuario=null;
  }
}
async function sair(){
  salvarToken(null);S.usuario=null;S.carrinho=[];salvarCarrinho();invalidarCacheDoPapel();
  go("#/");await render();toast("Você saiu da conta.","info");
}

/* ============================================================
   11. CARRINHO E CHECKOUT
   ============================================================ */
async function addCarrinho(id,silencioso){
  const p=ponto(id);if(!p)return;
  if(!me()||papel()!=="cliente"){
    if(me()&&papel()!=="cliente"){toast("Contratações são feitas por contas de Cliente Anunciante.","err");return}
    modalLogin("entrar",{pontoId:id,rota:location.hash});
    return;
  }
  if(S.carrinho.find(i=>i.pontoId===id)){toast("Este ponto já está no seu carrinho.","info");return}
  const inicio=addDays(today(),7);
  S.carrinho.push({pontoId:id,inicio:dISO(inicio),dias:14});
  salvarCarrinho();renderHeader();
  if(!silencioso)toast(p.nome+" foi adicionado ao carrinho.");
  else toast("Adicionamos "+p.nome+" ao seu carrinho.");
}
function totalCarrinho(){return S.carrinho.reduce((a,i)=>{const p=ponto(i.pontoId);return a+(p?p.valor*(i.dias/14):0)},0)}
function viewCarrinho(){
  if(!me()||papel()!=="cliente"){modalLogin("entrar",{rota:"#/carrinho"});return viewPontosAviso("Entre com uma conta de anunciante para ver seu carrinho.")}
  if(!S.carrinho.length)return `<div class="wrap section-tight"><h1 class="h-page">Seu carrinho</h1>
    <div class="card pad-lg mt-24"><div class="empty"><div class="big">Seu carrinho está vazio</div>
    <p class="small">Escolha pontos no mapa para montar sua campanha.</p>
    <a class="btn btn-primary mt-16" href="#/pontos">Explorar Pontos Disponíveis</a></div></div></div>`;
  const itens=S.carrinho.map((i,idx)=>{
    const p=ponto(i.pontoId),e=empresa(p.empresaId)||{nome:"—"};
    const fim=dISO(addDays(new Date(i.inicio),i.dias));
    return `<div class="line-item">
      <div class="li-thumb">${imgTag(capaPonto(p),p.nome)}</div>
      <div style="flex:1;min-width:0">
        <div class="ink" style="font-weight:600;font-size:15px">${esc(p.nome)}</div>
        <div class="tiny">${esc(TIPOS[p.tipo].curto)} · ${esc(p.cidade)} · ${esc(e.nome)}</div>
        <div class="flex gap-10 wrapf mt-8 items-center">
          <label class="tiny">Início
            <input type="date" value="${i.inicio}" data-cart-ini="${idx}" style="margin-left:6px;background:#0F0F12;border:1px solid var(--border-strong);border-radius:6px;padding:5px 8px;color:var(--ink);font-size:12.5px">
          </label>
          <label class="tiny">Período
            <select data-cart-dias="${idx}" style="margin-left:6px;background:#0F0F12;border:1px solid var(--border-strong);border-radius:6px;padding:5px 8px;color:var(--ink);font-size:12.5px">
              <option value="14" ${i.dias===14?"selected":""}>1 bissemana</option>
              <option value="28" ${i.dias===28?"selected":""}>2 bissemanas</option>
              <option value="42" ${i.dias===42?"selected":""}>3 bissemanas</option>
            </select>
          </label>
          <span class="tiny">até ${dBR(fim)}</span>
        </div>
      </div>
      <div style="text-align:right;flex:none">
        <div class="price" style="font-size:17px">${brl(p.valor*(i.dias/14))}</div>
        <button class="btn-link" style="color:var(--danger);font-size:12.5px;margin-top:8px" data-act="rm-cart" data-idx="${idx}">Remover</button>
      </div>
    </div>`}).join("");
  return `<div class="wrap section-tight">
    <h1 class="h-page">Seu carrinho</h1>
    <p class="small mt-8">${S.carrinho.length} ponto(s) selecionado(s).</p>
    <div class="two-col mt-24">
      <div class="card pad-lg">${itens}</div>
      <div class="card pad-lg sticky-buy">
        <h3 style="font-size:17px;margin-bottom:18px">Resumo</h3>
        <div class="spec-list">
          <div class="spec-row"><span>Subtotal</span><span>${brl(totalCarrinho())}</span></div>
          <div class="spec-row"><span>Taxa de produção</span><span>Isenta</span></div>
          <div class="spec-row"><span>Total</span><span class="price" style="font-size:20px">${brl(totalCarrinho())}</span></div>
        </div>
        <a class="btn btn-lg btn-primary btn-block mt-24" href="#/checkout">Finalizar Compra</a>
        <a class="btn btn-ghost btn-block mt-16" href="#/pontos">Continuar escolhendo</a>
      </div>
    </div>
  </div>`;
}
function viewPontosAviso(msg){
  return `<div class="wrap section-tight"><div class="card pad-lg"><div class="empty"><div class="big">${esc(msg)}</div>
  <a class="btn btn-ghost mt-16" href="#/pontos">Ver pontos disponíveis</a></div></div></div>`;
}

let CHK={etapa:1,dados:{}};
function viewCheckout(){
  if(!me()||papel()!=="cliente"){modalLogin("entrar",{rota:"#/checkout"});return viewPontosAviso("Entre com uma conta de anunciante para concluir a compra.")}
  if(!S.carrinho.length&&CHK.etapa!==3)return viewCarrinho();
  const u=me();
  const passos=["Seus dados","Pagamento","Confirmação"];
  const stepper=`<div class="stepper">${passos.map((t,i)=>{
    const n=i+1,cls=CHK.etapa===n?"on":CHK.etapa>n?"done":"";
    return `<div class="stp ${cls}"><i>${CHK.etapa>n?"✓":n}</i>${t}</div>${i<2?'<div class="stp-line"></div>':""}`}).join("")}</div>`;
  let corpo="";
  if(CHK.etapa===1){
    corpo=`<form class="card pad-lg" data-form="chk1" novalidate>
      <h3 style="font-size:17px;margin-bottom:20px">Dados do anunciante</h3>
      <div class="grid-2">
        <div class="field"><input id="ck-nome" placeholder=" " value="${esc(CHK.dados.nome||u.nome)}" required><label for="ck-nome">Nome</label></div>
        <div class="field"><input id="ck-empresa" placeholder=" " value="${esc(CHK.dados.empresa||u.empresa||"")}" required><label for="ck-empresa">Empresa</label></div>
      </div>
      <div class="grid-2">
        <div class="field"><input id="ck-cnpj" placeholder=" " value="${esc(CHK.dados.cnpj||u.cnpj||"")}" required><label for="ck-cnpj">CNPJ</label></div>
        <div class="field"><input id="ck-tel" placeholder=" " value="${esc(CHK.dados.tel||u.tel||"")}" required><label for="ck-tel">Telefone</label></div>
      </div>
      <div class="field"><input id="ck-email" type="email" placeholder=" " value="${esc(CHK.dados.email||u.email)}" required><label for="ck-email">E-mail</label></div>
      <div class="form-msg" id="ck1-msg"></div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Ir para o pagamento</button>
    </form>`;
  }else if(CHK.etapa===2){
    corpo=`<form class="card pad-lg" data-form="chk2" novalidate>
      <div class="flex items-center justify-between mb-24">
        <h3 style="font-size:17px">Pagamento</h3>
        <span class="badge no-dot badge-info">Simulação acadêmica</span>
      </div>
      <div class="card pad mb-24" style="background:#101014">
        <div class="flex items-center gap-10"><span class="accent">${I.money.replace("<svg",'<svg width="20" height="20"')}</span>
        <div><div class="ink" style="font-size:14.5px;font-weight:600">Cartão de crédito</div>
        <div class="tiny">Único meio de pagamento habilitado nesta versão.</div></div></div>
      </div>
      <div class="field"><input id="cc-nome" placeholder=" " required><label for="cc-nome">Nome impresso no cartão</label></div>
      <div class="field"><input id="cc-num" placeholder=" " inputmode="numeric" maxlength="19" required><label for="cc-num">Número do cartão</label></div>
      <div class="grid-2">
        <div class="field"><input id="cc-val" placeholder=" " maxlength="5" required><label for="cc-val">Validade (MM/AA)</label></div>
        <div class="field"><input id="cc-cvv" placeholder=" " inputmode="numeric" maxlength="4" required><label for="cc-cvv">CVV</label></div>
      </div>
      <div class="form-msg" id="ck2-msg"></div>
      <div class="flex gap-10">
        <button class="btn btn-ghost" type="button" data-act="chk-voltar">Voltar</button>
        <button class="btn btn-lg btn-primary" style="flex:1" type="submit">Pagar ${brl(totalCarrinho())}</button>
      </div>
      <p class="tiny mt-16" style="margin-bottom:0">Nenhum dado de cartão é enviado ou armazenado — o pagamento é aprovado automaticamente para fins de demonstração.</p>
    </form>`;
  }else{
    const ped=S.pedidos.find(x=>x.id===CHK.pedidoId);
    corpo=`<div class="card pad-lg" style="text-align:center">
      <div class="success-ring">${I.check.replace("17","30").replace("17","30")}</div>
      <h2 class="h-page">Pagamento aprovado</h2>
      <p class="lede" style="margin:12px auto 0">Pedido ${esc(CHK.pedidoId)} confirmado. Suas campanhas já foram criadas — agora é só enviar as artes.</p>
      <div class="spec-list mt-32" style="text-align:left;max-width:460px;margin-inline:auto">
        ${ped?ped.itens.map(i=>{const p=ponto(i.pontoId);return `<div class="spec-row"><span>${esc(p.nome)}</span><span>${dBR(i.inicio)} → ${dBR(i.fim)}</span></div>`}).join(""):""}
        <div class="spec-row"><span>Total pago</span><span class="price" style="font-size:18px">${brl(ped?ped.total:0)}</span></div>
      </div>
      <div class="flex gap-10 mt-32" style="justify-content:center;flex-wrap:wrap">
        <a class="btn btn-lg btn-primary" href="#/alugados">Ir para Meus Pontos Alugados</a>
        <a class="btn btn-ghost" href="#/pedidos">Ver pedido</a>
      </div>
    </div>`;
  }
  const resumo=CHK.etapa===3?"":`<div class="card pad-lg sticky-buy">
      <h3 style="font-size:17px;margin-bottom:16px">Seu pedido</h3>
      ${S.carrinho.map(i=>{const p=ponto(i.pontoId);return `<div class="line-item">
        <div class="li-thumb">${imgTag(capaPonto(p),p.nome)}</div>
        <div style="flex:1;min-width:0"><div class="ink" style="font-size:14px;font-weight:600">${esc(p.nome)}</div>
        <div class="tiny">${dBR(i.inicio)} · ${i.dias} dias</div></div>
        <div class="nowrap" style="font-size:14px">${brl(p.valor*(i.dias/14))}</div></div>`}).join("")}
      <div class="spec-list mt-16"><div class="spec-row"><span>Total</span><span class="price" style="font-size:20px">${brl(totalCarrinho())}</span></div></div>
    </div>`;
  return `<div class="wrap section-tight">
    <h1 class="h-page">Finalizar compra</h1>
    <div class="mt-24">${stepper}</div>
    ${CHK.etapa===3?corpo:`<div class="two-col">${corpo}${resumo}</div>`}
  </div>`;
}
/* checkout de verdade: o servidor recalcula o preço a partir do banco —
   o valor local (S.carrinho) é só o que mostramos antes de confirmar. */
async function concluirPedido(pagamento){
  const itens=S.carrinho.map(i=>({pontoId:i.pontoId,inicio:i.inicio,dias:i.dias}));
  const r=await api("/pedidos",{method:"POST",body:{itens,pagamento,dados:CHK.dados}});
  const ped=normPedido(r.pedido);
  S.pedidos.push(ped);
  S.carrinho=[];salvarCarrinho();
  S._clienteCarregado=false; /* a próxima visita a "Minhas campanhas" busca as campanhas novas */
  CHK.pedidoId=ped.id;CHK.etapa=3;
  return ped.id;
}

/* ============================================================
   12. COMPONENTES DE PAINEL
   ============================================================ */
function shell(inner,titulo,acoes){
  const r=papel();if(!r)return inner;
  const itens=SIDEBAR[r]||[];
  const cur=route();
  const side=`<aside class="side">
    <div class="side-label">${r==="cliente"?"Área do anunciante":r==="empresa"?"Área do parceiro":"Administração"}</div>
    ${itens.map(([h,t,ic])=>`<a href="${h}" class="${cur===h?"active":""}">${I[ic].replace("<svg",'<svg width="18" height="18"')}<span class="lbl">${t}</span></a>`).join("")}
    <div class="side-collapse"><a href="#/config" class="${cur==="#/config"?"active":""}">${I.gear.replace("<svg",'<svg width="18" height="18"')}<span class="lbl">Configurações</span></a>
    <button class="side-toggle" data-act="toggle-side" style="display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border:0;background:none;color:var(--muted);font-size:14.5px;cursor:pointer;border-radius:8px">${I.arrow.replace("<svg",'<svg width="18" height="18" style="transform:rotate(180deg)"')}<span class="lbl">Recolher menu</span></button></div>
  </aside>`;
  const head=titulo?`<div class="panel-head"><div><h1 class="h-page">${titulo}</h1>${acoes&&acoes.sub?`<p class="small mt-8" style="margin-bottom:0">${acoes.sub}</p>`:""}</div>${acoes&&acoes.html?`<div class="flex gap-10 wrapf">${acoes.html}</div>`:""}</div>`:"";
  return `<div class="panel ${S.ui.sideCollapsed?"collapsed":""}">${side}<div class="panel-body">${head}${inner}</div></div>`;
}
const kpi=(cap,val,delta,hero)=>`<div class="kpi ${hero?"hero-num":""}"><div class="k-cap">${cap}</div><div class="k-num">${val}</div>${delta?`<div class="k-delta ${delta.dir||""}">${delta.dir==="up"?"▲":delta.dir==="down"?"▼":"•"} ${delta.txt}</div>`:""}</div>`;
function barChart(dados,cap,titulo,fmt){
  const max=Math.max(...dados.map(d=>d[1]),1);
  return `<div class="chart-card"><h3>${titulo}</h3><p class="chart-cap">${cap}</p>
    <div class="bars">${dados.map((d,i)=>`<div class="bar-col" title="${esc(d[0])}: ${(fmt||brlShort)(d[1])}">
      <span class="tiny nowrap">${(fmt||brlShort)(d[1])}</span>
      <div class="bar ${i===dados.length-1?"":"mute"}" style="height:${Math.max(4,(d[1]/max)*128)}px"></div>
      <span class="bar-lab">${esc(d[0])}</span></div>`).join("")}</div></div>`;
}
function hBarChart(dados,cap,titulo,fmt){
  const max=Math.max(...dados.map(d=>d[1]),1);
  return `<div class="chart-card"><h3>${titulo}</h3><p class="chart-cap">${cap}</p>
    ${dados.map((d,i)=>`<div class="hbar-row"><span class="tiny nowrap" style="overflow:hidden;text-overflow:ellipsis">${esc(d[0])}</span>
      <div class="hbar-track"><i class="hbar-fill ${i?"mute":""}" style="width:${(d[1]/max)*100}%"></i></div>
      <span class="tiny nowrap" style="text-align:right">${(fmt||num)(d[1])}</span></div>`).join("")}</div>`;
}
function tabela(titulo,cap,cols,linhas,vazio){
  return `<div class="card"><div class="pad" style="border-bottom:1px solid var(--border)">
    <h3 style="font-size:16px">${titulo}</h3>${cap?`<p class="tiny" style="margin:6px 0 0">${cap}</p>`:""}</div>
    ${linhas.length?`<div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${linhas.join("")}</tbody></table></div>`:`<div class="empty"><div class="big">${esc(vazio||"Nada por aqui ainda")}</div></div>`}</div>`;
}
const badgeCamp=st=>`<span class="badge ${ST_CAMP[st].cls}">${ST_CAMP[st].label}</span>`;
const badgeArq=st=>`<span class="badge ${ST_ARQ[st].cls}">${ST_ARQ[st].label}</span>`;
function ultimos6Meses(){
  const out=[],base=today();
  for(let i=5;i>=0;i--){
    const d=new Date(base.getFullYear(),base.getMonth()-i,1);
    const total=S.pedidos.filter(p=>{const x=new Date(p.criadoEm);return x.getFullYear()===d.getFullYear()&&x.getMonth()===d.getMonth()}).reduce((a,p)=>a+p.total,0);
    out.push([d.toLocaleDateString("pt-BR",{month:"short"}).replace(".",""),total]);
  }
  return out;
}

/* ============================================================
   13. ÁREA DO CLIENTE
   ============================================================ */
const minhasCampanhas=()=>{const u=me();return u?S.campanhas.filter(c=>c.userId===u.id):[]};
function viewPainelCliente(){
  const cs=minhasCampanhas();
  const arqs=cs.flatMap(c=>c.arquivos);
  const inner=`
    <div class="kpis">
      ${kpi("Campanhas ativas",cs.filter(c=>c.status==="exibicao").length,null,true)}
      ${kpi("Campanhas pendentes",cs.filter(c=>["preparacao","analise"].includes(c.status)).length)}
      ${kpi("Artes enviadas",arqs.length)}
      ${kpi("Artes aprovadas",arqs.filter(a=>a.status==="aprovada").length)}
    </div>
    <div class="grid-2c mt-24">
      ${tabela("Suas campanhas mais recentes","O que está em preparação, em análise ou no ar agora.",["Campanha","Ponto","Status"],
        cs.slice(0,5).map(c=>{const p=ponto(c.pontoId);return `<tr><td class="ink">${esc(c.nome||"—")}</td><td>${esc(p?p.nome:"—")}</td><td>${badgeCamp(c.status)}</td></tr>`}),
        "Você ainda não contratou nenhum ponto")}
      <div class="card pad-lg">
        <h3 style="font-size:16px;margin-bottom:6px">Próximos passos</h3>
        <p class="tiny" style="margin-bottom:20px">Resolva estes itens para suas campanhas entrarem no ar.</p>
        ${(()=>{
          const semArte=cs.filter(c=>!arquivoAtual(c));
          const reprovadas=cs.filter(c=>arquivoAtual(c)&&arquivoAtual(c).status==="reprovada");
          const rows=[];
          if(semArte.length)rows.push(`<div class="attn-row" style="padding-inline:0"><span class="attn-dot" style="background:var(--warn)"></span><div class="txt"><div class="ink" style="font-size:14.5px">${semArte.length} campanha(s) sem arte enviada</div><div class="tiny">O ponto só entra no ar depois do envio.</div></div><a class="btn btn-sm btn-ghost" href="#/arquivos">Enviar</a></div>`);
          if(reprovadas.length)rows.push(`<div class="attn-row" style="padding-inline:0"><span class="attn-dot" style="background:var(--danger)"></span><div class="txt"><div class="ink" style="font-size:14.5px">${reprovadas.length} arte(s) reprovada(s)</div><div class="tiny">Leia o motivo e reenvie o arquivo corrigido.</div></div><a class="btn btn-sm btn-ghost" href="#/alugados">Ver motivo</a></div>`);
          if(!rows.length)return `<div class="empty" style="padding:30px 0"><div class="big">Tudo em dia.</div><p class="small">Nenhuma pendência nas suas campanhas.</p></div>`;
          return rows.join("");
        })()}
      </div>
    </div>
    <div class="mt-24">${tabela("Seus pedidos","Histórico de contratações e valores pagos.",["Pedido","Data","Pontos","Total","Status"],
      S.pedidos.filter(p=>p.userId===me().id).slice(0,5).map(p=>`<tr><td class="ink">${p.id}</td><td>${dBR(p.criadoEm)}</td><td>${p.itens.length}</td><td>${brl(p.total)}</td><td><span class="badge badge-ok">Pago</span></td></tr>`),
      "Nenhum pedido realizado")}</div>`;
  return shell(inner,"Meu Painel",{sub:"Resumo das suas campanhas de mídia exterior.",html:`<a class="btn btn-primary" href="#/pontos">${I.plus} Contratar novo ponto</a>`});
}
function viewAlugados(){
  const cs=minhasCampanhas();
  if(!cs.length)return shell(`<div class="card pad-lg"><div class="empty"><div class="big">Você ainda não alugou nenhum ponto</div>
    <p class="small">Escolha um ponto no mapa e finalize a contratação para começar.</p>
    <a class="btn btn-primary mt-16" href="#/pontos">Explorar Pontos Disponíveis</a></div></div>`,"Meus Pontos Alugados");
  const cards=cs.map(c=>{
    const p=ponto(c.pontoId),a=arquivoAtual(c);
    const total=Math.max(1,daysBetween(c.inicio,c.fim));
    const passado=clamp(daysBetween(c.inicio,today()),0,total);
    const pct=Math.round(passado/total*100);
    return `<div class="card" style="overflow:hidden">
      <div class="point-thumb" style="aspect-ratio:16/9">${imgTag(capaPonto(p),p.nome)}
        <div class="thumb-tag">${badgeCamp(c.status)}</div></div>
      <div class="pad">
        <div class="tiny">${esc(TIPOS[p.tipo].curto)} · ${esc(p.cidade)}</div>
        <h3 style="font-size:16.5px;margin:2px 0 14px">${esc(p.nome)}</h3>
        <div class="flex justify-between tiny mb-8"><span>${dBR(c.inicio)} → ${dBR(c.fim)}</span><span>${c.status==="finalizada"?"Concluída":pct+"%"}</span></div>
        <div class="prog ${c.status==="exibicao"?"":"warn"}"><i style="width:${c.status==="finalizada"?100:pct}%"></i></div>
        ${a?`<div class="mt-16">
            <div class="flex items-center justify-between gap-10 mb-8"><span class="tiny">Arte enviada</span>${badgeArq(a.status)}</div>
            <div class="media-preview">${a.tipo&&a.tipo.startsWith("video")
              ? (a.data?`<video src="${a.data}" controls muted playsinline></video>`:`<div class="pad tiny">Vídeo ${esc(a.nome)}</div>`)
              : (a.data?`<img src="${a.data}" alt="Arte enviada">`:`<div class="pad tiny">${esc(a.nome)}</div>`)}</div>
            ${a.status==="reprovada"?`<div class="card pad mt-16" style="border-color:rgba(255,92,92,.35);background:rgba(255,92,92,.06)">
              <div class="tiny" style="color:var(--danger);margin-bottom:4px">Motivo da reprovação</div>
              <div class="small" style="color:var(--ink)">${esc(a.motivo||"")}</div></div>`:""}
            ${a.status==="aprovada"?`<div class="mt-16">${mockupHTML(p,a)}</div>`:""}
            ${c.arquivos.length>1?`<button class="btn-link mt-16" data-act="historico" data-id="${c.id}">Ver histórico de versões (${c.arquivos.length})</button>`:""}
          </div>`:`<div class="card pad mt-16" style="background:#101014"><div class="tiny">Nenhuma arte enviada para este ponto ainda.</div></div>`}
        <div class="card-actions mt-16">
          <button class="btn btn-sm btn-primary" data-act="upload" data-id="${c.id}">${a?"Trocar Arte":"Enviar Arte"}</button>
          <a class="btn btn-sm btn-ghost" href="#/ponto/${p.id}">Ver Detalhes do Ponto</a>
        </div>
      </div>
    </div>`}).join("");
  return shell(`<div class="grid-cards">${cards}</div>`,"Meus Pontos Alugados",{sub:"Cada ponto tem sua própria arte, seu próprio período e seu próprio status."});
}
function viewCampanhasCliente(){
  const cs=minhasCampanhas();
  const linhas=cs.map(c=>{const p=ponto(c.pontoId);
    return `<tr><td class="ink">${esc(c.nome||"—")}</td><td>${esc(p?p.nome:"—")}</td><td>${badgeCamp(c.status)}</td>
    <td class="nowrap">${dBR(c.inicio)} → ${dBR(c.fim)}</td>
    <td><button class="btn btn-sm btn-ghost" data-act="upload" data-id="${c.id}">${arquivoAtual(c)?"Trocar arte":"Enviar arte"}</button></td></tr>`});
  return shell(tabela("Minhas campanhas","Uma linha por ponto contratado. O status muda sozinho conforme a arte é aprovada.",
    ["Campanha","Ponto","Status","Período",""],linhas,"Nenhuma campanha ainda"),"Minhas Campanhas");
}
function viewArquivosCliente(){
  const cs=minhasCampanhas();
  const cards=cs.map(c=>{
    const p=ponto(c.pontoId),a=arquivoAtual(c);
    return `<div class="card pad">
      <div class="flex items-center gap-10 mb-16">
        <div class="li-thumb">${imgTag(capaPonto(p),p.nome)}</div>
        <div style="min-width:0"><div class="ink" style="font-weight:600;font-size:14.5px">${esc(p.nome)}</div>
        <div class="tiny">${esc(c.nome||"")} · aceita ${p.formatos.join(" e ")}</div></div>
      </div>
      <div class="flex items-center justify-between gap-10">
        <span class="tiny">${a?`Último envio: ${esc(a.nome)} · ${dBR(a.enviadoEm)}`:"Nenhum arquivo enviado"}</span>
        ${a?badgeArq(a.status):""}
      </div>
      <button class="btn btn-sm btn-primary btn-block mt-16" data-act="upload" data-id="${c.id}">${a?"Enviar nova versão":"Enviar arquivo"}</button>
    </div>`}).join("");
  const inner=`<div class="card pad-lg mb-24">
      <h3 style="font-size:16px;margin-bottom:6px">Como funciona o envio</h3>
      <p class="small" style="margin-bottom:0">Cada ponto contratado tem seu próprio arquivo. Envie PNG para painéis impressos e MP4 para telas digitais. Depois do envio, a arte vai para análise do administrador e você é avisado aqui mesmo quando for aprovada ou reprovada.</p>
    </div>
    ${cs.length?`<div class="grid-cards">${cards}</div>`:`<div class="card pad-lg"><div class="empty"><div class="big">Nenhum ponto contratado</div><a class="btn btn-primary mt-16" href="#/pontos">Explorar Pontos Disponíveis</a></div></div>`}`;
  return shell(inner,"Envio de Arquivos",{sub:"Um arquivo independente por ponto — nada é compartilhado entre campanhas."});
}
function viewPedidosCliente(){
  const ps=S.pedidos.filter(p=>p.userId===me().id);
  const linhas=ps.map(p=>`<tr>
    <td class="ink">${p.id}</td><td>${dBR(p.criadoEm)}</td>
    <td>${p.itens.map(i=>esc((ponto(i.pontoId)||{}).nome||"")).join("<br>")}</td>
    <td class="nowrap">${brl(p.total)}</td>
    <td><span class="badge badge-ok">Pago</span></td>
    <td class="tiny">${p.pagamento?`${p.pagamento.bandeira||"Cartão"} ····${p.pagamento.final||""}`:"—"}</td></tr>`);
  return shell(tabela("Meus pedidos","Todas as contratações feitas na plataforma, com forma de pagamento.",
    ["Pedido","Data","Pontos","Total","Status","Pagamento"],linhas,"Nenhum pedido ainda"),"Meus Pedidos");
}

/* ============================================================
   14. ÁREA DA EMPRESA PARCEIRA
   ============================================================ */
const campanhasDaEmpresa=()=>{const ids=meusPontos().map(p=>p.id);return S.campanhas.filter(c=>ids.includes(c.pontoId))};
function viewPainelEmpresa(){
  const ps=meusPontos(),cs=campanhasDaEmpresa();
  const receita=cs.filter(c=>c.valor!=null).reduce((a,c)=>a+c.valor,0);
  const inner=`
    <div class="kpis">
      ${kpi("Total de pontos",ps.length)}
      ${kpi("Pontos ativos",ps.filter(p=>p.status!=="manutencao").length)}
      ${kpi("Campanhas ativas",cs.filter(c=>c.status==="exibicao").length,null,true)}
      ${kpi("Receita simulada",brlShort(receita))}
    </div>
    <div class="grid-2c mt-24">
      ${tabela("Campanhas nos seus pontos","O que está no ar ou aguardando arte nos painéis da sua empresa.",
        ["Ponto","Cliente","Status","Período"],
        cs.slice(0,6).map(c=>`<tr><td class="ink">${esc((ponto(c.pontoId)||{}).nome||"")}</td>
        <td>${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td>
        <td>${badgeCamp(c.status)}</td><td class="nowrap">${dBR(c.inicio)} → ${dBR(c.fim)}</td></tr>`),
        "Nenhuma campanha nos seus pontos")}
      ${hBarChart(ps.map(p=>[p.nome,campanhasDoPonto(p.id).length]).sort((a,b)=>b[1]-a[1]).slice(0,5),
        "Quantas campanhas cada ponto já recebeu. Barras maiores indicam pontos mais procurados.","Seus pontos mais locados",num)}
    </div>
    <div class="mt-24">${tabela("Ocupação dos seus pontos","Situação atual de cada painel cadastrado.",
      ["Ponto","Cidade","Formato","Valor","Situação"],
      ps.map(p=>`<tr><td class="ink">${esc(p.nome)}</td><td>${esc(p.cidade)}</td><td>${TIPOS[p.tipo].curto}</td>
      <td class="nowrap">${brl(p.valor)}</td><td><span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span></td></tr>`),
      "Nenhum ponto cadastrado")}</div>`;
  return shell(inner,"Painel da Empresa",{sub:"Você vê apenas os pontos cadastrados pela sua empresa.",html:`<button class="btn btn-primary" data-act="novo-ponto">${I.plus} Cadastrar ponto</button>`});
}
function viewPontosEmpresa(){
  const ps=meusPontos();
  const cards=ps.map(p=>`<div class="card" style="overflow:hidden">
    <div class="point-thumb" style="aspect-ratio:16/9">${imgTag(capaPonto(p),p.nome)}
      <div class="thumb-tag"><span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span></div></div>
    <div class="pad">
      <div class="tiny">${TIPOS[p.tipo].curto} · ${esc(p.cidade)}</div>
      <h3 style="font-size:16px;margin:2px 0 10px">${esc(p.nome)}</h3>
      <div class="price" style="font-size:18px">${brl(p.valor)} <small>/bissemana</small></div>
      <div class="tiny mt-8">${p.fotos.length} foto(s) · ${campanhasDoPonto(p.id).length} campanha(s)</div>
      <div class="card-actions">
        <button class="btn btn-sm btn-ghost" data-act="editar-ponto" data-id="${p.id}">${I.edit} Editar</button>
        <button class="btn btn-sm btn-ghost" data-act="fotos-ponto" data-id="${p.id}">${I.img.replace("<svg",'<svg width="15" height="15"')} Fotos</button>
      </div>
      <div class="card-actions" style="margin-top:8px">
        <a class="btn btn-sm btn-ghost" href="#/ponto/${p.id}">${I.eye} Ver anúncio</a>
        <button class="btn btn-sm btn-danger" data-act="excluir-ponto" data-id="${p.id}">${I.trash}</button>
      </div>
    </div></div>`).join("");
  const inner=ps.length?`<div class="grid-cards">${cards}</div>`
    :`<div class="card pad-lg"><div class="empty"><div class="big">Cadastre seu primeiro ponto</div><p class="small">Publique um painel para começar a receber pedidos de anunciantes.</p><button class="btn btn-primary mt-16" data-act="novo-ponto">Cadastrar ponto</button></div></div>`;
  return shell(inner,"Meus Pontos Cadastrados",{sub:"Crie, edite, publique fotos e defina a situação de cada painel.",html:`<button class="btn btn-primary" data-act="novo-ponto">${I.plus} Cadastrar ponto</button>`});
}
function viewCampanhasEmpresa(){
  const cs=campanhasDaEmpresa();
  const linhas=cs.map(c=>{const p=ponto(c.pontoId),a=arquivoAtual(c);
    return `<tr><td class="ink">${esc(p.nome)}</td><td>${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td>
      <td>${badgeCamp(c.status)}</td><td class="nowrap">${dBR(c.inicio)} → ${dBR(c.fim)}</td>
      <td>${a?badgeArq(a.status):'<span class="tiny">sem arte</span>'}</td>
      <td>${a&&a.status==="aprovada"?`<button class="btn btn-sm btn-ghost" data-act="ver-arte" data-id="${c.id}">Ver veiculação</button>`:""}</td></tr>`});
  return shell(tabela("Campanhas nos meus pontos","Quem está anunciando em cada painel da sua empresa e em que situação está a arte.",
    ["Ponto","Cliente","Status","Período","Arte",""],linhas,"Nenhuma campanha ainda"),"Campanhas nos Meus Pontos");
}
function viewArtesEmpresa(){
  const cs=campanhasDaEmpresa().filter(c=>arquivoAtual(c));
  const linhas=cs.map(c=>{const a=arquivoAtual(c),p=ponto(c.pontoId);
    return `<tr><td class="ink">${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td><td>${esc(p.nome)}</td>
      <td>${esc(a.nome)}</td><td class="nowrap">${dBR(a.enviadoEm)}</td><td>${badgeArq(a.status)}</td>
      <td><button class="btn btn-sm btn-ghost" data-act="ver-arte" data-id="${c.id}">Visualizar</button></td></tr>`});
  return shell(`<div class="card pad mb-24" style="background:#101014">
      <p class="small" style="margin:0">A aprovação final das artes é feita pela administração da plataforma. Aqui você acompanha o que foi enviado para os seus pontos e sinaliza problemas técnicos.</p></div>
    ${tabela("Artes enviadas para os seus pontos","Cada linha é o arquivo mais recente de uma campanha.",
      ["Cliente","Ponto","Arquivo","Enviado em","Status",""],linhas,"Nenhuma arte enviada ainda")}`,"Aprovação de Artes");
}
function viewFinanceiroEmpresa(){
  /* usa o valor já embutido em cada campanha (vindo do pedido_pontos no
     servidor) — a empresa parceira não tem acesso à lista de pedidos,
     só de campanhas dos próprios pontos. */
  const itens=campanhasDaEmpresa().filter(c=>c.valor!=null);
  const receita=itens.reduce((a,c)=>a+c.valor,0);
  const comissao=receita*.15;
  const meses=(()=>{const out=[],base=today();
    for(let i=5;i>=0;i--){const d=new Date(base.getFullYear(),base.getMonth()-i,1);
      const t=itens.filter(c=>{const y=new Date(c.criadoEm);return y.getMonth()===d.getMonth()&&y.getFullYear()===d.getFullYear()}).reduce((a,c)=>a+c.valor,0);
      out.push([d.toLocaleDateString("pt-BR",{month:"short"}).replace(".",""),t])}return out})();
  const inner=`<div class="kpis">
      ${kpi("Receita simulada",brlShort(receita),null,true)}
      ${kpi("Repasse à plataforma (15%)",brlShort(comissao))}
      ${kpi("Líquido estimado",brlShort(receita-comissao))}
      ${kpi("Contratações",itens.length)}
    </div>
    <div class="mt-24">${barChart(meses,"Valor contratado nos seus pontos, mês a mês. A última barra é o mês atual.","Receita por mês")}</div>
    <div class="mt-24">${tabela("Extrato de contratações","Cada linha é uma campanha contratada num dos seus pontos.",
      ["Cliente","Ponto","Período","Valor bruto","Repasse (15%)","Líquido"],
      itens.map(c=>`<tr><td class="ink">${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td><td>${esc((ponto(c.pontoId)||{}).nome||"")}</td>
      <td class="nowrap">${dBR(c.inicio)} → ${dBR(c.fim)}</td><td class="nowrap">${brl(c.valor)}</td>
      <td class="nowrap">${brl(c.valor*.15)}</td><td class="nowrap ink">${brl(c.valor*.85)}</td></tr>`),
      "Nenhuma contratação registrada")}</div>`;
  return shell(inner,"Financeiro",{sub:"Valores simulados para fins de demonstração acadêmica."});
}

/* ============================================================
   15. ÁREA DO ADMINISTRADOR
   ============================================================ */
function viewAdmin(){
  const pend=pendentesAprovacao(),emps=empresasPendentes(),venc=campanhasVencendo();
  const atencao=[];
  if(pend.length)atencao.push(["var(--warn)",`${pend.length} arte(s) aguardando aprovação`,"Revisar","#/admin/aprovacoes"]);
  if(emps.length)atencao.push(["var(--info)",`${emps.length} empresa(s) aguardando cadastro`,"Aprovar","#/admin/empresas"]);
  if(venc.length)atencao.push(["var(--danger)",`${venc.length} campanha(s) vence(m) em até 5 dias`,"Ver","#/admin/campanhas"]);
  const clientes=S.users.filter(u=>u.papel==="cliente");
  const mom=(v)=>({dir:v>=0?"up":"down",txt:(v>=0?"+":"")+v+"% vs. mês anterior"});
  const inner=`
    <div class="card mb-32">
      <div class="pad" style="border-bottom:1px solid var(--border)">
        <h3 style="font-size:16px">Precisa da sua atenção</h3>
        <p class="tiny" style="margin:6px 0 0">Itens parados esperando uma decisão sua.</p>
      </div>
      ${atencao.length?atencao.map(([cor,txt,btn,href])=>`<div class="attn-row">
        <span class="attn-dot" style="background:${cor}"></span>
        <div class="txt"><div class="ink" style="font-size:15px">${txt}</div></div>
        <a class="btn btn-sm btn-primary" href="${href}">${btn}</a></div>`).join("")
        :`<div class="empty"><div class="big">Tudo em dia.</div><p class="small">Nenhuma pendência aguardando aprovação.</p></div>`}
    </div>

    <h3 style="font-size:16px;margin-bottom:6px">Visão geral</h3>
    <p class="tiny mb-16">Números da plataforma hoje, com a variação em relação ao mês passado.</p>
    <div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
      ${kpi("Clientes",clientes.length,mom(12))}
      ${kpi("Empresas",S.empresas.length,mom(8))}
      ${kpi("Pontos",S.pontos.length,mom(0))}
      ${kpi("Campanhas ativas",S.campanhas.filter(c=>c.status==="exibicao").length,mom(25),true)}
      ${kpi("Receita simulada",brlShort(receitaTotal()),mom(-4))}
    </div>

    <h3 style="font-size:16px;margin:40px 0 6px">Desempenho</h3>
    <p class="tiny mb-16">Duas leituras rápidas do negócio. O detalhamento completo está em Relatórios.</p>
    <div class="grid-2c">
      ${barChart(ultimos6Meses(),"Soma dos pedidos pagos em cada mês. Compare a altura das barras para ver a tendência.","Receita por mês")}
      ${hBarChart(S.pontos.map(p=>[p.nome,campanhasDoPonto(p.id).length]).sort((a,b)=>b[1]-a[1]).slice(0,5),
        "Os cinco pontos com mais campanhas contratadas desde o início.","Pontos mais locados",num)}
    </div>`;
  return shell(inner,"Painel Administrativo",{sub:"Bem-vinda, "+ (me()?me().nome.split(" ")[0]:"") +". Comece pelo que está pendente."});
}
function viewAdminPontos(){
  const linhas=S.pontos.map(p=>`<tr>
    <td><div class="flex items-center gap-10"><div class="li-thumb" style="width:56px;height:38px">${imgTag(capaPonto(p),p.nome)}</div>
    <span class="ink">${esc(p.nome)}</span></div></td>
    <td>${esc((empresa(p.empresaId)||{}).nome||"—")}</td><td>${esc(p.cidade)}</td><td>${TIPOS[p.tipo].curto}</td>
    <td class="nowrap">${brl(p.valor)}</td><td><span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span></td>
    <td><div class="flex gap-6">
      <button class="btn btn-sm btn-ghost" data-act="editar-ponto" data-id="${p.id}">${I.edit}</button>
      <button class="btn btn-sm btn-ghost" data-act="fotos-ponto" data-id="${p.id}">${I.img.replace("<svg",'<svg width="15" height="15"')}</button>
      <button class="btn btn-sm btn-danger" data-act="excluir-ponto" data-id="${p.id}">${I.trash}</button></div></td></tr>`);
  return shell(tabela("Todos os pontos da plataforma","Inclui pontos de todas as empresas parceiras. O administrador pode editar fotos de qualquer ponto.",
    ["Ponto","Empresa","Cidade","Formato","Valor","Situação","Ações"],linhas,"Nenhum ponto cadastrado"),
    "Gestão de Pontos",{html:`<button class="btn btn-primary" data-act="novo-ponto">${I.plus} Cadastrar ponto</button>`});
}
function viewAdminClientes(){
  const cs=S.users.filter(u=>u.papel==="cliente");
  const linhas=cs.map(u=>{
    const camps=S.campanhas.filter(c=>c.userId===u.id).length;
    const gasto=S.pedidos.filter(p=>p.userId===u.id).reduce((a,p)=>a+p.total,0);
    return `<tr><td class="ink">${esc(u.nome)}</td><td>${esc(u.empresa||"—")}</td><td>${esc(u.email)}</td>
      <td>${camps}</td><td class="nowrap">${brl(gasto)}</td>
      <td><span class="badge ${u.status==="ativo"?"badge-ok":"badge-danger"}">${u.status==="ativo"?"Ativo":"Bloqueado"}</span></td>
      <td><div class="flex gap-6">
        <button class="btn btn-sm btn-ghost" data-act="editar-user" data-id="${u.id}">${I.edit}</button>
        <button class="btn btn-sm btn-ghost" data-act="bloquear-user" data-id="${u.id}">${u.status==="ativo"?"Bloquear":"Desbloquear"}</button>
        <button class="btn btn-sm btn-danger" data-act="excluir-user" data-id="${u.id}">${I.trash}</button></div></td></tr>`});
  return shell(tabela("Clientes anunciantes","Contas que contratam pontos. Bloquear impede novas contratações sem apagar o histórico.",
    ["Nome","Empresa","E-mail","Campanhas","Total contratado","Situação","Ações"],linhas,"Nenhum cliente cadastrado"),"Gestão de Clientes");
}
function viewAdminEmpresas(){
  const linhas=S.empresas.map(e=>{
    const n=S.pontos.filter(p=>p.empresaId===e.id).length;
    return `<tr><td class="ink">${esc(e.nome)}</td><td>${esc(e.cnpj)}</td><td>${esc(e.cidade)}</td><td>${n}</td>
      <td><span class="badge ${e.status==="ativa"?"badge-ok":"badge-warn"}">${e.status==="ativa"?"Ativa":"Aguardando aprovação"}</span></td>
      <td><div class="flex gap-6">
        ${e.status==="pendente"?`<button class="btn btn-sm btn-primary" data-act="aprovar-empresa" data-id="${e.id}">Aprovar</button>`:""}
        <button class="btn btn-sm btn-ghost" data-act="editar-empresa" data-id="${e.id}">${I.edit}</button>
        <button class="btn btn-sm btn-danger" data-act="excluir-empresa" data-id="${e.id}">${I.trash}</button></div></td></tr>`});
  return shell(tabela("Empresas parceiras","Exibidores cadastrados. Empresas aguardando aprovação não aparecem no site público.",
    ["Empresa","CNPJ","Cidade","Pontos","Situação","Ações"],linhas,"Nenhuma empresa cadastrada"),"Gestão de Empresas");
}
let FCAMP={cliente:"",empresa:"",cidade:"",status:""};
function viewAdminCampanhas(){
  let cs=S.campanhas;
  if(FCAMP.cliente)cs=cs.filter(c=>c.userId===FCAMP.cliente);
  if(FCAMP.empresa)cs=cs.filter(c=>(ponto(c.pontoId)||{}).empresaId===FCAMP.empresa);
  if(FCAMP.cidade)cs=cs.filter(c=>(ponto(c.pontoId)||{}).cidade===FCAMP.cidade);
  if(FCAMP.status)cs=cs.filter(c=>c.status===FCAMP.status);
  const cidades=[...new Set(S.pontos.map(p=>p.cidade))];
  const sel=(id,label,opts,val)=>`<div class="field" style="margin:0;min-width:170px"><select data-fcamp="${id}">
    <option value="">${label}</option>${opts.map(([v,t])=>`<option value="${esc(v)}" ${val===v?"selected":""}>${esc(t)}</option>`).join("")}</select><label>${label}</label></div>`;
  const filtros=`<div class="flex gap-10 wrapf mb-24">
    ${sel("cliente","Cliente",S.users.filter(u=>u.papel==="cliente").map(u=>[u.id,u.empresa||u.nome]),FCAMP.cliente)}
    ${sel("empresa","Empresa",S.empresas.map(e=>[e.id,e.nome]),FCAMP.empresa)}
    ${sel("cidade","Cidade",cidades.map(c=>[c,c]),FCAMP.cidade)}
    ${sel("status","Status",Object.entries(ST_CAMP).map(([k,v])=>[k,v.label]),FCAMP.status)}
    <button class="btn btn-ghost" data-act="limpar-fcamp">Limpar filtros</button>
  </div>`;
  const linhas=cs.map(c=>{const p=ponto(c.pontoId)||{},a=arquivoAtual(c);
    return `<tr><td class="ink">${esc(c.nome||"—")}</td><td>${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td>
      <td>${esc(p.nome||"—")}</td><td>${esc((empresa(p.empresaId)||{}).nome||"—")}</td>
      <td>${badgeCamp(c.status)}</td><td class="nowrap">${dBR(c.inicio)} → ${dBR(c.fim)}</td>
      <td>${a?`<button class="btn btn-sm btn-ghost" data-act="ver-arte" data-id="${c.id}">Ver arte</button>`:'<span class="tiny">sem arte</span>'}</td></tr>`});
  return shell(filtros+tabela("Todas as campanhas","Use os filtros acima para achar rapidamente uma campanha específica.",
    ["Campanha","Cliente","Ponto","Empresa","Status","Período",""],linhas,"Nenhuma campanha com esses filtros"),"Gestão de Campanhas");
}
function viewAprovacoes(){
  const todos=S.campanhas.flatMap(c=>c.arquivos.map(a=>({c,a}))).sort((x,y)=>new Date(y.a.enviadoEm)-new Date(x.a.enviadoEm));
  const pend=todos.filter(x=>x.a.status==="analise"||x.a.status==="pendente");
  const linha=({c,a})=>{const p=ponto(c.pontoId)||{};
    return `<tr><td class="ink">${esc(c.usuarioEmpresa||c.usuarioNome||"—")}</td><td>${esc((empresa(p.empresaId)||{}).nome||"—")}</td>
      <td>${esc(p.nome||"—")}</td>
      <td><button class="btn-link" data-act="ver-arquivo" data-camp="${c.id}" data-arq="${a.id}">${esc(a.nome)}</button></td>
      <td class="nowrap">${dBR(a.enviadoEm)}</td><td>${badgeArq(a.status)}</td>
      <td><div class="flex gap-6">
        ${a.status==="analise"||a.status==="pendente"
          ?`<button class="btn btn-sm btn-primary" data-act="ver-arquivo" data-camp="${c.id}" data-arq="${a.id}">${I.eye} Revisar</button>`
          :`<button class="btn btn-sm btn-ghost" data-act="ver-arquivo" data-camp="${c.id}" data-arq="${a.id}">${I.eye} Ver</button>`}
      </div></td></tr>`};
  return shell(`
    <div class="card pad mb-24" style="background:#101014">
      <p class="small" style="margin:0">Clique em <strong style="color:var(--ink)">Revisar</strong> para ver o arquivo enviado — imagem ou vídeo — já posicionado sobre a foto real do painel, antes de decidir. Ao aprovar, a campanha passa automaticamente para <strong style="color:var(--ink)">Em exibição</strong> e a arte aparece na página pública do ponto, no painel do cliente e no painel da empresa. Ao reprovar, o motivo é enviado ao cliente, que pode subir uma nova versão.</p>
    </div>
    ${tabela("Aguardando sua decisão","Arquivos enviados pelos clientes que ainda não foram avaliados.",
      ["Cliente","Empresa","Ponto","Arquivo","Data","Status","Ações"],pend.map(linha),"Nenhuma arte pendente")}
    <div class="mt-24">${tabela("Histórico de avaliações","Todos os arquivos já enviados, incluindo versões anteriores.",
      ["Cliente","Empresa","Ponto","Arquivo","Data","Status","Ações"],todos.filter(x=>!pend.includes(x)).map(linha),"Nenhum arquivo avaliado ainda")}</div>`,
    "Central de Aprovação",{sub:pend.length?`${pend.length} arquivo(s) esperando análise.`:"Nenhuma pendência no momento."});
}
let RELTAB="comercial";
function viewRelatorios(){
  const tabs=[["comercial","Comercial"],["financeiro","Financeiro"],["operacional","Operacional"]];
  let corpo="";
  if(RELTAB==="comercial"){
    const porCidade={};S.campanhas.forEach(c=>{const p=ponto(c.pontoId);if(p)porCidade[p.cidade]=(porCidade[p.cidade]||0)+1});
    const porTipo={};S.campanhas.forEach(c=>{const p=ponto(c.pontoId);if(p)porTipo[TIPOS[p.tipo].curto]=(porTipo[TIPOS[p.tipo].curto]||0)+1});
    const topCli=S.users.filter(u=>u.papel==="cliente").map(u=>[u.empresa||u.nome,S.pedidos.filter(p=>p.userId===u.id).reduce((a,p)=>a+p.total,0)]).sort((a,b)=>b[1]-a[1]).slice(0,5);
    corpo=`<div class="grid-2c">
      ${hBarChart(Object.entries(porCidade).sort((a,b)=>b[1]-a[1]),"Quantas campanhas foram contratadas em cada cidade atendida.","Campanhas por cidade",num)}
      ${hBarChart(Object.entries(porTipo).sort((a,b)=>b[1]-a[1]),"Formato de mídia mais procurado pelos anunciantes.","Campanhas por formato",num)}
    </div>
    <div class="mt-24">${hBarChart(topCli,"Clientes que mais investiram na plataforma, somando todos os pedidos.","Top 5 clientes por investimento",brlShort)}</div>`;
  }else if(RELTAB==="financeiro"){
    const rec=receitaTotal(),tick=S.pedidos.length?rec/S.pedidos.length:0;
    corpo=`<div class="kpis mb-24">
      ${kpi("Receita acumulada",brlShort(rec),null,true)}
      ${kpi("Pedidos pagos",S.pedidos.length)}
      ${kpi("Ticket médio",brlShort(tick))}
      ${kpi("Comissão da plataforma (15%)",brlShort(rec*.15))}
    </div>
    ${barChart(ultimos6Meses(),"Receita reconhecida por mês de pedido. A última barra é o mês corrente.","Receita por mês")}
    <div class="mt-24">${tabela("Pedidos pagos","Lançamentos que compõem a receita acima.",["Pedido","Cliente","Data","Pontos","Total"],
      S.pedidos.slice().reverse().map(p=>{const u=usuario(p.userId)||{};
      return `<tr><td class="ink">${p.id}</td><td>${esc(u.empresa||u.nome||"—")}</td><td>${dBR(p.criadoEm)}</td><td>${p.itens.length}</td><td class="nowrap">${brl(p.total)}</td></tr>`}),
      "Nenhum pedido")}</div>`;
  }else{
    const ocup=S.pontos.filter(p=>p.status==="ocupado").length;
    const taxa=Math.round(ocup/Math.max(1,S.pontos.length)*100);
    const artes=S.campanhas.flatMap(c=>c.arquivos);
    corpo=`<div class="kpis mb-24">
      ${kpi("Taxa de ocupação",taxa+"%",null,true)}
      ${kpi("Pontos em manutenção",S.pontos.filter(p=>p.status==="manutencao").length)}
      ${kpi("Artes enviadas",artes.length)}
      ${kpi("Taxa de aprovação",Math.round(artes.filter(a=>a.status==="aprovada").length/Math.max(1,artes.filter(a=>a.status!=="analise"&&a.status!=="pendente").length)*100)+"%")}
    </div>
    ${tabela("Situação de cada ponto","Use para planejar manutenções e liberar inventário.",["Ponto","Empresa","Cidade","Situação","Campanhas"],
      S.pontos.map(p=>`<tr><td class="ink">${esc(p.nome)}</td><td>${esc((empresa(p.empresaId)||{}).nome||"—")}</td><td>${esc(p.cidade)}</td>
      <td><span class="badge ${ST_PONTO[p.status].cls}">${ST_PONTO[p.status].label}</span></td><td>${campanhasDoPonto(p.id).length}</td></tr>`),
      "Nenhum ponto")}`;
  }
  return shell(`<div class="tabs" style="max-width:420px;margin:0 0 26px">${tabs.map(([k,t])=>`<button class="${RELTAB===k?"active":""}" data-reltab="${k}">${t}</button>`).join("")}</div>${corpo}`,
    "Relatórios",{sub:"Análises detalhadas que antes ficavam espalhadas pelo painel."});
}

/* ---------- configurações (todos os papéis) ---------- */
function viewConfig(){
  const u=me();if(!u)return viewPontosAviso("Entre na sua conta para ver as configurações.");
  const e=empresaDoUsuario();
  return shell(`<div class="two-col">
    <form class="card pad-lg" data-form="config" novalidate>
      <h3 style="font-size:17px;margin-bottom:20px">Dados da conta</h3>
      <div class="field"><input id="cf-nome" placeholder=" " value="${esc(u.nome)}" required><label for="cf-nome">Nome</label></div>
      <div class="field"><input id="cf-email" type="email" placeholder=" " value="${esc(u.email)}" required><label for="cf-email">E-mail</label></div>
      <div class="grid-2">
        <div class="field"><input id="cf-tel" placeholder=" " value="${esc(u.tel||"")}"><label for="cf-tel">Telefone</label></div>
        ${u.papel==="cliente"?`<div class="field"><input id="cf-cnpj" placeholder=" " value="${esc(u.cnpj||"")}"><label for="cf-cnpj">CNPJ</label></div>`:""}
      </div>
      ${u.papel==="cliente"?`<div class="field"><input id="cf-empresa" placeholder=" " value="${esc(u.empresa||"")}"><label for="cf-empresa">Empresa</label></div>`:""}
      <div class="field"><input id="cf-senha" type="password" placeholder=" "><label for="cf-senha">Nova senha (deixe vazio para manter)</label></div>
      <button class="btn btn-primary" type="submit">Salvar alterações</button>
    </form>
    <div>
      ${e?`<div class="card pad-lg mb-16"><h3 style="font-size:17px;margin-bottom:18px">Sua empresa</h3>
        <div class="spec-list">
          <div class="spec-row"><span>Razão social</span><span>${esc(e.nome)}</span></div>
          <div class="spec-row"><span>CNPJ</span><span>${esc(e.cnpj)}</span></div>
          <div class="spec-row"><span>Cidade</span><span>${esc(e.cidade)}</span></div>
          <div class="spec-row"><span>Situação</span><span>${e.status==="ativa"?"Ativa":"Aguardando aprovação"}</span></div>
        </div></div>`:""}
      <div class="card pad-lg">
        <h3 style="font-size:17px;margin-bottom:14px">Notificações</h3>
        <label class="switch mb-16"><input type="checkbox" checked><span>Avisar por e-mail quando uma arte for avaliada</span></label>
        <label class="switch mb-16"><input type="checkbox" checked><span>Avisar quando uma campanha entrar no ar</span></label>
        <label class="switch"><input type="checkbox"><span>Receber novidades e ofertas de pontos</span></label>
      </div>
      <div class="card pad-lg mt-16">
        <h3 style="font-size:17px;margin-bottom:10px">Dados de demonstração</h3>
        <p class="small">Quer voltar tudo ao estado inicial do projeto? Isso apaga pedidos, campanhas e artes criados por você neste navegador.</p>
        <button class="btn btn-danger" data-act="reset">Restaurar dados de demonstração</button>
      </div>
    </div>
  </div>`,"Configurações");
}

/* ============================================================
   16. MODAIS DE TRABALHO
   ============================================================ */
let UPLOAD={file:null,dataURL:null,nome:null,tipo:null};
function modalUpload(campId){
  const c=campanha(campId);if(!c)return;
  const p=ponto(c.pontoId);
  UPLOAD={file:null,dataURL:null,nome:null,tipo:null};
  const aceita=p.formatos.map(f=>f==="PNG"?"image/png,image/jpeg":"video/mp4").join(",");
  openModal(`
    <h2 style="font-size:21px">${arquivoAtual(c)?"Trocar arte":"Enviar arte"}</h2>
    <p class="small" style="margin-top:8px">${esc(p.nome)} · aceita ${p.formatos.join(" e ")}</p>
    <div class="drop mt-24" id="drop-arte">
      <div class="di">${I.upload}</div>
      <div class="ink" style="font-size:15px;font-weight:600">Arraste o arquivo aqui</div>
      <p class="tiny" style="margin:6px 0 0">ou clique para escolher · ${p.formatos.includes("MP4")?"PNG, JPG ou MP4":"PNG ou JPG"} · até 25 MB</p>
      <input type="file" id="file-arte" accept="${aceita}" hidden>
    </div>
    <div id="arte-preview" class="mt-16"></div>
    <div class="form-msg" id="up-msg"></div>
    <div class="flex gap-10 mt-24">
      <button class="btn btn-ghost" data-close>Cancelar</button>
      <button class="btn btn-primary" style="flex:1" data-act="confirmar-upload" data-id="${campId}" disabled id="btn-up">Enviar para análise</button>
    </div>
    <p class="tiny mt-16" style="margin-bottom:0">O arquivo fica vinculado apenas a este ponto. Outras campanhas mantêm as artes delas.</p>
  `,"modal-md");
  ligarDrop($("#drop-arte"),$("#file-arte"),arquivo=>{
    const okImg=arquivo.type.startsWith("image/")&&p.formatos.includes("PNG");
    const okVid=arquivo.type==="video/mp4"&&p.formatos.includes("MP4");
    if(!okImg&&!okVid){$("#up-msg").textContent="Este ponto aceita apenas "+p.formatos.join(" e ")+". Escolha outro arquivo.";return}
    if(arquivo.size>25e6){$("#up-msg").textContent="Arquivo maior que 25 MB. Comprima antes de enviar.";return}
    $("#up-msg").textContent="";
    const fr=new FileReader();
    fr.onload=()=>{
      UPLOAD={file:arquivo,dataURL:fr.result,nome:arquivo.name,tipo:arquivo.type};
      $("#arte-preview").innerHTML=`<div class="tiny mb-8">Arquivo escolhido</div>
        <div class="media-preview">${arquivo.type.startsWith("video")
        ?`<video src="${fr.result}" controls muted playsinline></video>`
        :`<img src="${fr.result}" alt="Pré-visualização da arte">`}</div>
        <div class="tiny mt-8">${esc(arquivo.name)} · ${(arquivo.size/1024/1024).toFixed(2)} MB</div>
        <div class="tiny mt-16 mb-8">Como vai ficar no painel</div>
        ${mockupHTML(p,{tipo:arquivo.type,data:fr.result,nome:arquivo.name},{rotulo:"Pré-visualização no painel"})}`;
      $("#btn-up").disabled=false;
    };
    fr.readAsDataURL(arquivo);
  });
}
function ligarDrop(drop,input,cb,multi){
  if(!drop||!input)return;
  drop.addEventListener("click",()=>input.click());
  input.addEventListener("change",()=>{if(input.files.length){multi?cb([...input.files]):cb(input.files[0]);input.value=""}});
  ["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over")}));
  ["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over")}));
  drop.addEventListener("drop",e=>{const fs=[...e.dataTransfer.files];if(fs.length)multi?cb(fs):cb(fs[0])});
}
async function confirmarUpload(campId){
  const c=campanha(campId);if(!c||!UPLOAD.dataURL)return;
  const r=await api(`/campanhas/${campId}/arquivos`,{method:"POST",body:{nome:UPLOAD.nome,dados:UPLOAD.dataURL}});
  c.arquivos.push(normArquivo(r.arquivo));
  c.status="analise";
  closeModal();await render();
  toast("Arte enviada. Agora ela aparece na Central de Aprovação.");
}
async function aprovarArquivo(campId,arqId){
  const c=campanha(campId);const a=c&&c.arquivos.find(x=>x.id===arqId);if(!a)return;
  const r=await api(`/arquivos/${arqId}/aprovar`,{method:"POST"});
  Object.assign(a,normArquivo(r.arquivo));
  c.status="exibicao";
  const p=ponto(c.pontoId);if(p&&p.status!=="manutencao")p.status="ocupado";
  closeModal();await render();
  toast("Arte aprovada. A campanha está em exibição.");
}
function modalReprovar(campId,arqId){
  openModal(`<h2 style="font-size:21px">Reprovar arte</h2>
    <p class="small" style="margin-top:8px">O motivo é obrigatório e fica visível para o cliente em Meus Pontos Alugados.</p>
    <form data-form="reprovar" data-camp="${campId}" data-arq="${arqId}" class="mt-24" novalidate>
      <div class="field"><textarea id="rp-motivo" placeholder=" " required></textarea><label for="rp-motivo">Motivo da reprovação</label></div>
      <div class="form-msg" id="rp-msg"></div>
      <div class="flex gap-10">
        <button class="btn btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn btn-danger" style="flex:1" type="submit">Reprovar arte</button>
      </div>
    </form>`,"modal-md");
}
async function reprovarArquivo(campId,arqId,motivo){
  const c=campanha(campId);const a=c&&c.arquivos.find(x=>x.id===arqId);if(!a)return;
  const r=await api(`/arquivos/${arqId}/reprovar`,{method:"POST",body:{motivo}});
  Object.assign(a,normArquivo(r.arquivo));
  c.status="preparacao";
  closeModal();await render();
  toast("Arte reprovada. O cliente já pode enviar uma nova versão.","info");
}
function modalVerArte(campId,arqId){
  const c=campanha(campId);if(!c)return;
  const a=arqId?c.arquivos.find(x=>x.id===arqId):arquivoAtual(c);
  if(!a)return;
  const p=ponto(c.pontoId);
  const admin=papel()==="admin";
  const pendente=a.status==="analise"||a.status==="pendente";
  openModal(`<h2 style="font-size:21px">${esc(a.nome)}</h2>
    <p class="small" style="margin-top:8px">${esc(c.usuarioEmpresa||c.usuarioNome||"—")} · ${esc(p.nome)} · enviado em ${dBR(a.enviadoEm)}</p>
    <div class="tiny mt-24 mb-8">Arquivo enviado</div>
    <div class="media-preview">${(a.tipo||"").startsWith("video")
      ?(a.data?`<video src="${a.data}" controls muted playsinline></video>`:`<div class="pad small">Vídeo não disponível nesta sessão.</div>`)
      :(a.data?`<img src="${a.data}" alt="Arte enviada">`:`<div class="pad small">Arquivo não disponível nesta sessão.</div>`)}</div>
    <div class="flex items-center gap-10 mt-16">${badgeArq(a.status)}${a.status==="aprovada"?`<span class="tiny">Aprovada em ${dBR(a.avaliadoEm)}</span>`:""}</div>
    ${a.motivo?`<div class="card pad mt-16" style="border-color:rgba(255,92,92,.35);background:rgba(255,92,92,.06)">
      <div class="tiny" style="color:var(--danger)">Motivo da reprovação</div><div class="small ink">${esc(a.motivo)}</div></div>`:""}
    ${a.data?`<div class="tiny mt-24 mb-8">${pendente?"Como vai ficar no painel, antes de decidir":"Como está no painel"}</div>
      ${mockupHTML(p,a,{rotulo:pendente?"Pré-visualização no painel":"Prévia de veiculação"})}`:""}
    ${admin&&pendente?`<div class="flex gap-10 mt-24">
      <button class="btn btn-danger" data-act="reprovar-arq" data-camp="${c.id}" data-arq="${a.id}">Reprovar</button>
      <button class="btn btn-primary" style="flex:1" data-act="aprovar-arq" data-camp="${c.id}" data-arq="${a.id}">Aprovar arte</button></div>`:""}
  `,"modal-lg");
}
function modalHistorico(campId){
  const c=campanha(campId);if(!c)return;
  openModal(`<h2 style="font-size:21px">Histórico de versões</h2>
    <p class="small" style="margin-top:8px">${esc((ponto(c.pontoId)||{}).nome||"")}</p>
    <div class="mt-24">${c.arquivos.slice().reverse().map((a,i)=>`<div class="line-item">
      <div class="li-thumb">${a.data&&!(a.tipo||"").startsWith("video")?`<img src="${a.data}" alt="">`:`<div class="pad tiny" style="padding:8px">MP4</div>`}</div>
      <div style="flex:1;min-width:0"><div class="ink" style="font-size:14px;font-weight:600">${esc(a.nome)}</div>
        <div class="tiny">Versão ${c.arquivos.length-i} · ${dBR(a.enviadoEm)}</div>
        ${a.motivo?`<div class="tiny" style="color:var(--danger);margin-top:4px">${esc(a.motivo)}</div>`:""}</div>
      <div>${badgeArq(a.status)}</div></div>`).join("")}</div>`,"modal-md");
}

/* ---------- ponto: cadastro/edição ---------- */
function modalPonto(id){
  const p=id?ponto(id):null;
  const eu=me();
  const podeEscolherEmpresa=papel()==="admin";
  const empOpts=S.empresas.map(e=>`<option value="${e.id}" ${p&&p.empresaId===e.id?"selected":""}>${esc(e.nome)}</option>`).join("");
  openModal(`<h2 style="font-size:21px">${p?"Editar ponto":"Cadastrar ponto"}</h2>
    <p class="small" style="margin-top:8px">${p?"Alterações aparecem no site público assim que você salvar.":"O ponto entra no marketplace imediatamente após o cadastro."}</p>
    <form data-form="ponto" data-id="${p?p.id:""}" class="mt-24" novalidate>
      <div class="field"><input id="pt-nome" placeholder=" " value="${p?esc(p.nome):""}" required><label for="pt-nome">Nome do ponto</label></div>
      <div class="grid-2">
        <div class="field"><input id="pt-lat" placeholder=" " value="${p?p.lat:""}" required><label for="pt-lat">Latitude</label></div>
        <div class="field"><input id="pt-lng" placeholder=" " value="${p?p.lng:""}" required><label for="pt-lng">Longitude</label></div>
      </div>
      <div class="field"><input id="pt-end" placeholder=" " value="${p?esc(p.endereco):""}" required><label for="pt-end">Endereço completo</label></div>
      <div class="grid-2">
        <div class="field"><input id="pt-cidade" placeholder=" " value="${p?esc(p.cidade):""}" required><label for="pt-cidade">Cidade</label></div>
        <div class="field"><select id="pt-tipo">${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}" ${p&&p.tipo===k?"selected":""}>${v.nome}</option>`).join("")}</select><label for="pt-tipo">Tipo de mídia</label></div>
      </div>
      <div class="field"><input id="pt-publico" placeholder=" " value="${p?esc(p.publico):""}" required><label for="pt-publico">Público-alvo</label></div>
      <div class="grid-3">
        <div class="field"><input id="pt-alcance" placeholder=" " inputmode="numeric" value="${p?p.alcance:""}" required><label for="pt-alcance">Alcance/dia</label></div>
        <div class="field"><input id="pt-valor" placeholder=" " inputmode="numeric" value="${p?p.valor:""}" required><label for="pt-valor">Valor (R$)</label></div>
        <div class="field"><select id="pt-status">${Object.entries(ST_PONTO).map(([k,v])=>`<option value="${k}" ${p&&p.status===k?"selected":""}>${v.label}</option>`).join("")}</select><label for="pt-status">Situação</label></div>
      </div>
      <div class="field"><select id="pt-formatos">
        <option value="PNG" ${p&&p.formatos.join()==="PNG"?"selected":""}>Somente PNG (impresso)</option>
        <option value="PNG,MP4" ${!p||p.formatos.length>1?"selected":""}>PNG e MP4 (digital)</option>
        <option value="MP4" ${p&&p.formatos.join()==="MP4"?"selected":""}>Somente MP4</option>
      </select><label for="pt-formatos">Formatos aceitos</label></div>
      ${podeEscolherEmpresa?`<div class="field"><select id="pt-empresa">${empOpts}</select><label for="pt-empresa">Empresa proprietária</label></div>`:""}
      <div class="form-msg" id="pt-msg"></div>
      <div class="flex gap-10">
        <button class="btn btn-ghost" type="button" data-close>Cancelar</button>
        ${p?`<button class="btn btn-ghost" type="button" data-act="fotos-ponto" data-id="${p.id}">Gerenciar fotos</button>`:""}
        <button class="btn btn-primary" style="flex:1" type="submit">${p?"Salvar alterações":"Cadastrar ponto"}</button>
      </div>
    </form>`,"modal-md");
}
async function salvarPonto(id,f){
  const corpo={nome:f.nome,latitude:f.lat,longitude:f.lng,endereco:f.endereco,cidade:f.cidade,
    tipo:f.tipo,publico:f.publico,alcance:f.alcance,valor:f.valor,status:f.status,formatos:f.formatos};
  if(papel()==="admin"&&f.empresaId)corpo.empresaId=f.empresaId;
  if(id){
    const r=await api("/pontos/"+id,{method:"PUT",body:corpo});
    Object.assign(ponto(id),normPonto(r.ponto));
  }else{
    const r=await api("/pontos",{method:"POST",body:corpo});
    S.pontos.push(normPonto(r.ponto));
  }
  closeModal();await render();
  toast(id?"Ponto atualizado.":"Ponto cadastrado e publicado no marketplace.");
}
/* lê um File do input/drop como data URL (base64), em Promise */
function lerArquivoComoDataURL(file){
  return new Promise((resolve,reject)=>{
    const fr=new FileReader();
    fr.onload=()=>resolve(fr.result);
    fr.onerror=()=>reject(new Error("Não foi possível ler o arquivo."));
    fr.readAsDataURL(file);
  });
}

/* ---------- galeria de fotos do ponto ---------- */
function modalFotos(id){
  const p=ponto(id);if(!p)return;
  openModal(`<h2 style="font-size:21px">Fotos do ponto</h2>
    <p class="small" style="margin-top:8px">${esc(p.nome)} — a foto marcada como <strong style="color:var(--ink)">Principal</strong> é a única usada no card do marketplace, na capa do ponto, no carrinho, nas tabelas de campanha e na prévia da arte do cliente.</p>
    <div class="drop mt-24" id="drop-fotos">
      <div class="di">${I.img}</div>
      <div class="ink" style="font-size:15px;font-weight:600">Arraste fotos aqui</div>
      <p class="tiny" style="margin:6px 0 0">JPG ou PNG · várias de uma vez</p>
      <input type="file" id="file-fotos" accept="image/png,image/jpeg" multiple hidden>
    </div>
    <div id="fotos-grid">${gridFotos(p)}</div>
    <div class="flex gap-10 mt-24"><button class="btn btn-primary btn-block" data-close>Concluir</button></div>`,"modal-lg");
  ligarDrop($("#drop-fotos"),$("#file-fotos"),async files=>{
    const imgs=files.filter(f=>f.type.startsWith("image/"));
    if(!imgs.length)return;
    const semPrincipalAntes=!p.fotoPrincipal;
    try{
      let ultimoPonto=null;
      for(const f of imgs){
        const dataUrl=await lerArquivoComoDataURL(f);
        const r=await api(`/pontos/${p.id}/fotos`,{method:"POST",body:{dados:dataUrl}});
        ultimoPonto=r.ponto;
      }
      Object.assign(p,normPonto(ultimoPonto));
      $("#fotos-grid").innerHTML=gridFotos(p);ligarReorder(p);await render(true);
      if(semPrincipalAntes&&p.fotoPrincipal){
        toast("Essa é a primeira foto real deste ponto — já marquei como principal. Agora marque onde fica o painel nela.");
        modalArea(p.id,p.fotoPrincipal);
      }else{
        toast("Foto(s) adicionada(s). Para trocar a foto principal, use o botão \"Principal\" na miniatura desejada.");
      }
    }catch(err){toast(err.message||"Não foi possível enviar as fotos.","err")}
  },true);
  ligarReorder(p);
}
function gridFotos(p){
  if(!p.fotos.length)return `<div class="empty"><div class="big">Nenhuma foto ainda</div><p class="small">Envie ao menos uma imagem para o ponto aparecer bem no marketplace.</p></div>`;
  return `<div class="photo-grid" id="pg">${p.fotos.map((f,i)=>`
    <div class="photo-cell ${p.fotoPrincipal===f.id?"main":""}" draggable="true" data-foto="${f.id}" data-i="${i}">
      ${imgTag(fotoSrc(f,p.tipo),"Foto do ponto")}
      ${p.fotoPrincipal===f.id?`<span class="main-flag">Principal</span>`:""}
      <span class="src-flag ${f.data?"real":"gerada"}">${f.data?"Foto enviada":"Ilustrativa"}</span>
      ${f.area?`<span class="area-flag">${I.target.replace("<svg",'<svg width="11" height="11"')}Área definida</span>`:""}
      <div class="pc-bar">
        ${p.fotoPrincipal===f.id?"":`<button data-act="set-main" data-ponto="${p.id}" data-foto="${f.id}">Principal</button>`}
        <button data-act="def-area" data-ponto="${p.id}" data-foto="${f.id}">Área do painel</button>
        <button class="del" data-act="del-foto" data-ponto="${p.id}" data-foto="${f.id}">Excluir</button>
      </div>
    </div>`).join("")}</div>
    <p class="tiny mt-16" style="margin-bottom:0">Arraste as miniaturas para reordenar. Clique em <strong style="color:var(--ink)">Área do painel</strong> na foto principal para marcar exatamente onde a arte do cliente deve encaixar — é isso que aparece na prévia de aprovação.</p>`;
}
function ligarReorder(p){
  const grid=$("#pg");if(!grid)return;
  let src=null;
  grid.addEventListener("dragstart",e=>{const c=e.target.closest(".photo-cell");if(!c)return;src=c;c.classList.add("dragging")});
  grid.addEventListener("dragend",e=>{if(src)src.classList.remove("dragging");src=null});
  grid.addEventListener("dragover",e=>{e.preventDefault();
    const t=e.target.closest(".photo-cell");if(!t||!src||t===src)return;
    const cells=[...grid.children];
    cells.indexOf(t)<cells.indexOf(src)?grid.insertBefore(src,t):grid.insertBefore(src,t.nextSibling);
  });
  grid.addEventListener("drop",async e=>{e.preventDefault();
    const ordem=[...grid.children].map(c=>c.dataset.foto);
    p.fotos.sort((a,b)=>ordem.indexOf(a.id)-ordem.indexOf(b.id));
    try{
      const r=await api(`/pontos/${p.id}/fotos/ordem`,{method:"PUT",body:{ordem}});
      Object.assign(p,normPonto(r.ponto));
      await render(true);toast("Ordem das fotos atualizada.");
    }catch(err){toast(err.message||"Não foi possível salvar a nova ordem.","err")}
  });
}

/* ---------- editor visual da área do painel dentro de cada foto ---------- */
let AREA_STATE=null,AREA_DRAG=null;
function modalArea(pontoId,fotoId){
  const p=ponto(pontoId);const f=p&&p.fotos.find(x=>x.id===fotoId);
  if(!p||!f)return;
  const sugestao=PANEL[p.tipo]||PANEL.outdoor;
  AREA_STATE=f.area?{...f.area}:{...sugestao};
  openModal(`<h2 style="font-size:21px">Área do painel nesta foto</h2>
    <p class="small" style="margin-top:8px">Arraste o retângulo pelas bordas e pelos cantos até cobrir exatamente a tela ou o painel na foto. A arte do cliente vai encaixar sozinha aí, toda vez que uma campanha for aprovada.</p>
    <div class="area-editor mt-24" id="area-editor">
      ${imgTag(fotoSrc(f,p.tipo),"Foto do ponto").replace("<img","<img id=\"area-img\"")}
      <div class="area-box" id="area-box" style="left:${AREA_STATE.x}%;top:${AREA_STATE.y}%;width:${AREA_STATE.w}%;height:${AREA_STATE.h}%">
        <div class="area-handle" data-h="nw"></div>
        <div class="area-handle" data-h="ne"></div>
        <div class="area-handle" data-h="sw"></div>
        <div class="area-handle" data-h="se"></div>
      </div>
    </div>
    <div class="flex gap-10 wrapf mt-24">
      <button class="btn btn-ghost" type="button" data-act="area-voltar" data-ponto="${p.id}">← Voltar para as fotos</button>
      <button class="btn btn-ghost" type="button" data-act="area-sugestao" data-ponto="${p.id}">Usar sugestão automática</button>
      <button class="btn btn-primary" style="flex:1" type="button" data-act="area-salvar" data-ponto="${p.id}" data-foto="${f.id}">Salvar área</button>
    </div>`,"modal-md");
  ligarAreaEditor();
}
function ligarAreaEditor(){
  const editor=$("#area-editor"),box=$("#area-box");
  if(!editor||!box)return;
  const paint=()=>{box.style.left=AREA_STATE.x+"%";box.style.top=AREA_STATE.y+"%";box.style.width=AREA_STATE.w+"%";box.style.height=AREA_STATE.h+"%"};
  const pct=(clientX,clientY,rect)=>({x:clamp((clientX-rect.left)/rect.width*100,0,100),y:clamp((clientY-rect.top)/rect.height*100,0,100)});
  box.addEventListener("pointerdown",e=>{
    const h=e.target.closest(".area-handle");
    const rect=editor.getBoundingClientRect();
    if(h){
      const t=h.dataset.h;
      const anchor= t==="se"?{x:AREA_STATE.x,y:AREA_STATE.y}
        : t==="nw"?{x:AREA_STATE.x+AREA_STATE.w,y:AREA_STATE.y+AREA_STATE.h}
        : t==="ne"?{x:AREA_STATE.x,y:AREA_STATE.y+AREA_STATE.h}
        : {x:AREA_STATE.x+AREA_STATE.w,y:AREA_STATE.y};
      AREA_DRAG={mode:"resize",rect,anchor};
    }else{
      AREA_DRAG={mode:"move",rect,startX:AREA_STATE.x,startY:AREA_STATE.y,startMouse:pct(e.clientX,e.clientY,rect)};
    }
    e.preventDefault();
    try{box.setPointerCapture(e.pointerId)}catch(err){}
  });
  box.addEventListener("pointermove",e=>{
    if(!AREA_DRAG)return;
    const p=pct(e.clientX,e.clientY,AREA_DRAG.rect);
    if(AREA_DRAG.mode==="resize"){
      const a=AREA_DRAG.anchor;
      const w=Math.max(4,Math.abs(p.x-a.x)),h=Math.max(4,Math.abs(p.y-a.y));
      const x=Math.min(a.x,p.x),y=Math.min(a.y,p.y);
      AREA_STATE={x:clamp(x,0,100-w),y:clamp(y,0,100-h),w:Math.min(w,100),h:Math.min(h,100)};
    }else{
      const dx=p.x-AREA_DRAG.startMouse.x,dy=p.y-AREA_DRAG.startMouse.y;
      AREA_STATE.x=clamp(AREA_DRAG.startX+dx,0,100-AREA_STATE.w);
      AREA_STATE.y=clamp(AREA_DRAG.startY+dy,0,100-AREA_STATE.h);
    }
    paint();
  });
  const end=()=>{AREA_DRAG=null};
  box.addEventListener("pointerup",end);
  box.addEventListener("pointercancel",end);
}

/* ---------- edição de usuário e empresa ---------- */
function modalUsuario(id){
  const u=usuario(id);if(!u)return;
  openModal(`<h2 style="font-size:21px">Editar cliente</h2>
    <form data-form="user" data-id="${u.id}" class="mt-24" novalidate>
      <div class="field"><input id="us-nome" placeholder=" " value="${esc(u.nome)}" required><label for="us-nome">Nome</label></div>
      <div class="field"><input id="us-email" placeholder=" " value="${esc(u.email)}" required><label for="us-email">E-mail</label></div>
      <div class="grid-2">
        <div class="field"><input id="us-empresa" placeholder=" " value="${esc(u.empresa||"")}"><label for="us-empresa">Empresa</label></div>
        <div class="field"><input id="us-cnpj" placeholder=" " value="${esc(u.cnpj||"")}"><label for="us-cnpj">CNPJ</label></div>
      </div>
      <div class="field"><input id="us-tel" placeholder=" " value="${esc(u.tel||"")}"><label for="us-tel">Telefone</label></div>
      <div class="flex gap-10"><button class="btn btn-ghost" type="button" data-close>Cancelar</button>
      <button class="btn btn-primary" style="flex:1" type="submit">Salvar</button></div>
    </form>`,"modal-md");
}
function modalEmpresa(id){
  const e=id?empresa(id):null;
  openModal(`<h2 style="font-size:21px">${e?"Editar empresa":"Cadastrar empresa parceira"}</h2>
    <form data-form="empresa" data-id="${e?e.id:""}" class="mt-24" novalidate>
      <div class="field"><input id="em-nome" placeholder=" " value="${e?esc(e.nome):""}" required><label for="em-nome">Razão social</label></div>
      <div class="grid-2">
        <div class="field"><input id="em-cnpj" placeholder=" " value="${e?esc(e.cnpj):""}" required><label for="em-cnpj">CNPJ</label></div>
        <div class="field"><input id="em-cidade" placeholder=" " value="${e?esc(e.cidade):""}" required><label for="em-cidade">Cidade</label></div>
      </div>
      <div class="grid-2">
        <div class="field"><input id="em-email" placeholder=" " value="${e?esc(e.email):""}"><label for="em-email">E-mail</label></div>
        <div class="field"><input id="em-tel" placeholder=" " value="${e?esc(e.tel):""}"><label for="em-tel">Telefone</label></div>
      </div>
      <div class="form-msg" id="em-msg"></div>
      <div class="flex gap-10"><button class="btn btn-ghost" type="button" data-close>Cancelar</button>
      <button class="btn btn-primary" style="flex:1" type="submit">${e?"Salvar":"Enviar cadastro"}</button></div>
    </form>`,"modal-md");
}
function confirmar(titulo,texto,onOk,rotulo){
  const label=rotulo||"Excluir";
  openModal(`<h2 style="font-size:21px">${esc(titulo)}</h2>
    <p class="small" style="margin-top:10px">${esc(texto)}</p>
    <div class="flex gap-10 mt-24"><button class="btn btn-ghost" data-close>Cancelar</button>
    <button class="btn btn-danger" style="flex:1" id="btn-confirma">${esc(label)}</button></div>`);
  $("#btn-confirma").addEventListener("click",async()=>{
    const btn=$("#btn-confirma");
    btn.disabled=true;btn.textContent="Só um instante…";
    try{await onOk();closeModal()}
    catch(e){btn.disabled=false;btn.textContent=label;toast(e.message||"Não foi possível concluir a ação.","err")}
  });
}

/* ============================================================
   17. EVENTOS
   ============================================================ */
/* mostra o erro de uma chamada à API na mensagem de um formulário, ou como toast se não houver essa caixinha */
function mostrarErroApi(e,msgElId){
  const el=msgElId&&$("#"+msgElId);
  if(el)el.textContent=e.message||"Algo deu errado. Tente novamente.";
  else toast(e.message||"Algo deu errado. Tente novamente.","err");
}
const DEMOS={"cliente@outdoorhub.com.br":1,"empresa@outdoorhub.com.br":1,"admin@outdoorhub.com.br":1};

document.addEventListener("click",async e=>{
  const el=e.target.closest("[data-act]");
  const demo=e.target.closest("[data-demo]");
  if(demo){
    $("#lg-email").value=demo.dataset.demo;$("#lg-senha").value="123456";
    $$("#auth-body .field").forEach(f=>f.classList.add("filled"));
    return;
  }
  const tab=e.target.closest("[data-tab]");
  if(tab){$$(".tabs [data-tab]").forEach(b=>b.classList.toggle("active",b===tab));
    $("#auth-body").innerHTML=tab.dataset.tab==="entrar"?formEntrar():formCriar();return}
  const rt=e.target.closest("[data-reltab]");
  if(rt){RELTAB=rt.dataset.reltab;await render();return}
  const f=e.target.closest("[data-filtro]");
  if(f){FILTROS[f.dataset.filtro]=f.dataset.val;MAPST.sel=null;
    if(location.hash.includes("?")){location.hash="#/pontos"}else{await render()}
    setTimeout(()=>window.__fitMapa&&window.__fitMapa(),40);return}
  const gal=e.target.closest("[data-gal]");
  if(gal){window.__galIdx=+gal.dataset.gal;await render();return}
  const pin=e.target.closest("[data-pin]");
  if(pin&&!e.target.closest("[data-stop]")){MAPST.sel=MAPST.sel===pin.dataset.pin?null:pin.dataset.pin;await render();return}
  const card=e.target.closest("[data-card]");
  if(card&&!e.target.closest("button")&&!e.target.closest("a")){go("#/ponto/"+card.dataset.card);return}
  if(!el){
    if(!e.target.closest(".user-menu"))closeDropdown();
    return;
  }
  const a=el.dataset.act,id=el.dataset.id;
  try{
    switch(a){
      case "login":modalLogin("entrar",null);break;
      case "signup-empresa":modalEmpresa(null);break;
      case "toggle-menu":{const dd=$("#userdd");dd.classList.toggle("open");el.classList.toggle("is-open",dd.classList.contains("open"));e.stopPropagation();break}
      case "logout":await sair();break;
      case "burger":{const n=$(".nav-main");n.classList.toggle("mobile-open");break}
      case "toggle-side":S.ui.sideCollapsed=!S.ui.sideCollapsed;save();await render();break;
      case "add-cart":await addCarrinho(id);break;
      case "alugar-agora":
        if(!me()||papel()!=="cliente"){modalLogin("entrar",{pontoId:id,rota:location.hash});break}
        await addCarrinho(id,true);go("#/carrinho");break;
      case "rm-cart":S.carrinho.splice(+el.dataset.idx,1);salvarCarrinho();renderHeader();await render();toast("Ponto removido do carrinho.","info");break;
      case "chk-voltar":CHK.etapa=1;await render();break;
      case "limpar-filtros":FILTROS={tipo:"",cidade:"",empresa:"",busca:"",so:""};await render();break;
      case "limpar-fcamp":FCAMP={cliente:"",empresa:"",cidade:"",status:""};await render();break;
      case "upload":modalUpload(id);break;
      case "confirmar-upload":el.disabled=true;el.textContent="Enviando…";await confirmarUpload(id);break;
      case "historico":modalHistorico(id);break;
      case "ver-arte":modalVerArte(id);break;
      case "ver-arquivo":modalVerArte(el.dataset.camp,el.dataset.arq);break;
      case "aprovar-arq":el.disabled=true;await aprovarArquivo(el.dataset.camp,el.dataset.arq);break;
      case "reprovar-arq":modalReprovar(el.dataset.camp,el.dataset.arq);break;
      case "novo-ponto":modalPonto(null);break;
      case "editar-ponto":modalPonto(id);break;
      case "fotos-ponto":modalFotos(id);break;
      case "def-area":modalArea(el.dataset.ponto,el.dataset.foto);break;
      case "area-sugestao":{const p=ponto(el.dataset.ponto);const sug=PANEL[p.tipo]||PANEL.outdoor;
        AREA_STATE={...sug};const box=$("#area-box");
        if(box){box.style.left=AREA_STATE.x+"%";box.style.top=AREA_STATE.y+"%";box.style.width=AREA_STATE.w+"%";box.style.height=AREA_STATE.h+"%"}
        break}
      case "area-salvar":{
        el.disabled=true;el.textContent="Salvando…";
        const p=ponto(el.dataset.ponto);
        const r=await api(`/pontos/${p.id}/fotos/${el.dataset.foto}/area`,{method:"PUT",
          body:{x:+AREA_STATE.x.toFixed(2),y:+AREA_STATE.y.toFixed(2),w:+AREA_STATE.w.toFixed(2),h:+AREA_STATE.h.toFixed(2)}});
        const f=p.fotos.find(x=>x.id===el.dataset.foto);if(f)f.area=r.foto.area;
        await render(true);toast("Área do painel salva. A arte do cliente já encaixa aí a partir de agora.");
        modalFotos(p.id);break}
      case "area-voltar":modalFotos(el.dataset.ponto);break;
      case "set-main":{
        const p=ponto(el.dataset.ponto);
        const r=await api(`/pontos/${p.id}/foto-principal`,{method:"PUT",body:{fotoId:el.dataset.foto}});
        Object.assign(p,normPonto(r.ponto));
        $("#fotos-grid").innerHTML=gridFotos(p);ligarReorder(p);await render(true);toast("Foto principal atualizada em todo o site.");break}
      case "del-foto":{
        const p=ponto(el.dataset.ponto);
        const r=await api(`/pontos/${p.id}/fotos/${el.dataset.foto}`,{method:"DELETE"});
        Object.assign(p,normPonto(r.ponto));
        $("#fotos-grid").innerHTML=gridFotos(p);ligarReorder(p);await render(true);toast("Foto removida.","info");break}
      case "excluir-ponto":{const p=ponto(id);
        confirmar("Excluir ponto","O ponto “"+p.nome+"” sai do marketplace. Campanhas já contratadas continuam no histórico.",async()=>{
          await api("/pontos/"+id,{method:"DELETE"});
          S.pontos=S.pontos.filter(x=>x.id!==id);await render();toast("Ponto excluído.","info")});break}
      case "editar-user":modalUsuario(id);break;
      case "bloquear-user":{
        const r=await api(`/usuarios/${id}/bloquear`,{method:"PUT"});
        const u=usuario(id);Object.assign(u,normUsuario(r.usuario));
        await render();toast(u.status==="ativo"?"Cliente desbloqueado.":"Cliente bloqueado.","info");break}
      case "excluir-user":{const u=usuario(id);
        confirmar("Excluir cliente","A conta de "+u.nome+" será removida da plataforma.",async()=>{
          await api("/usuarios/"+id,{method:"DELETE"});
          S.users=S.users.filter(x=>x.id!==id);await render();toast("Cliente excluído.","info")});break}
      case "aprovar-empresa":{
        const r=await api(`/empresas/${id}/aprovar`,{method:"POST"});
        const em=empresa(id);Object.assign(em,normEmpresa(r.empresa));
        await render();toast(em.nome+" agora é uma parceira ativa.");break}
      case "editar-empresa":modalEmpresa(id);break;
      case "excluir-empresa":{const em=empresa(id);
        confirmar("Excluir empresa","Todos os pontos de "+em.nome+" também deixam de ser exibidos.",async()=>{
          await api("/empresas/"+id,{method:"DELETE"});
          S.empresas=S.empresas.filter(x=>x.id!==id);S.pontos=S.pontos.filter(x=>x.empresaId!==id);
          await render();toast("Empresa excluída.","info")});break}
      case "google":toast("Login com Google é simulado neste projeto acadêmico. Use uma conta de demonstração.","info");break;
      case "esqueci":toast("Enviamos um link de redefinição para o seu e-mail (simulado).","info");break;
      case "reset":confirmar("Sair e limpar dados locais","Isso encerra sua sessão e limpa o carrinho e as preferências guardadas neste navegador. Os dados da plataforma (pontos, campanhas, pedidos) continuam intactos no servidor.",async()=>{
          try{localStorage.clear()}catch(err){}
          location.href=location.pathname;},"Sair e limpar"); break;
    }
  }catch(err){
    if(a==="confirmar-upload"){el.disabled=false;el.textContent="Enviar para análise"}
    if(a==="aprovar-arq")el.disabled=false;
    toast(err.message||"Não foi possível concluir a ação.","err");
  }
});

/* trava um botão de submit enquanto a chamada à API está em andamento */
function travarBotao(form,texto){
  const btn=form.querySelector('button[type="submit"]');
  if(!btn)return()=>{};
  const original=btn.textContent;
  btn.disabled=true;if(texto)btn.textContent=texto;
  return()=>{btn.disabled=false;btn.textContent=original};
}

document.addEventListener("submit",async e=>{
  const form=e.target.closest("[data-form]");if(!form)return;
  e.preventDefault();
  const t=form.dataset.form;
  const v=id=>{const el=$("#"+id);return el?el.value.trim():""};

  if(t==="entrar"){
    const destravar=travarBotao(form,"Entrando…");
    try{
      const r=await api("/auth/login",{method:"POST",body:{email:v("lg-email"),senha:v("lg-senha")}});
      await aplicarSessao(normUsuario(r.usuario),r.token);
    }catch(err){destravar();mostrarErroApi(err,"lg-msg")}
  }
  else if(t==="criar"){
    if(v("cd-nome").length<3){$("#cd-msg").textContent="Informe seu nome completo.";return}
    if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v("cd-email"))){$("#cd-msg").textContent="Informe um e-mail válido.";return}
    if(v("cd-senha").length<6){$("#cd-msg").textContent="A senha precisa ter ao menos 6 caracteres.";return}
    const destravar=travarBotao(form,"Criando conta…");
    try{
      const r=await api("/auth/registro",{method:"POST",body:{
        nome:v("cd-nome"),email:v("cd-email"),senha:v("cd-senha"),empresa:v("cd-empresa"),cnpj:v("cd-cnpj")}});
      await aplicarSessao(normUsuario(r.usuario),r.token);
    }catch(err){destravar();mostrarErroApi(err,"cd-msg")}
  }
  else if(t==="ponto"){
    const id=form.dataset.id;
    const lat=parseFloat(v("pt-lat")),lng=parseFloat(v("pt-lng"));
    if(!v("pt-nome")||isNaN(lat)||isNaN(lng)||!v("pt-end")){$("#pt-msg").textContent="Preencha nome, endereço e coordenadas numéricas.";return}
    const destravar=travarBotao(form,"Salvando…");
    try{
      await salvarPonto(id,{nome:v("pt-nome"),lat,lng,endereco:v("pt-end"),cidade:v("pt-cidade"),
        tipo:$("#pt-tipo").value,publico:v("pt-publico"),alcance:parseInt(v("pt-alcance"))||0,
        valor:parseFloat(String(v("pt-valor")).replace(",","."))||0,status:$("#pt-status").value,
        formatos:$("#pt-formatos").value.split(","),
        empresaId:$("#pt-empresa")?$("#pt-empresa").value:undefined});
    }catch(err){destravar();mostrarErroApi(err,"pt-msg")}
  }
  else if(t==="reprovar"){
    const m=v("rp-motivo");
    if(m.length<10){$("#rp-msg").textContent="Descreva o motivo com pelo menos 10 caracteres — o cliente precisa saber o que corrigir.";return}
    const destravar=travarBotao(form,"Enviando…");
    try{await reprovarArquivo(form.dataset.camp,form.dataset.arq,m)}
    catch(err){destravar();mostrarErroApi(err,"rp-msg")}
  }
  else if(t==="user"){
    const destravar=travarBotao(form,"Salvando…");
    try{
      const r=await api("/usuarios/"+form.dataset.id,{method:"PUT",body:{
        nome:v("us-nome"),email:v("us-email"),empresa:v("us-empresa"),cnpj:v("us-cnpj"),telefone:v("us-tel")}});
      const u=usuario(form.dataset.id);Object.assign(u,normUsuario(r.usuario));
      closeModal();await render();toast("Cliente atualizado.");
    }catch(err){destravar();toast(err.message,"err")}
  }
  else if(t==="empresa"){
    const id=form.dataset.id;
    if(!v("em-nome")||!v("em-cnpj")){$("#em-msg").textContent="Razão social e CNPJ são obrigatórios.";return}
    const destravar=travarBotao(form,"Salvando…");
    const corpo={nome:v("em-nome"),cnpj:v("em-cnpj"),cidade:v("em-cidade"),email:v("em-email"),telefone:v("em-tel")};
    try{
      if(id){
        const r=await api("/empresas/"+id,{method:"PUT",body:corpo});
        Object.assign(empresa(id),normEmpresa(r.empresa));
        closeModal();await render();toast("Empresa atualizada.");
      }else{
        await api("/empresas",{method:"POST",body:corpo});
        closeModal();toast("Cadastro enviado. A administração vai analisar sua empresa.");
      }
    }catch(err){destravar();mostrarErroApi(err,"em-msg")}
  }
  else if(t==="chk1"){
    if(!v("ck-nome")||!v("ck-empresa")||!v("ck-cnpj")||!v("ck-email")){$("#ck1-msg").textContent="Preencha todos os campos para continuar.";return}
    CHK.dados={nome:v("ck-nome"),empresa:v("ck-empresa"),cnpj:v("ck-cnpj"),tel:v("ck-tel"),email:v("ck-email")};
    CHK.etapa=2;await render();
  }
  else if(t==="chk2"){
    const numc=v("cc-num").replace(/\D/g,"");
    if(v("cc-nome").length<3){$("#ck2-msg").textContent="Informe o nome impresso no cartão.";return}
    if(numc.length<13){$("#ck2-msg").textContent="Número de cartão inválido.";return}
    if(!/^\d{2}\/\d{2}$/.test(v("cc-val"))){$("#ck2-msg").textContent="Validade deve estar no formato MM/AA.";return}
    if(v("cc-cvv").length<3){$("#ck2-msg").textContent="CVV inválido.";return}
    const bandeira=numc[0]==="4"?"Visa":numc[0]==="5"?"Mastercard":"Elo";
    const destravar=travarBotao(form,"Processando pagamento…");
    try{
      await concluirPedido({metodo:"cartao",bandeira,final:numc.slice(-4)});
      await render();toast("Pagamento aprovado. Campanhas criadas.");
    }catch(err){destravar();mostrarErroApi(err,"ck2-msg")}
  }
  else if(t==="config"){
    if(v("cf-senha")&&v("cf-senha").length<6){toast("A nova senha precisa de 6 caracteres.","err");return}
    const destravar=travarBotao(form,"Salvando…");
    try{
      const body={nome:v("cf-nome"),telefone:v("cf-tel")};
      if($("#cf-empresa"))body.empresa=v("cf-empresa");
      if($("#cf-cnpj"))body.cnpj=v("cf-cnpj");
      if(v("cf-senha"))body.novaSenha=v("cf-senha");
      const r=await api("/auth/me",{method:"PUT",body});
      S.usuario=normUsuario(r.usuario);
      await render();toast("Dados salvos.");
    }catch(err){destravar();toast(err.message,"err")}
  }
  else if(t==="contato"){
    form.reset();toast("Mensagem enviada. Nossa equipe responde em até 1 dia útil.");
  }
});

document.addEventListener("input",e=>{
  if(e.target.id==="busca"){FILTROS.busca=e.target.value;
    const lista=aplicaFiltros();
    const cont=$(".point-cards");
    if(cont)cont.innerHTML=lista.length?lista.map(cardPonto).join(""):`<div class="empty"><div class="big">Nenhum ponto com esses filtros</div><button class="btn btn-sm btn-ghost mt-16" data-act="limpar-filtros">Limpar filtros</button></div>`;
    const w=$("#mapa-world");
    if(w){$$(".map-pin",w).forEach(p=>p.remove());w.insertAdjacentHTML("beforeend",lista.map(p=>pinHTML(p,MAPST.sel)).join(""))}
  }
  if(e.target.id==="cc-num"){
    let vv=e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();e.target.value=vv;
  }
  if(e.target.id==="cc-val"){
    let vv=e.target.value.replace(/\D/g,"").slice(0,4);if(vv.length>2)vv=vv.slice(0,2)+"/"+vv.slice(2);e.target.value=vv;
  }
});
document.addEventListener("change",async e=>{
  const ini=e.target.dataset.cartIni,dias=e.target.dataset.cartDias,fc=e.target.dataset.fcamp;
  if(ini!==undefined){S.carrinho[+ini].inicio=e.target.value;salvarCarrinho();await render()}
  if(dias!==undefined){S.carrinho[+dias].dias=+e.target.value;salvarCarrinho();await render()}
  if(fc!==undefined){FCAMP[fc]=e.target.value;await render()}
});
window.addEventListener("scroll",()=>{
  const h=$("#hdr");if(h)h.classList.toggle("scrolled",window.scrollY>14);
},{passive:true});

/* ============================================================
   18. RENDERIZAÇÃO
   ============================================================ */
/* busca os dados que cada seção precisa antes de montar a tela —
   é aqui que a app conversa com o servidor a cada navegação. */
async function carregarDadosDaRota(r,u){
  if(r.startsWith("#/admin"))return carregarDadosAdmin();
  if(r.startsWith("#/empresa"))return carregarDadosEmpresa();
  if(["#/painel","#/alugados","#/campanhas","#/arquivos","#/pedidos"].includes(r))return carregarDadosCliente();
}
let RENDER_SEQ=0;
async function render(keepModal){
  const r=route();
  const u=me();
  const guards={
    "#/painel":"cliente","#/alugados":"cliente","#/campanhas":"cliente","#/arquivos":"cliente","#/pedidos":"cliente",
    "#/empresa":"empresa","#/empresa/pontos":"empresa","#/empresa/campanhas":"empresa","#/empresa/artes":"empresa","#/empresa/financeiro":"empresa",
    "#/admin":"admin","#/admin/pontos":"admin","#/admin/clientes":"admin","#/admin/empresas":"admin","#/admin/campanhas":"admin","#/admin/aprovacoes":"admin","#/admin/relatorios":"admin"
  };
  if(r!=="#/checkout"&&CHK.etapa===3)CHK={etapa:1,dados:{}};
  const need=guards[r];
  const seq=++RENDER_SEQ; /* evita que uma resposta antiga e lenta sobrescreva uma navegação mais nova */
  let html="";
  if(need&&(!u||u.papel!==need)){
    if(!u){modalLogin("entrar",{rota:r});html=viewPontosAviso("Entre na sua conta para acessar esta área.")}
    else html=viewPontosAviso("Sua conta não tem acesso a esta área.");
  }else{
    if(need){
      const app=$("#app");
      if(app&&!app.querySelector(".panel"))app.innerHTML=`<div class="wrap section-tight"><div class="empty"><div class="big">Carregando…</div></div></div>`;
      try{
        await carregarDadosDaRota(r,u);
      }catch(err){
        if(seq!==RENDER_SEQ)return;
        $("#app").innerHTML=`<div class="wrap section-tight"><div class="empty"><div class="big">Não deu para carregar seus dados</div>
          <p class="small">${esc(err.message||"Verifique sua internet e tente de novo.")}</p>
          <button class="btn btn-primary mt-16" onclick="render()">Tentar de novo</button></div></div>`;
        return;
      }
      if(seq!==RENDER_SEQ)return; /* o usuário já navegou para outro lugar enquanto isso carregava */
    }
    switch(r){
      case "#/":html=viewHome();break;
      case "#/produtos":html=viewProdutos();break;
      case "#/pontos":html=viewPontos();break;
      case "#/parceiras":html=viewParceiras();break;
      case "#/contato":html=viewContato();break;
      case "#/carrinho":html=viewCarrinho();break;
      case "#/checkout":html=viewCheckout();break;
      case "#/painel":html=viewPainelCliente();break;
      case "#/alugados":html=viewAlugados();break;
      case "#/campanhas":html=viewCampanhasCliente();break;
      case "#/arquivos":html=viewArquivosCliente();break;
      case "#/pedidos":html=viewPedidosCliente();break;
      case "#/empresa":html=viewPainelEmpresa();break;
      case "#/empresa/pontos":html=viewPontosEmpresa();break;
      case "#/empresa/campanhas":html=viewCampanhasEmpresa();break;
      case "#/empresa/artes":html=viewArtesEmpresa();break;
      case "#/empresa/financeiro":html=viewFinanceiroEmpresa();break;
      case "#/admin":html=viewAdmin();break;
      case "#/admin/pontos":html=viewAdminPontos();break;
      case "#/admin/clientes":html=viewAdminClientes();break;
      case "#/admin/empresas":html=viewAdminEmpresas();break;
      case "#/admin/campanhas":html=viewAdminCampanhas();break;
      case "#/admin/aprovacoes":html=viewAprovacoes();break;
      case "#/admin/relatorios":html=viewRelatorios();break;
      case "#/config":html=viewConfig();break;
      default:
        if(r.startsWith("#/ponto/"))html=viewPonto(r.split("/")[2]);
        else html=`<div class="wrap section-tight"><div class="empty"><div class="big">Página não encontrada</div>
          <p class="small">O endereço ${esc(r)} não existe no OutdoorHub.</p><a class="btn btn-primary mt-16" href="#/">Voltar ao início</a></div></div>`;
    }
  }
  const app=$("#app");
  app.className=r==="#/"?"no-pad":"";
  app.innerHTML=html;
  renderHeader();
  $("#ftr").style.display=r==="#/pontos"?"none":"";
  if(!$("#ftr").innerHTML)renderFooter();
  observeReveals();
  if(r==="#/pontos")mountMapa(aplicaFiltros());
  if(r!=="#/ponto/"+((r.split("/")||[])[2]))window.__galIdx=0;
  $("#hdr").classList.toggle("scrolled",window.scrollY>14);
  if(window.__scrollTop){window.__scrollTop=false;window.scrollTo(0,0)}
  /* âncoras internas da home */
  const h=location.hash;
  if(h.includes("#como-funciona")||h.includes("#produtos")){
    const el=$(h.includes("como-funciona")?"#como-funciona":"#produtos");
    if(el)setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}),60);
  }
}

/* ============================================================
   19. INICIALIZAÇÃO
   ============================================================ */
async function iniciar(){
  S=estadoVazio();
  renderFooter();
  renderHeader();
  const app=$("#app");
  if(app)app.innerHTML=`<div class="wrap section-tight"><div class="empty"><div class="big">Carregando o OutdoorHub…</div></div></div>`;
  try{
    await tentarRestaurarSessao();
    await Promise.all([carregarPontos(),carregarEmpresasPublicas()]);
  }catch(e){
    if(app)app.innerHTML=`<div class="wrap section-tight"><div class="empty"><div class="big">Não deu para conectar ao servidor</div>
      <p class="small">${esc(e.message||"O backend pode estar 'acordando' depois de um tempo sem uso — isso leva até 1 minuto na primeira vez. Tente de novo em instantes.")}</p>
      <button class="btn btn-primary mt-16" onclick="iniciar()">Tentar de novo</button></div></div>`;
    return;
  }
  if(!location.hash)location.hash="#/";
  await render();
}
iniciar();
