const fetch = require('node-fetch');

async function run() {
  const base = 'http://localhost:3000';

  console.log('1) Fetch profile');
  let res = await fetch(`${base}/api/profile`);
  console.log('profile status', res.status);
  let profile = await res.json();
  console.log(profile);

  console.log('2) Update profile');
  res = await fetch(`${base}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city: 'London', country: 'UK', address_line1: '221B Baker Street', postal_code: 'NW1 6XE' })
  });
  console.log('update status', res.status);
  const updated = await res.json();
  console.log(updated);

  console.log('3) Get entities');
  res = await fetch(`${base}/api/entities`);
  const entities = await res.json();
  console.log('entities count', entities.length);

  const selected = entities.slice(0, 10).map(e => e.id);
  console.log('4) Sync to first 10 entities', selected);
  res = await fetch(`${base}/api/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedEntityIds: selected, syncType: 'address' })
  });
  const syncRes = await res.json();
  console.log('sync result:', JSON.stringify(syncRes, null, 2));

  const failed = syncRes.results.filter(r => r.status === 'failed').map(r => r.entity_id);
  if (failed.length > 0) {
    console.log('5) Retry failed:', failed);
    res = await fetch(`${base}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedEntityIds: failed, syncType: 'address' })
    });
    const retryRes = await res.json();
    console.log('retry result:', JSON.stringify(retryRes, null, 2));
  } else {
    console.log('No failed entities to retry.');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});