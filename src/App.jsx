import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

function SummaryCard({ title, value, note, color }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value" style={{ color }}>{value}</div>
      <div className="card-note">{note}</div>
    </div>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [p, e] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/entities').then((r) => r.json())
      ]);
      setProfile(p);
      setEntities(e);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="panel">Loading dashboard...</div>;

  const active = entities.filter((e) => e.status === 'active').length;
  const pending = entities.length - active;
  const successRate = 89;

  return (
    <div className="panel">
      <div className="hero-row">
        <div>
          <div className="hero-sub">AddressSync Investor Console</div>
          <div className="hero-title">Launch operating metrics with confidence</div>
          <div className="hero-text">Monitor real-time profile synchronization health, entity status, and batch performance.</div>
        </div>
        <div className="hero-chip">Live • {new Date().toLocaleTimeString()}</div>
      </div>
      <div className="grid-4">
        <SummaryCard title="Total Entities" value={entities.length} note="Connected across all networks" color="#7c3aed" />
        <SummaryCard title="Active Feeds" value={active} note="Streaming properly" color="#059669" />
        <SummaryCard title="Pending" value={pending} note="Awaiting token refresh" color="#d97706" />
        <SummaryCard title="Sync Success" value={`${successRate}%`} note="Trailing 24h" color="#0ea5e9" />
      </div>
      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-header">Weekly Sync Throughput</div>
          <div className="bar-grid">
            {[15, 20, 16, 26, 22, 30, 28].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}px` }} title={`Day ${i + 1}: ${h}k`} />
            ))}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">Latest Activity</div>
          <div className="activity-list">
            <div className="activity-item"><span>City DMV</span><span>Success</span></div>
            <div className="activity-item"><span>UtilityCo</span><span className="status-warning">Retry</span></div>
            <div className="activity-item"><span>ShopMax</span><span>Success</span></div>
            <div className="activity-item"><span>NHS</span><span>Success</span></div>
          </div>
        </div>
      </div>
      <div className="panel split">
        <div>
          <div className="section-title">Master Profile Snapshot</div>
          <div className="mini-grid">
            <div className="tile"><div className="tile-label">Name</div><div>{profile.full_name}</div></div>
            <div className="tile"><div className="tile-label">Email</div><div>{profile.email}</div></div>
            <div className="tile"><div className="tile-label">Last Sync</div><div>{profile.last_sync_date || 'Never'}</div></div>
            <div className="tile"><div className="tile-label">Country</div><div>{profile.country}</div></div>
          </div>
        </div>
        <div>
          <div className="section-title">Investor KPIs</div>
          <div className="kpi-grid">
            <div className="kpi"><div>Network Stability</div><div className="kpi-number">99.8%</div></div>
            <div className="kpi"><div>Latency</div><div className="kpi-number">180ms</div></div>
            <div className="kpi"><div>Batch Velocity</div><div className="kpi-number">420/s</div></div>
            <div className="kpi"><div>Compliance</div><div className="kpi-number">A+</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MasterProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/profile').then((res) => res.json()).then((data) => {
      setProfile(data);
      setForm({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address_line1: data.address_line1,
        city: data.city,
        state_province: data.state_province,
        postal_code: data.postal_code,
        country: data.country,
      });
      setLoading(false);
    });
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save profile');
      setProfile(data.profile);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="panel">Loading profile...</div>;

  return (
    <div className="panel">
      <div className="section-title">Master Profile</div>
      <div className="profile-grid">
        <div><span className="label">Name</span><input value={form.full_name} className="input-field" onChange={(e) => updateField('full_name', e.target.value)} /></div>
        <div><span className="label">Email</span><input value={form.email} className="input-field" onChange={(e) => updateField('email', e.target.value)} /></div>
        <div><span className="label">Phone</span><input value={form.phone} className="input-field" onChange={(e) => updateField('phone', e.target.value)} /></div>
        <div><span className="label">Address</span><input value={form.address_line1} className="input-field" onChange={(e) => updateField('address_line1', e.target.value)} /></div>
        <div><span className="label">City</span><input value={form.city} className="input-field" onChange={(e) => updateField('city', e.target.value)} /></div>
        <div><span className="label">State</span><input value={form.state_province} className="input-field" onChange={(e) => updateField('state_province', e.target.value)} /></div>
        <div><span className="label">Postal</span><input value={form.postal_code} className="input-field" onChange={(e) => updateField('postal_code', e.target.value)} /></div>
        <div><span className="label">Country</span><input value={form.country} className="input-field" onChange={(e) => updateField('country', e.target.value)} /></div>
      </div>
      <div className="flex-between" style={{ marginTop: '0.6rem' }}>
        <div className="text-muted">Last sync: {profile.last_sync_date || 'Never'}</div>
        <button className="button" disabled={saving} onClick={saveProfile}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
      {message ? <div className="status-box" style={{ marginTop: '0.5rem' }}>{message}</div> : null}
    </div>
  );
}

function Entities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => { fetch('/api/entities').then((res) => res.json()).then((data) => { setEntities(data); setLoading(false); }); }, []);

  if (loading) return <div className="panel">Loading entities...</div>;

  const categories = ['all', ...new Set(entities.map((e) => e.category))];
  const filtered = entities.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase()) || e.api_protocol.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === 'all' || e.category === category;
    return matchQuery && matchCategory;
  });

  return (
    <div className="panel">
      <div className="section-title">Entity Registry</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center', marginBottom: '0.65rem' }}>
        <input className="input-field" placeholder="Search entities..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input-field" style={{ maxWidth: '240px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All categories' : cat}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Protocol</th><th>Status</th><th>Last Updated</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '0.9rem', color: '#cbd5e1' }}>No entities match your filters.</td></tr>
            ) : filtered.slice(0, 50).map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td><td>{e.category}</td><td>{e.api_protocol}</td>
                <td><span className={e.status === 'active' ? 'pill active' : 'pill pending'}>{e.status}</span></td>
                <td>{new Date().toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SyncEngine() {
  const [entities, setEntities] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Ready to sync');

  useEffect(() => { fetch('/api/entities').then((res) => res.json()).then(setEntities); }, []);

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  const runSync = async () => {
    if (!selected.length) { setStatus('Select at least one entity.'); return; }
    setStatus('Running sync...');
    try {
      const res = await fetch('/api/sync', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ selectedEntityIds: selected, syncType: 'address' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      const successCount = data.results.filter((r) => r.status === 'success').length;
      setStatus(`Batch ${data.batch_id} complete: ${successCount}/${data.results.length} success`);
    } catch (err) {
      setStatus(err.message || 'Sync error');
    }
  };

  const filtered = entities.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.category.toLowerCase().includes(query.toLowerCase()) || e.api_protocol.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="panel">
      <div className="flex-between"><div className="section-title">Sync Engine</div><button className="button" onClick={runSync}>Initiate Sync Now</button></div>
      <div className="text-muted">Search entities and run a batch sync instantly.</div>
      <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <input className="input-field" placeholder="Search by name/category/protocol" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="entity-grid">
        {filtered.length === 0 ? <div className="status-box">No entities found.</div> : filtered.map((e) => (
          <button key={e.id} className={selected.includes(e.id) ? 'entity selected' : 'entity'} onClick={() => toggle(e.id)}>
            <div><strong>{e.name}</strong></div>
            <div className="tiny">{e.category} • {e.api_protocol}</div>
          </button>
        ))}
      </div>
      <div className="status-box">{status || 'Ready to execute.'} — Selected {selected.length}</div>
    </div>
  );
}

function SyncHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then((res) => res.json()).then((data) => { setEvents(data); setLoading(false); });
  }, []);

  if (loading) return <div className="panel">Loading history...</div>;

  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="panel">
      <div className="section-title">Sync History Timeline</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Time</th><th>Entity</th><th>Response</th><th>Code</th></tr></thead>
          <tbody>
            {sortedEvents.slice(0, 20).map((ev, i) => (
              <tr key={`${ev.batch_id}-${i}`}>
                <td>{new Date(ev.timestamp).toLocaleTimeString()}</td>
                <td>{ev.entity_name}</td>
                <td>{ev.status}</td>
                <td>{ev.response_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MasterProfile />} />
        <Route path="/entities" element={<Entities />} />
        <Route path="/sync-engine" element={<SyncEngine />} />
        <Route path="/sync-history" element={<SyncHistory />} />
      </Route>
    </Routes>
  );
}
