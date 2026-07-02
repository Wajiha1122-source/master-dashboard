import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  Eye,
  EyeOff,
  Facebook,
  Globe2,
  Instagram,
  KeyRound,
  Landmark,
  Linkedin,
  LogOut,
  MonitorCog,
  PackageSearch,
  Pencil,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  UsersRound,
  X,
  Youtube,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
const emptyForm = {
  type: 'software',
  name: '',
  label: '',
  description: '',
  company: '',
  platform: '',
  url: '',
  username: '',
  password: '',
  notes: '',
};

const iconMap = {
  'Tele-Sales': ShoppingCart,
  'Performance Dashboard': BarChart3,
  'Axon ERP': Boxes,
  'Inventory Overview': PackageSearch,
  'HR Software': UsersRound,
  'Client Sheet': MonitorCog,
  Fjgroup: Building2,
  'Irshad & Company': Landmark,
  YouTube: Youtube,
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
};

function Launcher({ stage }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#070a12]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      <div className="lux-loader-bg" />
      <AnimatePresence mode="wait">
        {stage === 0 ? (
          <motion.div
            key="welcome"
            className="loader-slide"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22, filter: 'blur(8px)' }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p className="loader-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              Executive Access Suite
            </motion.p>
            <motion.div className="calligraphy-wrap" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
              <svg className="calligraphy-svg" viewBox="0 0 900 230" role="img" aria-label="Welcome">
                <text className="calligraphy-text calligraphy-shadow" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
                <text className="calligraphy-text calligraphy-main" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
                <text className="calligraphy-fill" x="50%" y="58%" textAnchor="middle">
                  Welcome
                </text>
              </svg>
            </motion.div>
            <motion.div className="gold-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.15, delay: 0.75 }} />
          </motion.div>
        ) : (
          <motion.div
            key="master"
            className="loader-slide"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="loader-emblem" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              I&C
            </motion.div>
            <p className="loader-kicker">Irshad & Company</p>
            <h1 className="master-heading">Master Dashboard</h1>
            <div className="loader-progress">
              <motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.25, ease: 'easeInOut' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

async function apiFetch(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(error.message || 'Request failed.');
  }

  if (response.status === 204) return null;
  return response.json();
}

function getIcon(item) {
  return iconMap[item.name] || iconMap[item.platform] || MonitorCog;
}

function groupByCompany(items) {
  return items.reduce((groups, item) => {
    const company = item.company || 'General';
    groups[company] = groups[company] || [];
    groups[company].push(item);
    return groups;
  }, {});
}

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/login', null, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      onLogin(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b12] text-slate-50">
      <div className="site-bg" />
      <main className="login-wrap">
        <motion.form className="login-card" onSubmit={handleSubmit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="brand-mark">I&C</div>
          <p className="section-eyebrow">Secure access</p>
          <h1>Login to Master Dashboard</h1>
          <p>Enter the CEO dashboard credentials to manage software, websites, social handles, and saved vault records.</p>
          <label>
            Username
            <input value={credentials.username} onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))} placeholder="email@example.com" autoComplete="username" />
          </label>
          <label>
            Password
            <span className="password-input">
              <input type={showPassword ? 'text' : 'password'} value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} placeholder="Password" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button className="gold-button login-submit" type="submit" disabled={busy}>
            <KeyRound className="h-4 w-4" />
            {busy ? 'Checking...' : 'Login'}
          </button>
        </motion.form>
      </main>
    </div>
  );
}

function Header({ query, setQuery, user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080b12]/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="brand-mark">I&C</div>
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-[#70d6ff]">Irshad & Company</p>
            <h2 className="text-base font-black text-slate-50">Master Dashboard</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="search-shell">
            <Search className="h-4 w-4 text-[#70d6ff]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search access..." />
          </label>
          <a className="gold-button" href="#manager"><Plus className="h-4 w-4" /> Add</a>
          <button className="ghost-button" type="button" onClick={onLogout} title={user?.username || 'Logout'}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function IntroPanel({ summary }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 pt-7 sm:px-6 lg:px-8">
      <motion.div className="intro-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div>
          <p className="section-eyebrow">CEO launcher</p>
          <h1>Premium access control for daily decisions.</h1>
          <p>All important software, websites, social channels, and saved logins in one refined command screen.</p>
        </div>
        <div className="summary-grid">
          {summary.map((item) => {
            const Icon = item.icon;
            return (
              <div className="summary-pill" key={item.label}>
                <Icon className="h-4 w-4" />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function SoftwareSection({ items, query, token }) {
  const visibleItems = items.filter((item) => `${item.name} ${item.label || ''} ${item.description || ''}`.toLowerCase().includes(query.toLowerCase()));
  const [launching, setLaunching] = useState('');

  function getSsoAppSlug(item) {
    if (item.name === 'Tele-Sales') return 'Pulse CRM';
    if (item.name === 'Performance Dashboard') return 'employee-performance-dashboard';
    if (item.name === 'Client Sheet') return 'client-sheet';
    if (item.name === 'Inventory Overview') return 'Irshad-Company-Overview';
    return '';
  }

  function getSsoTargetUrl(item) {
    if (item.name === 'Performance Dashboard') return 'https://performance-dashboard-d1ae.onrender.com';
    return item.url;
  }

  async function launchSoftware(item) {
    const ssoApp = getSsoAppSlug(item);
    const targetUrl = getSsoTargetUrl(item);

    if (!ssoApp || !targetUrl || targetUrl.startsWith('#')) {
      window.open(item.url || '#', '_blank', 'noopener,noreferrer');
      return;
    }

    const tab = window.open('', '_blank', 'noopener,noreferrer');
    setLaunching(item.id);
    try {
      const data = await apiFetch('/api/sso-token', token, {
        method: 'POST',
        body: JSON.stringify({ app: ssoApp, targetUrl }),
      });
      if (tab) {
        tab.location.href = data.launchUrl;
      } else {
        window.location.href = data.launchUrl;
      }
    } catch (error) {
      if (tab) tab.close();
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } finally {
      setLaunching('');
    }
  }

  return (
    <section className="page-section">
      <SectionTitle eyebrow="Software" title="Core launch buttons" count={visibleItems.length} />
      <div className="software-grid">
        {visibleItems.map((item, index) => {
          const Icon = getIcon(item);
          return (
            <motion.button className="software-tile" type="button" onClick={() => launchSoftware(item)} key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }}>
              <div className="tile-top">
                <span>{launching === item.id ? 'Creating SSO token' : item.label}</span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <Icon className="tile-icon" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function WebsiteSection({ items }) {
  return (
    <section className="page-section">
      <SectionTitle eyebrow="Websites" title="Official web presence" count={items.length} />
      <div className="website-row">
        {items.map((item) => {
          const Icon = getIcon(item);
          return (
            <a className="website-card" href={item.url} target="_blank" rel="noreferrer" key={item.id}>
              <Icon className="h-7 w-7" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <ArrowUpRight className="ml-auto h-5 w-5" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function SocialSection({ items }) {
  const groups = groupByCompany(items);
  return (
    <section className="page-section">
      <SectionTitle eyebrow="Social media" title="Grouped brand channels" count={items.length} />
      <div className="social-grid">
        {Object.entries(groups).map(([company, links]) => (
          <div className="social-panel" key={company}>
            <div className="social-head">
              <div>
                <p>{links[0]?.description || 'Saved social channels.'}</p>
                <h3>{company}</h3>
              </div>
            </div>
            <div className="social-links">
              {links.map((item) => {
                const Icon = getIcon(item);
                return (
                  <a href={item.url} target="_blank" rel="noreferrer" key={item.id}>
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, count }) {
  return (
    <div className="section-title">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <span>{String(count).padStart(2, '0')}</span>
    </div>
  );
}

function Manager({ items, token, onChanged }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showExisting, setShowExisting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      type: item.type || 'software',
      name: item.name || '',
      label: item.label || '',
      description: item.description || '',
      company: item.company || '',
      platform: item.platform || '',
      url: item.url || '',
      username: item.username || '',
      password: item.password || '',
      notes: item.notes || '',
    });
    window.location.hash = 'manager';
  }

  function resetForm() {
    setEditingId('');
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await apiFetch(editingId ? `/api/items/${editingId}` : '/api/items', token, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      setMessage(editingId ? 'Record updated.' : 'Record added.');
      resetForm();
      await onChanged();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id) {
    setBusy(true);
    setMessage('');
    try {
      await apiFetch(`/api/items/${id}`, token, { method: 'DELETE' });
      setMessage('Record removed.');
      await onChanged();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="manager" className="page-section">
      <div className="manager-shell">
        <div className="section-title">
          <div>
            <p className="section-eyebrow">Management</p>
            <h2>Add software, links, handles, and vault records</h2>
          </div>
          <span>{String(items.length).padStart(2, '0')}</span>
        </div>
        <form className="manager-form" onSubmit={handleSubmit}>
          <div className="type-picker">
            <span>Type</span>
            <div>
              {[
                ['software', 'Software'],
                ['website', 'Website'],
                ['social', 'Social'],
                ['vault', 'Vault'],
              ].map(([value, label]) => (
                <button className={form.type === value ? 'active' : ''} type="button" key={value} onClick={() => updateField('type', value)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label>
            Name
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Client Sheet" />
          </label>
          <label>
            Label / Platform
            <input value={form.type === 'social' ? form.platform : form.label} onChange={(event) => updateField(form.type === 'social' ? 'platform' : 'label', event.target.value)} placeholder={form.type === 'social' ? 'Instagram' : 'Client Data'} />
          </label>
          <label>
            Company
            <input value={form.company} onChange={(event) => updateField('company', event.target.value)} placeholder="Fjgroup" />
          </label>
          <label className="wide-field">
            Link
            <input value={form.url} onChange={(event) => updateField('url', event.target.value)} placeholder="https://example.com" />
          </label>
          <label className="wide-field">
            Description
            <input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Short description shown on cards" />
          </label>
          <label>
            Vault Username
            <input value={form.username} onChange={(event) => updateField('username', event.target.value)} placeholder="Only for vault records" />
          </label>
          <label>
            Vault Password
            <input value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Only for vault records" />
          </label>
          <label className="wide-field">
            Notes
            <input value={form.notes} onChange={(event) => updateField('notes', event.target.value)} placeholder="Internal note" />
          </label>
          <div className="form-actions">
            <button className="gold-button" type="submit" disabled={busy}>
              <Save className="h-4 w-4" />
              {busy ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId ? <button className="ghost-text-button" type="button" onClick={resetForm}>Cancel edit</button> : null}
            {message ? <span>{message}</span> : null}
          </div>
        </form>
        <div className="existing-panel">
          {!showExisting ? (
            <button className="gold-button" type="button" onClick={() => setShowExisting(true)}>
              <Eye className="h-4 w-4" />
              Existing stuff
            </button>
          ) : (
            <motion.div className="existing-box" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="existing-head">
                <div>
                  <p className="section-eyebrow">Existing stuff</p>
                  <h3>Saved dashboard records</h3>
                </div>
                <button className="icon-button" type="button" onClick={() => setShowExisting(false)} aria-label="Close existing records">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="manager-list">
                {items.map((item) => (
                  <div className="manager-row" key={item.id}>
                    <div>
                      <p>{item.type}</p>
                      <strong>{item.name}</strong>
                      <span>{item.type === 'vault' ? item.username || 'Vault record' : item.url || 'No link saved'}</span>
                    </div>
                    <button className="icon-button" type="button" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="icon-button danger-button" type="button" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [launcherStage, setLauncherStage] = useState(0);
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(() => window.localStorage.getItem('dashboardToken') || '');
  const [user, setUser] = useState(() => {
    const saved = window.localStorage.getItem('dashboardUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [items, setItems] = useState([]);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    const slideTimer = window.setTimeout(() => setLauncherStage(1), 2200);
    const timer = window.setTimeout(() => setLoading(false), 4800);
    return () => {
      window.clearTimeout(slideTimer);
      window.clearTimeout(timer);
    };
  }, []);

  const buckets = useMemo(() => ({
    software: items.filter((item) => item.type === 'software'),
    website: items.filter((item) => item.type === 'website'),
    social: items.filter((item) => item.type === 'social'),
    vault: items.filter((item) => item.type === 'vault'),
  }), [items]);

  const summary = useMemo(() => [
    { label: 'Software', value: String(buckets.software.length).padStart(2, '0'), icon: MonitorCog },
    { label: 'Websites', value: String(buckets.website.length).padStart(2, '0'), icon: Globe2 },
    { label: 'Companies', value: String(new Set(items.map((item) => item.company).filter(Boolean)).size).padStart(2, '0'), icon: Building2 },
    { label: 'Social Channels', value: String(buckets.social.length).padStart(2, '0'), icon: Instagram },
  ], [buckets, items]);

  async function loadItems(activeToken = token) {
    if (!activeToken) return;
    try {
      const data = await apiFetch('/api/items', activeToken);
      setItems(data.items || []);
      setDataError('');
    } catch (error) {
      setDataError(error.message);
      if (error.message.toLowerCase().includes('session')) {
        handleLogout();
      }
    }
  }

  function handleLogin(data) {
    setToken(data.token);
    setUser(data.user);
    window.localStorage.setItem('dashboardToken', data.token);
    window.localStorage.setItem('dashboardUser', JSON.stringify(data.user));
    loadItems(data.token);
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setItems([]);
    window.localStorage.removeItem('dashboardToken');
    window.localStorage.removeItem('dashboardUser');
  }

  useEffect(() => {
    loadItems();
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    const events = new EventSource(`${API_URL}/api/events?token=${encodeURIComponent(token)}`);
    events.addEventListener('dashboard:update', () => loadItems(token));
    events.onerror = () => events.close();
    return () => events.close();
  }, [token]);

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b12] text-slate-50">
      <AnimatePresence>{loading && <Launcher stage={launcherStage} />}</AnimatePresence>
      <div className="site-bg" />
      <Header query={query} setQuery={setQuery} user={user} onLogout={handleLogout} />
      <main className="relative z-10 pb-12">
        <IntroPanel summary={summary} />
        {dataError ? <div className="page-section"><div className="form-error">{dataError}</div></div> : null}
        <SoftwareSection items={buckets.software} query={query} token={token} />
        <WebsiteSection items={buckets.website} />
        <SocialSection items={buckets.social} />
        <Manager items={items} token={token} onChanged={() => loadItems(token)} />
      </main>
    </div>
  );
}
