async function getJson(url) { const r = await fetch(url); return r.json(); }

const fields = ['full_name','email','phone','address_line1','address_line2','city','state_province','postal_code','country'];
const outputEl = document.getElementById('output');
const entitiesEl = document.getElementById('entities');
const searchInput = document.getElementById('searchInput');
let allEntities = [];
let lastFailed = [];

async function loadProfile() {
  const profile = await getJson('/api/profile');
  fields.forEach((f) => { const el = document.getElementById(f); if(el) el.value = profile[f] || ''; });
  document.getElementById('profileStatus').innerText = `Last sync: ${profile.last_sync_date || 'never'}`;
}

function renderEntities(filter='') {
  const query = filter.trim().toLowerCase();
  const list = query ? allEntities.filter((e) => e.name.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)) : allEntities;
  entitiesEl.innerHTML = list.map((e) => `<div class='entity-item'><label class='entity-main'><input class='entity-checkbox' type='checkbox' value='${e.id}'> <span>${e.name}</span></label><div><span class='tag'>${e.category}</span> <span class='status-pill'>${e.api_protocol}</span></div></div>`).join('');
}

async function loadEntities() {
  allEntities = await getJson('/api/entities');
  renderEntities(searchInput.value);
}

function log(message) { outputEl.innerText = message; }

function syncSummary(batch, title) {
  const success = batch.results.filter(r => r.status === 'success').length;
  const failed = batch.results.filter(r => r.status === 'failed').length;
  lastFailed = batch.results.filter(r => r.status === 'failed').map(r => r.entity_id);
  let text = `${title}\nBatch ${batch.batch_id}\nSuccess: ${success} / ${batch.results.length}\nFailed: ${failed}\n`;
  if(batch.events?.length){ text += '\nEntities:\n' + batch.events.map((e) => `- ${e.entity_name} (${e.protocol_used}) => ${e.status}`).join('\n'); }
  outputEl.innerText = text;
  document.getElementById('retryInfo').innerText = failed ? `Retry available for ${failed} entities.` : 'All synced successfully.';
  document.getElementById('retryFailBtn').disabled = failed === 0;
}

searchInput.oninput = () => renderEntities(searchInput.value);

document.getElementById('selectAllBtn').onclick = () => {
  document.querySelectorAll('.entity-checkbox').forEach((cb) => cb.checked = true);
};

document.getElementById('saveProfile').onclick = async () => {
  const body = {};
  fields.forEach((f) => { body[f] = document.getElementById(f).value; });
  const res = await fetch('/api/profile', { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
  const data = await res.json();
  log(`Saved profile. \n${JSON.stringify(data.profile, null, 2)}`);
  await loadProfile();
};

document.getElementById('loadProfile').onclick = async () => {
  await loadProfile();
  log('Profile refreshed.');
};

document.getElementById('syncBtn').onclick = async () => {
  const selected = Array.from(document.querySelectorAll('.entity-checkbox:checked')).map((c) => c.value);
  if (!selected.length) { log('Select at least one entity.'); return; }
  const res = await fetch('/api/sync', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ selectedEntityIds:selected, syncType:'address' }) });
  const data = await res.json();
  syncSummary(data, 'Sync Result:');
  await loadProfile();
};

document.getElementById('retryFailBtn').onclick = async () => {
  if(!lastFailed.length){ log('No failed entities to retry.'); return; }
  const res = await fetch('/api/sync', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ selectedEntityIds:lastFailed, syncType:'address' }) });
  const data = await res.json();
  syncSummary(data, 'Retry Result:');
  await loadProfile();
};

loadProfile();
loadEntities();
