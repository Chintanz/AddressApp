async function getJson(url) { const r = await fetch(url); return r.json(); }

const profileFormIds = ['full_name','email','phone','address_line1','address_line2','city','state_province','postal_code','country'];
const output = document.getElementById('output');
const entitiesDiv = document.getElementById('entities');

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
    div.innerHTML = `<label><input type='checkbox' value='${e.id}' /> ${e.name} (${e.api_protocol}) [${e.status}]</label>`;
    entitiesDiv.appendChild(div);
  });
}

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
  output.innerText = JSON.stringify(d, null, 2);
  await loadProfile();
};

loadProfile();
loadEntities();