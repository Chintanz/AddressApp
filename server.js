const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const MasterProfile = {
  full_name: 'Alice Example',
  email: 'alice@example.com',
  phone: '+15551234567',
  address_line1: '123 Main St',
  address_line2: '',
  city: 'Springfield',
  state_province: 'CA',
  postal_code: '94105',
  country: 'USA',
  biometric_verified: true,
  last_sync_date: null
};

const ConnectedEntities = [
  {
    id: 'entity_1',
    name: 'City DMV',
    category: 'government',
    api_protocol: 'REST',
    endpoint_url: 'https://api.mock/dmv/address',
    status: 'active',
    token_valid: true,
    icon_name: 'map'
  },
  {
    id: 'entity_2',
    name: 'UtilityCo',
    category: 'utilities',
    api_protocol: 'SOAP',
    endpoint_url: 'https://api.mock/utilities/updateAddress',
    status: 'active',
    token_valid: true,
    icon_name: 'bolt'
  },
  {
    id: 'entity_3',
    name: 'ShopMax',
    category: 'retail',
    api_protocol: 'GraphQL',
    endpoint_url: 'https://api.mock/shopmax/graphql',
    status: 'active',
    token_valid: true,
    icon_name: 'shopping-cart'
  }
];

const events = [];
let batchCounter = 1;

app.get('/api/profile', (req, res) => {
  res.json(MasterProfile);
});

app.put('/api/profile', (req, res) => {
  const payload = req.body;
  Object.assign(MasterProfile, payload);
  MasterProfile.last_sync_date = MasterProfile.last_sync_date || new Date().toISOString();
  res.json({ status: 'ok', profile: MasterProfile });
});

app.get('/api/entities', (req, res) => {
  res.json(ConnectedEntities);
});

app.post('/api/entities', (req, res) => {
  const payload = req.body;
  const entity = {
    id: `entity_${ConnectedEntities.length + 1}`,
    ...payload,
    status: 'pending_verification',
    token_valid: false
  };
  ConnectedEntities.push(entity);
  res.json(entity);
});

app.post('/api/sync', (req, res) => {
  const { selectedEntityIds, syncType } = req.body;
  if (!selectedEntityIds || selectedEntityIds.length === 0) {
    return res.status(400).json({ error: 'No entities selected.' });
  }

  const batchId = `batch_${batchCounter++}`;
  const results = [];
  const now = new Date().toISOString();

  for (const id of selectedEntityIds) {
    const entity = ConnectedEntities.find((e) => e.id === id);
    if (!entity) {
      results.push({ id, status: 'failed', reason: 'entity_not_found' });
      continue;
    }

    const status = entity.token_valid ? 'success' : 'failed';
    const responseCode = entity.token_valid ? 200 : 401;
    const event = {
      entity_id: entity.id,
      entity_name: entity.name,
      sync_type: syncType || 'address',
      status,
      protocol_used: entity.api_protocol,
      response_code: responseCode,
      duration_ms: Math.floor(Math.random() * 200) + 100,
      error_message: entity.token_valid ? '' : 'token_invalid',
      data_payload_hash: 'sha256:' + Buffer.from(JSON.stringify(MasterProfile)).toString('base64').slice(0, 20),
      batch_id: batchId,
      timestamp: now
    };
    events.push(event);
    results.push({ entity_id: entity.id, status, response_code: responseCode });
  }

  MasterProfile.last_sync_date = now;
  res.json({ batch_id: batchId, results, events: events.filter((e) => e.batch_id === batchId) });
});

app.get('/api/events', (req, res) => {
  res.json(events.slice(-100));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AddressSync backend running on http://localhost:${port}`);
});
