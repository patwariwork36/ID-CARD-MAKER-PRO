const DEFAULT_COLORS = {
  '--c-primary': '#1a3a6e',
  '--c-primary-dark': '#0d2248',
  '--c-accent': '#c0392b',
  '--c-strip': '#e8b800',
  '--c-strip-text': '#1a3a6e',
  '--c-header-text': '#ffe082',
  '--c-photo-border': '#1a3a6e',
  '--c-stripe-1': '#ff9800',
  '--c-stripe-2': '#ffffff',
  '--c-stripe-3': '#00897b'
};

const THEMES = {
  navy:     {'--c-primary':'#1a3a6e','--c-primary-dark':'#0d2248','--c-accent':'#c0392b','--c-strip':'#e8b800','--c-strip-text':'#1a3a6e','--c-header-text':'#ffe082','--c-photo-border':'#1a3a6e','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#00897b'},
  maroon:   {'--c-primary':'#7a1f1f','--c-primary-dark':'#4a0e0e','--c-accent':'#1a3a6e','--c-strip':'#ffd54f','--c-strip-text':'#7a1f1f','--c-header-text':'#ffd54f','--c-photo-border':'#7a1f1f','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#7a1f1f'},
  forest:   {'--c-primary':'#1b5e20','--c-primary-dark':'#0d3b13','--c-accent':'#c0392b','--c-strip':'#fff8c4','--c-strip-text':'#1b5e20','--c-header-text':'#fff8c4','--c-photo-border':'#1b5e20','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#1b5e20'},
  royal:    {'--c-primary':'#4a148c','--c-primary-dark':'#2c0a52','--c-accent':'#c0392b','--c-strip':'#ffe082','--c-strip-text':'#4a148c','--c-header-text':'#ffe082','--c-photo-border':'#4a148c','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#4a148c'},
  teal:     {'--c-primary':'#00695c','--c-primary-dark':'#003d34','--c-accent':'#c0392b','--c-strip':'#ffd180','--c-strip-text':'#00695c','--c-header-text':'#ffd180','--c-photo-border':'#00695c','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#00695c'},
  saffron:  {'--c-primary':'#bf5700','--c-primary-dark':'#7a3700','--c-accent':'#1b5e20','--c-strip':'#fff8c4','--c-strip-text':'#bf5700','--c-header-text':'#fff8c4','--c-photo-border':'#bf5700','--c-stripe-1':'#bf5700','--c-stripe-2':'#ffffff','--c-stripe-3':'#1b5e20'},
  charcoal: {'--c-primary':'#37474f','--c-primary-dark':'#1c252a','--c-accent':'#c0392b','--c-strip':'#ffd54f','--c-strip-text':'#37474f','--c-header-text':'#ffd54f','--c-photo-border':'#37474f','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#37474f'},
  crimson:  {'--c-primary':'#b71c1c','--c-primary-dark':'#7a0e0e','--c-accent':'#0d2248','--c-strip':'#ffe082','--c-strip-text':'#b71c1c','--c-header-text':'#ffe082','--c-photo-border':'#b71c1c','--c-stripe-1':'#ff9800','--c-stripe-2':'#ffffff','--c-stripe-3':'#b71c1c'}
};

const DEFAULT_FONTS = {
  f_oh1: 14, f_oh2: 9,
  f_nm: 14, f_po: 11, f_dt: 7.5,
  f_al: 6.5, f_sp: 10,
  f_bl: 7.5, f_bv: 16, f_bmd: 13, f_bsm: 11, f_bblood: 18
};

const DEFAULT_STATE = {
  orient: 'portrait',
  oh1: 'कार्यालय अनुविभागीय अधिकारी (रा.)',
  oh2: 'पलारी, जिला बलौदाबाजार-भाटापारा छ०ग०',
  dept: 'Revenue & Disaster Mgmt Dept, C.G.',
  authLabel: 'Authorised Signatory',
  signPost: 'अनु. अधि. (रा.), पलारी',
  signPosition: 'center',
  signWidth: 96,
  wmSize: 160,
  wmBackSize: 170,
  wmOpacity: 8,
  colors: Object.assign({}, DEFAULT_COLORS),
  fonts: Object.assign({}, DEFAULT_FONTS),
  logo: '', sign: '',
  people: [{
    name: 'Mr. Rajat Kumar Verma', post: 'Patwari',
    father: 'Mr. Bhagirathi Verma', empId: '19070060046',
    dob: '03/06/1993', blood: 'B+', contact: '9977895556',
    address: 'Tahsil Office Palari,\nDist. Balodabazar-Bhatapara, C.G.',
    photo: ''
  }],
  current: 0
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
try {
  const saved = localStorage.getItem('idCardStateV3');
  if (saved) {
    const parsed = JSON.parse(saved);
    state = Object.assign({}, DEFAULT_STATE, parsed);
    state.fonts = Object.assign({}, DEFAULT_FONTS, parsed.fonts || {});
    state.colors = Object.assign({}, DEFAULT_COLORS, parsed.colors || {});
    if (!state.people || !state.people.length) state.people = DEFAULT_STATE.people;
  }
} catch(e){}

function persist(){ try{ localStorage.setItem('idCardStateV3', JSON.stringify(state)); }catch(e){} }

function toggleSection(h){
  h.classList.toggle('collapsed');
  const next = h.nextElementSibling;
  if (next && next.classList.contains('section-content')) next.classList.toggle('collapsed');
}

function setOrient(o){
  state.orient = o;
  document.getElementById('b-portrait').classList.toggle('active', o==='portrait');
  document.getElementById('b-landscape').classList.toggle('active', o==='landscape');
  render();
}

// Removes near-white background from a signature image and returns a clean transparent PNG
function cleanSignatureBackground(dataUrl, threshold){
  threshold = threshold || 200;  // pixels brighter than this → transparent
  return new Promise(function(resolve){
    const img = new Image();
    img.onload = function(){
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4){
        const r = d[i], g = d[i+1], b = d[i+2];
        const brightness = (r + g + b) / 3;
        if (brightness > threshold){
          // make transparent
          d[i+3] = 0;
        } else {
          // darken remaining pixels for cleaner ink
          // optional: force to dark grey/black if very dark already
          if (brightness < 90){
            d[i] = 20; d[i+1] = 20; d[i+2] = 20;
          }
          // smooth alpha based on darkness for anti-aliasing
          const alpha = Math.min(255, Math.round((threshold - brightness) * 1.6));
          d[i+3] = alpha;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = function(){ resolve(dataUrl); };
    img.src = dataUrl;
  });
}

// ═══ CLEAR HANDLERS ═══
function clearFileInput(id){
  const el = document.getElementById(id);
  if (el) el.value = '';
  // also clear status if bulk
  if (id === 'bulkExcel' || id === 'bulkZip'){
    const status = document.getElementById('bulkStatus');
    if (status) { status.textContent = ''; status.className = 'status'; }
  }
}

function clearImage(key){
  const labels = {logo:'logo', sign:'signature', photo:'photo'};
  if (!confirm('Remove uploaded ' + labels[key] + '?')) return;

  if (key === 'logo'){
    state.logo = '';
    clearFileInput('logoFile');
  } else if (key === 'sign'){
    state.sign = '';
    state._signRaw = '';
    clearFileInput('signFile');
  } else if (key === 'photo'){
    state.people[state.current].photo = '';
    clearFileInput('photoFile');
  }
  render();
}

function loadImg(ev, key){
  const file = ev.target.files[0]; if(!file) return;
  const r = new FileReader();
  r.onload = async e => {
    let result = e.target.result;
    if (key === 'sign'){
      // remember the raw original so we can re-clean with different threshold
      state._signRaw = result;
      const th = parseInt(document.getElementById('signThreshold').value || '200');
      try { result = await cleanSignatureBackground(result, th); } catch(err){}
    }
    if (key === 'photo') state.people[state.current].photo = result;
    else state[key] = result;
    render();
  };
  r.readAsDataURL(file);
}

async function onThresholdChange(val){
  document.getElementById('signThresholdVal').textContent = val;
  if (!state._signRaw) return;  // no image uploaded yet
  try {
    state.sign = await cleanSignatureBackground(state._signRaw, parseInt(val));
    render();
  } catch(err){}
}

function updateField(field, val){
  state.people[state.current][field] = val;
  if (field === 'name') renderTabs();
  render();
}
function updateGlobal(key, val){ state[key] = val; render(); }

function updateSize(stateKey, val, displayId, unit){
  const v = parseFloat(val);
  if (stateKey === 'signWidth' || stateKey === 'wmSize' || stateKey === 'wmBackSize' || stateKey === 'wmOpacity'){
    state[stateKey] = v;
  } else {
    state.fonts[stateKey] = v;
  }
  document.getElementById(displayId).textContent = v + unit;
  render();
}

function resetFonts(){
  state.fonts = Object.assign({}, DEFAULT_FONTS);
  syncFontInputs();
  render();
}

// ─── COLORS ───
function applyColorsToCSS(){
  const root = document.documentElement;
  const colors = state.colors || DEFAULT_COLORS;
  Object.keys(colors).forEach(k => root.style.setProperty(k, colors[k]));
}

function updateColor(varName, value){
  if (!state.colors) state.colors = Object.assign({}, DEFAULT_COLORS);
  state.colors[varName] = value;
  document.documentElement.style.setProperty(varName, value);
  render();  // also persist
}

function applyTheme(themeName){
  const theme = THEMES[themeName];
  if (!theme) return;
  state.colors = Object.assign({}, theme);
  applyColorsToCSS();
  syncColorInputs();
  render();
}

function resetColors(){
  state.colors = Object.assign({}, DEFAULT_COLORS);
  applyColorsToCSS();
  syncColorInputs();
  render();
}

function syncColorInputs(){
  const colors = state.colors || DEFAULT_COLORS;
  Object.keys(colors).forEach(k => {
    const el = document.getElementById('cVar_' + k.replace('--',''));
    if (el) el.value = colors[k];
  });
}

function syncFontInputs(){
  const f = state.fonts;
  Object.keys(DEFAULT_FONTS).forEach(k => {
    const el = document.getElementById(k);
    const dis = document.getElementById('v_' + k.substring(2));
    if (el) el.value = f[k];
    if (dis) dis.textContent = f[k] + 'px';
  });
}

function syncInputsToCurrent(){
  const p = state.people[state.current] || {};
  ['name','post','father','empId','dob','blood','contact','address'].forEach(k=>{
    const el = document.getElementById(k);
    if (el) el.value = p[k] || '';
  });
  ['oh1','oh2','dept','authLabel','signPost'].forEach(k=>{
    const el = document.getElementById(k);
    if (el) el.value = state[k] || '';
  });
  document.getElementById('signSize').value = state.signWidth || 96;
  document.getElementById('signSizeVal').textContent = (state.signWidth||96) + 'px';
  // watermark
  const wms = state.wmSize || 160, wmbs = state.wmBackSize || 170, wmo = state.wmOpacity || 8;
  if (document.getElementById('wmSize')){
    document.getElementById('wmSize').value = wms;
    document.getElementById('wmSizeVal').textContent = wms + 'px';
    document.getElementById('wmBackSize').value = wmbs;
    document.getElementById('wmBackSizeVal').textContent = wmbs + 'px';
    document.getElementById('wmOpacity').value = wmo;
    document.getElementById('wmOpacityVal').textContent = wmo + '%';
  }
  document.querySelectorAll('.pos-cell').forEach(c => c.classList.remove('active'));
  const cell = document.querySelector('.pos-cell[data-pos="' + (state.signPosition||'center') + '"]');
  if (cell) cell.classList.add('active');
  syncFontInputs();
  syncColorInputs();
  applyColorsToCSS();
}

function addPerson(){
  const tmpl = state.people[state.current] || {};
  state.people.push({
    name: 'New Person', post: tmpl.post || 'Patwari',
    father: '', empId: '', dob: '', blood: '', contact: '',
    address: tmpl.address || '', photo: ''
  });
  state.current = state.people.length - 1;
  syncInputsToCurrent(); renderTabs(); render();
}
function removePerson(){
  if (state.people.length <= 1) return alert('At least 1 person required');
  state.people.splice(state.current, 1);
  state.current = Math.max(0, state.current - 1);
  syncInputsToCurrent(); renderTabs(); render();
}
function clearAll(){
  if (!confirm('Clear all people?')) return;
  state.people = [JSON.parse(JSON.stringify(DEFAULT_STATE.people[0]))];
  state.current = 0;
  syncInputsToCurrent(); renderTabs(); render();
}
function selectPerson(idx){
  state.current = idx;
  syncInputsToCurrent(); renderTabs(); render();
}
function renderTabs(){
  document.getElementById('peopleCount').textContent = state.people.length;
  document.getElementById('personTabs').innerHTML = state.people.map((p,i)=>
    '<button class="' + (i===state.current?'active':'') + '" onclick="selectPerson(' + i + ')">' + (i+1) + '. ' + escapeHtml((p.name||'?').substring(0,14)) + '</button>'
  ).join('');
}

document.querySelectorAll('.pos-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    state.signPosition = cell.dataset.pos;
    document.querySelectorAll('.pos-cell').forEach(c => c.classList.remove('active'));
    cell.classList.add('active');
    render();
  });
});

function exportData(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'id_card_data.json'; a.click();
  URL.revokeObjectURL(url);
}
function importData(ev){
  const file = ev.target.files[0]; if(!file) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const loaded = JSON.parse(e.target.result);
      state = Object.assign({}, DEFAULT_STATE, loaded);
      state.fonts = Object.assign({}, DEFAULT_FONTS, loaded.fonts || {});
  state.colors = Object.assign({}, DEFAULT_COLORS, loaded.colors || {});
  applyColorsToCSS();
      state.colors = Object.assign({}, DEFAULT_COLORS, loaded.colors || {});
      applyColorsToCSS();
      state.current = state.current || 0;
      syncInputsToCurrent(); renderTabs(); render();
    } catch(err){ alert('Invalid file'); }
  };
  r.readAsText(file);
}

// BULK IMPORT
async function readExcelRows(file){
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, {type:'array'});
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, {defval:''});
}
async function readPhotosZip(file){
  if (!file) return {};
  const zip = await JSZip.loadAsync(file);
  const photos = {};
  for (const fname of Object.keys(zip.files)){
    const entry = zip.files[fname];
    if (entry.dir) continue;
    if (!/\.(jpe?g|png|webp)$/i.test(fname)) continue;
    const blob = await entry.async('blob');
    const dataUrl = await new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.readAsDataURL(blob);
    });
    const base = fname.split('/').pop().replace(/\.(jpe?g|png|webp)$/i, '').trim();
    photos[base] = dataUrl;
  }
  return photos;
}
function findKey(obj, ...candidates){
  const keys = Object.keys(obj);
  for (const c of candidates){
    const found = keys.find(k => String(k).trim().toUpperCase() === c.trim().toUpperCase());
    if (found) return obj[found];
  }
  return '';
}
async function doBulkImport(){
  const status = document.getElementById('bulkStatus');
  const xlFile = document.getElementById('bulkExcel').files[0];
  const zipFile = document.getElementById('bulkZip').files[0];
  if (!xlFile){ status.textContent='⚠️ Excel file required'; status.className='status err'; return; }

  // Check libraries are loaded
  if (typeof XLSX === 'undefined'){
    status.textContent = '❌ Excel library not loaded. Connect to internet and refresh.';
    status.className = 'status err';
    return;
  }
  if (zipFile && typeof JSZip === 'undefined'){
    status.textContent = '❌ ZIP library not loaded. Connect to internet and refresh.';
    status.className = 'status err';
    return;
  }

  status.textContent='⏳ Processing…'; status.className='status';
  try {
    const [rows, photos] = await Promise.all([readExcelRows(xlFile), readPhotosZip(zipFile)]);
    const newPeople = []; let withPhoto = 0;
    for (const r of rows){
      const name = String(findKey(r,'NAME')||'').trim();
      if (!name) continue;
      const empIdRaw = findKey(r,'EMPLOYEE CODE','EMP ID','EMPLOYEE ID','ID');
      const empId = empIdRaw === '' ? '' : String(empIdRaw).replace(/\..*$/,'');
      const father = String(findKey(r,"FATHER'S NAME",'FATHER NAME','FATHERS NAME')||'').trim();
      const dob = String(findKey(r,'DOB','DOB (DD/MM/YYY)','DOB (DD/MM/YYYY)','DATE OF BIRTH')||'').trim();
      const post = String(findKey(r,'POST','POSITION')||'Patwari').trim();
      const blood = String(findKey(r,'BLOOD GROUP','BLOOD')||'').trim();
      const contactRaw = findKey(r,'CONTACT NUMBER','CONTACT','MOBILE','PHONE');
      const contact = contactRaw === '' ? '' : String(contactRaw).replace(/\..*$/,'');
      const address = String(findKey(r,'OFFICE ADRESS','OFFICE ADDRESS','ADDRESS')||'').trim() || (state.people[0]?.address || '');
      const photo = photos[empId] || '';
      if (photo) withPhoto++;
      newPeople.push({name, post, father, empId, dob, blood, contact, address, photo});
    }
    if (!newPeople.length){ status.textContent='❌ No valid rows'; status.className='status err'; return; }
    state.people = newPeople;
    state.current = 0;
    syncInputsToCurrent(); renderTabs(); render();
    status.textContent = '✅ Imported ' + newPeople.length + ' people · ' + withPhoto + ' with photos';
    status.className='status';
  } catch(err){
    status.textContent='❌ Error: ' + err.message;
    status.className='status err';
  }
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ═══ KEY: Calculate name block height based on actual NAME font size + name length ═══
function getNameBlockSize(name, nameFontPx, postFontPx){
  // chars per line at this font size: roughly 184px / (font * 0.55)
  const cardInnerWidth = 188; // 204 - 16 padding
  const charWidth = nameFontPx * 0.55;
  const charsPerLine = Math.floor(cardInnerWidth / charWidth);
  const nameLines = Math.max(1, Math.ceil((name||'').length / charsPerLine));
  // Block height = name lines * (nameFontPx * 1.25) + post (postFontPx * 1.4) + gap 4
  const nameH = nameLines * Math.round(nameFontPx * 1.25);
  const postH = Math.round(postFontPx * 1.6);
  const totalH = nameH + postH + 6;  // gap+padding
  return Math.max(38, Math.min(totalH, 70));  // clamp 38-70
}

function renderPortrait(p){
  const f = state.fonts;
  const wmS = state.wmSize || 160;
  const wmBS = state.wmBackSize || 170;
  const wmO = (state.wmOpacity || 8) / 100;
  const wmStyle = 'width:' + wmS + 'px;height:' + wmS + 'px;opacity:' + wmO + ';';
  const wmBackStyle = 'width:' + wmBS + 'px;height:' + wmBS + 'px;opacity:' + wmO + ';';
  const nbH = getNameBlockSize(p.name, f.f_nm, f.f_po);
  const pwH = Math.max(60, 224 - nbH - 18 - 68 - 4);
  const photoInnerH = pwH - 8;
  const photoW = Math.floor(photoInnerH * 0.83);
  const sw = state.signWidth || 96;
  const sh = Math.round(sw * 0.31);
  const slW = Math.min(sw + 20, 180);
  const posClass = state.signPosition === 'left' ? 'left' : state.signPosition === 'right' ? 'right' : 'center';

  const front =
    '<div class="card-pair"><div class="card-label">Front — ' + escapeHtml(p.name||'') + '</div>' +
    '<div class="card portrait">' +
    (state.logo ? '<img class="wm" src="' + state.logo + '" style="' + wmStyle + '"/>' : '') +
    '<div class="fh">' +
    (state.logo ? '<img class="logo" src="' + state.logo + '"/>' : '') +
    '<div class="oh1" style="font-size:' + f.f_oh1 + 'px;">' + escapeHtml(state.oh1) + '</div>' +
    '<div class="oh2" style="font-size:' + f.f_oh2 + 'px;">' + escapeHtml(state.oh2) + '</div>' +
    '</div>' +
    '<div class="strip">पहचान पत्र · Identity Card</div>' +
    '<div class="pw" style="height:' + pwH + 'px;"><div class="pb" style="height:' + photoInnerH + 'px;width:' + photoW + 'px;">' +
    (p.photo ? '<img src="' + p.photo + '"/>' : '<span style="font-size:8px;color:#aaa">Photo</span>') +
    '</div></div>' +
    '<div class="nb" style="height:' + nbH + 'px;">' +
    '<div class="nm" style="font-size:' + f.f_nm + 'px;">' + escapeHtml(p.name||'') + '</div>' +
    '<div class="po" style="font-size:' + f.f_po + 'px;">' + escapeHtml(p.post||'') + '</div>' +
    '</div>' +
    '<div class="dr"><span class="dt" style="font-size:' + f.f_dt + 'px;">' + escapeHtml(state.dept) + '</span></div>' +
    '<div class="sb"><div class="sb-inner ' + posClass + '">' +
    '<div class="al" style="font-size:' + f.f_al + 'px;">' + escapeHtml(state.authLabel) + '</div>' +
    (state.sign ? '<img class="si" src="' + state.sign + '" style="width:' + sw + 'px;height:' + sh + 'px;"/>' : '<div style="height:' + sh + 'px"></div>') +
    '<div class="sl" style="width:' + slW + 'px;"></div>' +
    '<div class="sp" style="font-size:' + f.f_sp + 'px;">' + escapeHtml(state.signPost) + '</div>' +
    '</div></div><div class="cs"></div></div></div>';

  const back =
    '<div class="card-pair"><div class="card-label">Back — ' + escapeHtml(p.name||'') + '</div>' +
    '<div class="bcard portrait">' +
    (state.logo ? '<img class="bwm" src="' + state.logo + '" style="' + wmBackStyle + '"/>' : '') +
    '<div class="btop"></div><div class="bb">' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Employee ID</span><span class="bv" style="font-size:' + f.f_bv + 'px;">' + escapeHtml(p.empId||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Father\'s Name</span><span class="bv bmd" style="font-size:' + f.f_bmd + 'px;">' + escapeHtml(p.father||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Date of Birth</span><span class="bv" style="font-size:' + f.f_bv + 'px;">' + escapeHtml(p.dob||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Blood Group</span><span class="bv bblood" style="font-size:' + f.f_bblood + 'px;">' + escapeHtml(p.blood||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Contact</span><span class="bv" style="font-size:' + f.f_bv + 'px;">' + escapeHtml(p.contact||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + f.f_bl + 'px;">Office Address</span><span class="bv bsm" style="font-size:' + f.f_bsm + 'px;">' + escapeHtml(p.address||'').replace(/\n/g,'<br>') + '</span></div>' +
    '</div><div class="bbot"></div></div></div>';

  return front + back;
}

function renderLandscape(p){
  const f = state.fonts;
  const wmS = state.wmSize || 160;
  const wmBS = state.wmBackSize || 170;
  const wmO = (state.wmOpacity || 8) / 100;
  const wmStyle = 'width:' + wmS + 'px;height:' + wmS + 'px;opacity:' + wmO + ';';
  const wmBackStyle = 'width:' + wmBS + 'px;height:' + wmBS + 'px;opacity:' + wmO + ';';
  const sw = Math.min(state.signWidth || 78, 90);
  const sh = Math.round(sw * 0.31);
  const slW = Math.min(sw, 80);

  const signColLeft =
    '<div class="sign-col left-pos">' +
    '<div class="al" style="font-size:' + (f.f_al-1) + 'px;">' + escapeHtml(state.authLabel) + '</div>' +
    (state.sign ? '<img class="si" src="' + state.sign + '" style="width:' + sw + 'px;height:' + sh + 'px;"/>' : '<div style="height:' + sh + 'px"></div>') +
    '<div class="sl" style="width:' + slW + 'px;"></div>' +
    '<div class="sp" style="font-size:' + (f.f_sp-2) + 'px;">' + escapeHtml(state.signPost) + '</div>' +
    '</div>';
  const signColRight =
    '<div class="sign-col">' +
    '<div class="al" style="font-size:' + (f.f_al-1) + 'px;">' + escapeHtml(state.authLabel) + '</div>' +
    (state.sign ? '<img class="si" src="' + state.sign + '" style="width:' + sw + 'px;height:' + sh + 'px;"/>' : '<div style="height:' + sh + 'px"></div>') +
    '<div class="sl" style="width:' + slW + 'px;"></div>' +
    '<div class="sp" style="font-size:' + (f.f_sp-2) + 'px;">' + escapeHtml(state.signPost) + '</div>' +
    '</div>';
  const photoCol = '<div class="photo-col"><div class="pb">' +
    (p.photo ? '<img src="' + p.photo + '"/>' : '<span style="font-size:7px;color:#aaa">Photo</span>') +
    '</div></div>';
  const infoCol = '<div class="info-col">' +
    '<div class="nm" style="font-size:' + (f.f_nm-1) + 'px;">' + escapeHtml(p.name||'') + '</div>' +
    '<div class="po" style="font-size:' + (f.f_po-1) + 'px;">' + escapeHtml(p.post||'') + '</div>' +
    '<div class="dt" style="font-size:' + f.f_dt + 'px;">' + escapeHtml(state.dept) + '</div>' +
    '</div>';

  const bodyContent = state.signPosition === 'left' ? signColLeft + photoCol + infoCol : photoCol + infoCol + signColRight;

  const front =
    '<div class="card-pair"><div class="card-label">Front — ' + escapeHtml(p.name||'') + '</div>' +
    '<div class="card landscape">' +
    (state.logo ? '<img class="wm" src="' + state.logo + '" style="' + wmStyle + '"/>' : '') +
    '<div class="fh">' +
    (state.logo ? '<img class="logo" src="' + state.logo + '"/>' : '') +
    '<div class="header-text-l"><div class="oh1" style="font-size:' + (f.f_oh1-3) + 'px;">' + escapeHtml(state.oh1) + '</div><div class="oh2" style="font-size:' + (f.f_oh2-1) + 'px;">' + escapeHtml(state.oh2) + '</div></div>' +
    '</div>' +
    '<div class="strip">पहचान पत्र · Identity Card</div>' +
    '<div class="body-l">' + bodyContent + '</div>' +
    '<div class="cs"></div></div></div>';

  const back =
    '<div class="card-pair"><div class="card-label">Back — ' + escapeHtml(p.name||'') + '</div>' +
    '<div class="bcard landscape">' +
    (state.logo ? '<img class="bwm" src="' + state.logo + '" style="' + wmBackStyle + '"/>' : '') +
    '<div class="btop"></div><div class="bb">' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Employee ID</span><span class="bv" style="font-size:' + (f.f_bv-5) + 'px;">' + escapeHtml(p.empId||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Date of Birth</span><span class="bv" style="font-size:' + (f.f_bv-5) + 'px;">' + escapeHtml(p.dob||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Father\'s Name</span><span class="bv bmd" style="font-size:' + (f.f_bmd-3.5) + 'px;">' + escapeHtml(p.father||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Blood Group</span><span class="bv bblood" style="font-size:' + (f.f_bblood-5) + 'px;">' + escapeHtml(p.blood||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Contact</span><span class="bv" style="font-size:' + (f.f_bv-5) + 'px;">' + escapeHtml(p.contact||'') + '</span></div>' +
    '<div class="br"><span class="bl" style="font-size:' + (f.f_bl-1) + 'px;">Office Address</span><span class="bv bsm" style="font-size:' + (f.f_bsm-3) + 'px;">' + escapeHtml(p.address||'').replace(/\n/g,'<br>') + '</span></div>' +
    '</div><div class="bbot"></div></div></div>';

  return front + back;
}

function render(){
  persist();
  const fn = state.orient === 'portrait' ? renderPortrait : renderLandscape;
  document.getElementById('preview').innerHTML = state.people.map(fn).join('');
}

syncInputsToCurrent();
renderTabs();
render();

// ════════════════════════════════════════════════════
// ENHANCED FEATURES: Profiles, Offline detection, Auto-backup
// ════════════════════════════════════════════════════

// ── 1. ONLINE/OFFLINE STATUS ──
function updateNetStatus(){
  const online = navigator.onLine;
  const dot = document.getElementById('netDot');
  const text = document.getElementById('netStatus');
  if (!dot || !text) return;
  if (online){
    dot.className = 'status-dot online';
    text.textContent = '🌐 Online';
  } else {
    dot.className = 'status-dot offline';
    text.textContent = '✈️ Offline (manual mode only)';
  }
}
window.addEventListener('online', updateNetStatus);
window.addEventListener('offline', updateNetStatus);
updateNetStatus();

// Check if libraries loaded
setTimeout(() => {
  const xlsxOk = typeof XLSX !== 'undefined';
  const zipOk = typeof JSZip !== 'undefined';
  if (!xlsxOk || !zipOk){
    const text = document.getElementById('netStatus');
    if (text && !navigator.onLine){
      text.textContent = '✈️ Offline · Bulk import disabled';
    } else if (text){
      text.textContent = '⚠️ Libraries loading…';
    }
  }
}, 1500);

// ── 2. STORAGE SIZE INDICATOR ──
function updateStorageStatus(){
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i);
      total += (k.length + (localStorage.getItem(k) || '').length) * 2;
    }
    const kb = Math.round(total / 1024);
    const el = document.getElementById('storageStatus');
    if (el) el.textContent = '💾 ' + kb + ' KB saved';
  } catch(e){}
}
setInterval(updateStorageStatus, 5000);
updateStorageStatus();

// ── 3. AUTO-BACKUP — every 5 min download offered ──
let lastBackupTime = parseInt(localStorage.getItem('lastBackupTime') || '0');
function maybeOfferAutoBackup(){
  const now = Date.now();
  // Offer backup if 24 hours passed since last download
  if (now - lastBackupTime > 24 * 60 * 60 * 1000 && state.people.length > 1){
    const wantBackup = confirm('💾 Daily backup reminder\n\nIt has been a while since you last saved your data. Download a backup JSON now? (Recommended)');
    if (wantBackup){
      exportData();
      lastBackupTime = now;
      localStorage.setItem('lastBackupTime', String(now));
    } else {
      // postpone for 4 hours
      lastBackupTime = now - (20 * 60 * 60 * 1000);
      localStorage.setItem('lastBackupTime', String(lastBackupTime));
    }
  }
}
// Check on load if many people
setTimeout(maybeOfferAutoBackup, 3000);

// ── 4. PROFILES SYSTEM ──
const PROFILES_KEY = 'idCardProfiles';

function loadProfilesFromStorage(){
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
  } catch(e){ return {}; }
}

function saveProfilesToStorage(profiles){
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    return true;
  } catch(e){
    alert('⚠️ Storage limit reached. Try exporting profiles to JSON file.');
    return false;
  }
}

function refreshProfileSelect(){
  const sel = document.getElementById('profileSelect');
  if (!sel) return;
  const profiles = loadProfilesFromStorage();
  const names = Object.keys(profiles);
  sel.innerHTML = '<option value="">— Load a saved profile —</option>' +
    names.map(n => '<option value="' + escapeHtml(n) + '">' + escapeHtml(n) + ' (' + (profiles[n].people?.length || 0) + ' people)</option>').join('');
}

function saveProfile(){
  const nameEl = document.getElementById('profileName');
  const name = (nameEl?.value || '').trim();
  if (!name){ alert('Please enter a profile name'); return; }
  const profiles = loadProfilesFromStorage();
  if (profiles[name] && !confirm('Profile "' + name + '" exists. Overwrite?')) return;
  profiles[name] = JSON.parse(JSON.stringify(state));
  if (saveProfilesToStorage(profiles)){
    refreshProfileSelect();
    nameEl.value = '';
    alert('✅ Profile "' + name + '" saved successfully!');
  }
}

function loadProfile(name){
  if (!name) return;
  const profiles = loadProfilesFromStorage();
  if (!profiles[name]){ alert('Profile not found'); return; }
  if (!confirm('Load profile "' + name + '"? Current unsaved changes will be lost.')) return;
  const loaded = profiles[name];
  state = Object.assign({}, DEFAULT_STATE, loaded);
  state.fonts = Object.assign({}, DEFAULT_FONTS, loaded.fonts || {});
  state.colors = Object.assign({}, DEFAULT_COLORS, loaded.colors || {});
  applyColorsToCSS();
  state.current = 0;
  syncInputsToCurrent(); renderTabs(); render();
}

function deleteProfile(){
  const sel = document.getElementById('profileSelect');
  const name = sel?.value;
  if (!name){ alert('Select a profile first'); return; }
  if (!confirm('Delete profile "' + name + '"? This cannot be undone.')) return;
  const profiles = loadProfilesFromStorage();
  delete profiles[name];
  saveProfilesToStorage(profiles);
  refreshProfileSelect();
  sel.value = '';
}

function exportAllProfiles(){
  const profiles = loadProfilesFromStorage();
  if (!Object.keys(profiles).length){ alert('No profiles to export'); return; }
  const blob = new Blob([JSON.stringify(profiles, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.href = url; a.download = 'idcard_profiles_' + date + '.json'; a.click();
  URL.revokeObjectURL(url);
}

function importProfiles(ev){
  const file = ev.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const incoming = JSON.parse(e.target.result);
      if (typeof incoming !== 'object' || Array.isArray(incoming)){
        alert('Invalid profiles file format');
        return;
      }
      const existing = loadProfilesFromStorage();
      let added = 0, skipped = 0;
      for (const name in incoming){
        if (existing[name]){
          if (!confirm('Profile "' + name + '" exists. Overwrite?')){
            skipped++;
            continue;
          }
        }
        existing[name] = incoming[name];
        added++;
      }
      saveProfilesToStorage(existing);
      refreshProfileSelect();
      alert('✅ Imported ' + added + ' profiles. Skipped ' + skipped + '.');
    } catch(err){ alert('Invalid file: ' + err.message); }
  };
  r.readAsText(file);
}

refreshProfileSelect();