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
  { id: 'entity_1', name: 'City DMV', category: 'government', api_protocol: 'REST', endpoint_url: 'https://api.mock/dmv/address', status: 'active', token_valid: true, icon_name: 'map' },
  { id: 'entity_2', name: 'UtilityCo', category: 'utilities', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/utilities/updateAddress', status: 'active', token_valid: true, icon_name: 'bolt' },
  { id: 'entity_3', name: 'ShopMax', category: 'retail', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/shopmax/graphql', status: 'active', token_valid: true, icon_name: 'shopping-cart' },
  { id: 'entity_4', name: 'State Tax Agency', category: 'government', api_protocol: 'REST', endpoint_url: 'https://api.mock/tax/update', status: 'active', token_valid: true, icon_name: 'banknotes' },
  { id: 'entity_5', name: 'HealthNet', category: 'healthcare', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/healthnet/updateProfile', status: 'active', token_valid: true, icon_name: 'heart' },
  { id: 'entity_6', name: 'BankOne', category: 'banking', api_protocol: 'REST', endpoint_url: 'https://api.mock/bankone/profile', status: 'active', token_valid: true, icon_name: 'shield-check' },
  { id: 'entity_7', name: 'EduPortal', category: 'government', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/edu/graphql', status: 'active', token_valid: true, icon_name: 'book' },
  { id: 'entity_8', name: 'CablePlus', category: 'telecom', api_protocol: 'REST', endpoint_url: 'https://api.mock/cableplus/update', status: 'active', token_valid: true, icon_name: 'tv' },
  { id: 'entity_9', name: 'InsurancePro', category: 'insurance', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/insurance/updateAddress', status: 'active', token_valid: true, icon_name: 'shield' },
  { id: 'entity_10', name: 'RetailHub', category: 'retail', api_protocol: 'REST', endpoint_url: 'https://api.mock/retailhub/customers', status: 'active', token_valid: true, icon_name: 'store' },
  { id: 'entity_11', name: 'PhoneNet', category: 'telecom', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/phonenet/graphql', status: 'active', token_valid: true, icon_name: 'phone' },
  { id: 'entity_12', name: 'GasWorks', category: 'utilities', api_protocol: 'REST', endpoint_url: 'https://api.mock/gasworks/updateAddress', status: 'active', token_valid: true, icon_name: 'fire' },
  { id: 'entity_13', name: 'WaterFlow', category: 'utilities', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/waterflow/updateAddress', status: 'active', token_valid: true, icon_name: 'droplet' },
  { id: 'entity_14', name: 'City Library', category: 'government', api_protocol: 'REST', endpoint_url: 'https://api.mock/library/update', status: 'active', token_valid: true, icon_name: 'library' },
  { id: 'entity_15', name: 'Transit Pass', category: 'government', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/transit/graph', status: 'active', token_valid: true, icon_name: 'bus' },
  { id: 'entity_16', name: 'MortgageOne', category: 'banking', api_protocol: 'REST', endpoint_url: 'https://api.mock/mortgage/update', status: 'active', token_valid: true, icon_name: 'home' },
  { id: 'entity_17', name: 'Credit Union', category: 'banking', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/cu/updateAddress', status: 'active', token_valid: true, icon_name: 'building' },
  { id: 'entity_18', name: 'Fitness Club', category: 'healthcare', api_protocol: 'REST', endpoint_url: 'https://api.mock/fitness/update', status: 'active', token_valid: true, icon_name: 'dumbbell' },
  { id: 'entity_19', name: 'PharmaZone', category: 'healthcare', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/pharma/graphql', status: 'active', token_valid: true, icon_name: 'pills' },
  { id: 'entity_20', name: 'GroceryGo', category: 'retail', api_protocol: 'REST', endpoint_url: 'https://api.mock/grocery/update', status: 'active', token_valid: true, icon_name: 'basket' },
  { id: 'entity_21', name: 'MailPlus', category: 'utilities', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/mailplus/updateAddress', status: 'active', token_valid: true, icon_name: 'mail' },
  { id: 'entity_22', name: 'AutoInsure', category: 'insurance', api_protocol: 'REST', endpoint_url: 'https://api.mock/autoinsure/address', status: 'active', token_valid: true, icon_name: 'car' },
  { id: 'entity_23', name: 'HomeSecure', category: 'insurance', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/homesecure/graphql', status: 'active', token_valid: true, icon_name: 'home-gear' },
  { id: 'entity_24', name: 'StreamingMax', category: 'retail', api_protocol: 'REST', endpoint_url: 'https://api.mock/streaming/update', status: 'active', token_valid: true, icon_name: 'play' },
  { id: 'entity_25', name: 'GovBureau', category: 'government', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/govbureau/update', status: 'active', token_valid: true, icon_name: 'government' },
  { id: 'entity_26', name: 'TravelClub', category: 'retail', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/travel/graphql', status: 'active', token_valid: true, icon_name: 'plane' },
  { id: 'entity_27', name: 'LoanServ', category: 'banking', api_protocol: 'REST', endpoint_url: 'https://api.mock/loanserv/update', status: 'active', token_valid: true, icon_name: 'coins' },
  { id: 'entity_28', name: 'PayPortal', category: 'banking', api_protocol: 'SOAP', endpoint_url: 'https://api.mock/payportal/update', status: 'active', token_valid: true, icon_name: 'credit-card' },
  { id: 'entity_29', name: 'InsuranceShield', category: 'insurance', api_protocol: 'REST', endpoint_url: 'https://api.mock/insuranceShield/update', status: 'active', token_valid: true, icon_name: 'shield-check' },
  { id: 'entity_30', name: 'SecureMail', category: 'utilities', api_protocol: 'GraphQL', endpoint_url: 'https://api.mock/securemail/graphql', status: 'active', token_valid: true, icon_name: 'shield' }
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
