async function getJson(url) { const r = await fetch(url); return r.json(); }

const profileFormIds = ['full_name','email','phone','address_line1','address_line2','city','state_province','postal_code','country'];
const output = document.getElementById('output');
const entitiesDiv = document.getElementById('entities');
const selectAllBtn = document.getElementById('selectAllBtn');

async function loadProfile() {
  const profile = await getJson('/api/profile');
  profileFormIds.forEach((id) => { document.getElementById(id).value = profile[id] || ''; });
  document.getElementById('profileStatus').innerText = `Last sync: ${profile.last_sync_date || 'never'}`;
}

async function loadEntities() {
  const entities = await getJson('/api/entities');
  entitiesDiv.innerHTML = '';
  entities.forEach((e) => {
    const div = document.createElement('div');
    div.innerHTML = `<label><input class='entity-checkbox' type='checkbox' value='${e.id}' /> ${e.name} (${e.api_protocol}) [${e.status}]</label>`;
    entitiesDiv.appendChild(div);
  });
}

selectAllBtn.onclick = () => {
  const checkboxes = document.querySelectorAll('.entity-checkbox');
  checkboxes.forEach((cb) => { cb.checked = true; });
};

document.getElementById('saveProfile').onclick = async () => {
  const body = {};
  profileFormIds.forEach((id) => { body[id] = document.getElementById(id).value; });
  const res = await fetch('/api/profile', { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
  const d = await res.json();
  output.innerText = JSON.stringify(d, null, 2);
  await loadProfile();
};

document.getElementById('syncBtn').onclick = async () => {
  const selected = Array.from(document.querySelectorAll('#entities input:checked')).map((i) => i.value);
  if (!selected.length) {
    output.innerText = 'Select at least one entity';
    return;
  }
  const res = await fetch('/api/sync', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ selectedEntityIds:selected, syncType:'address' }) });
  const d = await res.json();
  let summary = `Batch ${d.batch_id}\nSuccess: ${d.results.filter(r => r.status === 'success').length} / ${d.results.length}\n`;
  if (d.results.some((r) => r.status === 'failed')) {
    summary += 'Failed: ' + d.results.filter((r) => r.status === 'failed').length + '\n';
  }
  if (d.events && d.events.length > 0) {
    summary += '\nEntities updated:\n';
    d.events.forEach((e) => {
      summary += `  - ${e.entity_name} (${e.entity_id}) => ${e.status} (${e.protocol_used}, code ${e.response_code})\n`;
    });
  }
  output.innerText = summary;
  await loadProfile();
};

loadProfile();
loadEntities();