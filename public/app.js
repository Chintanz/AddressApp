async function getJson(url) { const r = await fetch(url); return r.json(); }

const profileFormIds = ['full_name','email','phone','address_line1','address_line2','city','state_province','postal_code','country'];
const output = document.getElementById('output');
const entitiesDiv = document.getElementById('entities');
const selectAllBtn = document.getElementById('selectAllBtn');
const retryFailBtn = document.getElementById('retryFailBtn');
const retryInfo = document.getElementById('retryInfo');
const loadProfileBtn = document.getElementById('loadProfile');
let lastFailedEntityIds = [];

async function loadProfile() {
  const profile = await getJson('/api/profile');
  profileFormIds.forEach((id) => { document.getElementById(id).value = profile[id] || ''; });
  document.getElementById('profileStatus').innerText = `Last sync: ${profile.last_sync_date || 'never'}`;
}

async function loadEntities() {
  const entities = await getJson('/api/entities');
  entitiesDiv.innerHTML = '';
  entities.forEach((e) => {
    const row = document.createElement('div');
    row.className = 'entity-item';
    row.innerHTML = `<div class='entity-info'><label><input class='entity-checkbox' type='checkbox' value='${e.id}'> <strong>${e.name}</strong> <span class='tag'>${e.category}</span></label></div><div>${e.api_protocol}</div>`;
    entitiesDiv.appendChild(row);
  });
}

function renderSummary(d, header) {
  let summary = `${header}\nBatch ${d.batch_id}\nSuccess: ${d.results.filter(r => r.status === 'success').length} / ${d.results.length}\n`;
  if (d.results.some((r) => r.status === 'failed')) {
    summary += 'Failed: ' + d.results.filter((r) => r.status === 'failed').length + '\n';
  }
  if (d.events && d.events.length > 0) {
    summary += '\nEntities updated:\n';
    lastFailedEntityIds = [];
    d.events.forEach((e) => {
      summary += `  - ${e.entity_name} (${e.entity_id}) => ${e.status} (${e.protocol_used}, code ${e.response_code})\n`;
      if (e.status === 'failed') lastFailedEntityIds.push(e.entity_id);
    });
    if (lastFailedEntityIds.length > 0) {
      retryInfo.innerText = `Retry available for ${lastFailedEntityIds.length} failed entities.`;
      retryFailBtn.disabled = false;
    } else {
      retryInfo.innerText = 'All entities synced successfully.';
      retryFailBtn.disabled = true;
    }
  }
  output.innerText = summary;
}

selectAllBtn.onclick = () => {
  document.querySelectorAll('.entity-checkbox').forEach((cb) => { cb.checked = true; });
};

loadProfileBtn.onclick = async () => {
  await loadProfile();
  output.innerText = 'Profile refreshed';
};

document.getElementById('saveProfile').onclick = async () => {
  const body = {};
  profileFormIds.forEach((id) => { body[id] = document.getElementById(id).value; });
  const res = await fetch('/api/profile', { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
  const d = await res.json();
  output.innerText = `Saved profile successfully.\n${JSON.stringify(d.profile, null, 2)}`;
  await loadProfile();
};

document.getElementById('syncBtn').onclick = async () => {
  const selected = Array.from(document.querySelectorAll('#entities .entity-checkbox:checked')).map((i) => i.value);
  if (!selected.length) {
    output.innerText = 'Select at least one entity to sync.';
    return;
  }
  const res = await fetch('/api/sync', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ selectedEntityIds:selected, syncType:'address' }) });
  const d = await res.json();
  renderSummary(d, 'Sync Result:');
  await loadProfile();
};

retryFailBtn.onclick = async () => {
  if (!lastFailedEntityIds.length) {
    retryInfo.innerText = 'No failed entities to retry.';
    return;
  }
  const res = await fetch('/api/sync', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ selectedEntityIds:lastFailedEntityIds, syncType:'address' }) });
  const d = await res.json();
  renderSummary(d, 'Retry Result:');
  await loadProfile();
};

loadProfile();
loadEntities();
