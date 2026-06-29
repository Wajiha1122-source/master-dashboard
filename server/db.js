import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

const seedItems = [
  {
    id: 'tele-sales',
    type: 'software',
    name: 'Tele-Sales',
    label: 'Sales Desk',
    description: 'Customer calls, sales follow-ups, and daily lead operations.',
    url: 'https://tele-sales-client.vercel.app/',
  },
  {
    id: 'performance-dashboard',
    type: 'software',
    name: 'Performance Dashboard',
    label: 'Executive Metrics',
    description: 'Company performance, targets, and decision-level reporting.',
    url: 'https://performance-dashboard-lake.vercel.app/',
  },
  {
    id: 'axon-erp',
    type: 'software',
    name: 'Axon ERP',
    label: 'ERP Suite',
    description: 'Operations, accounts, purchase, inventory, and approvals.',
    url: 'https://fjgroup.axonerp.com/signin',
  },
  {
    id: 'inventory-overview',
    type: 'software',
    name: 'Inventory Overview',
    label: 'Inventory',
    description: 'Irshad & Company overview for inventory and business movement.',
    url: 'https://irshad-company-overview.vercel.app/',
  },
  {
    id: 'hr-software',
    type: 'software',
    name: 'HR Software',
    label: 'People',
    description: 'Employee records, attendance, HR actions, and staff visibility.',
    url: '#ADD-HR-SOFTWARE-LINK',
  },
  {
    id: 'client-sheet',
    type: 'software',
    name: 'Client Sheet',
    label: 'Client Data',
    description: 'Client records, sheets, and active customer follow-up data.',
    url: 'https://client-sheet-theta.vercel.app/',
  },
  {
    id: 'fjgroup-website',
    type: 'website',
    name: 'Fjgroup',
    description: 'Official Fjgroup website.',
    url: 'https://www.fjgroup.pk',
  },
  {
    id: 'irshad-website',
    type: 'website',
    name: 'Irshad & Company',
    description: 'Official Irshad & Company website.',
    url: 'https://irshadandcompany.com',
  },
  {
    id: 'fjgroup-youtube',
    type: 'social',
    name: 'YouTube',
    company: 'Fjgroup',
    platform: 'YouTube',
    description: 'Brand channels and corporate presence.',
    url: 'https://www.youtube.com/@fjgrouppk',
  },
  {
    id: 'fjgroup-instagram',
    type: 'social',
    name: 'Instagram',
    company: 'Fjgroup',
    platform: 'Instagram',
    description: 'Brand channels and corporate presence.',
    url: 'https://www.instagram.com/fjtradingcorporation/',
  },
  {
    id: 'fjgroup-facebook',
    type: 'social',
    name: 'Facebook',
    company: 'Fjgroup',
    platform: 'Facebook',
    description: 'Brand channels and corporate presence.',
    url: 'https://facebook.com/fjtradingcorporation/',
  },
  {
    id: 'fjgroup-linkedin',
    type: 'social',
    name: 'LinkedIn',
    company: 'Fjgroup',
    platform: 'LinkedIn',
    description: 'Brand channels and corporate presence.',
    url: 'https://www.linkedin.com/company/fjgroup-pk',
  },
  {
    id: 'irshad-youtube',
    type: 'social',
    name: 'YouTube',
    company: 'Irshad & Company',
    platform: 'YouTube',
    description: 'Company media, updates, and public channels.',
    url: 'https://www.youtube.com/@irshadcompany',
  },
  {
    id: 'irshad-instagram',
    type: 'social',
    name: 'Instagram',
    company: 'Irshad & Company',
    platform: 'Instagram',
    description: 'Company media, updates, and public channels.',
    url: 'https://www.instagram.com/irshadandcompany1984/',
  },
  {
    id: 'irshad-facebook',
    type: 'social',
    name: 'Facebook',
    company: 'Irshad & Company',
    platform: 'Facebook',
    description: 'Company media, updates, and public channels.',
    url: 'https://www.facebook.com/irshadturbines',
  },
  {
    id: 'irshad-linkedin',
    type: 'social',
    name: 'LinkedIn',
    company: 'Irshad & Company',
    platform: 'LinkedIn',
    description: 'Company media, updates, and public channels.',
    url: 'https://linkedin.com/company/irshadandcompany',
  },
  {
    id: 'vault-axon-erp',
    type: 'vault',
    name: 'Axon ERP',
    label: 'Axon ERP',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://fjgroup.axonerp.com/signin',
    notes: 'Primary ERP access.',
  },
  {
    id: 'vault-tele-sales',
    type: 'vault',
    name: 'Tele-Sales',
    label: 'Tele-Sales',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://tele-sales-client.vercel.app/',
    notes: 'Sales software login.',
  },
  {
    id: 'vault-performance-dashboard',
    type: 'vault',
    name: 'Performance Dashboard',
    label: 'Performance Dashboard',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://performance-dashboard-lake.vercel.app/',
    notes: 'Executive performance view.',
  },
];

export async function initDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required.');
  }

  const schema = await readFile(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);

  const username = process.env.AUTH_USERNAME;
  const password = process.env.AUTH_PASSWORD;
  if (username && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, passwordHash],
    );
  }

  for (const item of seedItems) {
    await pool.query(
      `INSERT INTO dashboard_items
       (id, type, name, label, description, company, platform, url, username, password, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.type,
        item.name,
        item.label || null,
        item.description || null,
        item.company || null,
        item.platform || null,
        item.url || null,
        item.username || null,
        item.password || null,
        item.notes || null,
      ],
    );
  }
}
