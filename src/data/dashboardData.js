import {
  BarChart3,
  Boxes,
  Building2,
  Facebook,
  Globe2,
  Instagram,
  Landmark,
  Linkedin,
  MonitorCog,
  PackageSearch,
  ShoppingCart,
  UsersRound,
  Youtube,
} from 'lucide-react';

export const softwareLinks = [
  {
    name: 'Tele-Sales',
    label: 'Sales Desk',
    description: 'Customer calls, sales follow-ups, and daily lead operations.',
    icon: ShoppingCart,
    link: 'https://tele-sales-client.vercel.app/',
  },
  {
    name: 'Performance Dashboard',
    label: 'Executive Metrics',
    description: 'Company performance, targets, and decision-level reporting.',
    icon: BarChart3,
    link: 'https://performance-dashboard-lake.vercel.app/',
  },
  {
    name: 'Axon ERP',
    label: 'ERP Suite',
    description: 'Operations, accounts, purchase, inventory, and approvals.',
    icon: Boxes,
    link: 'https://fjgroup.axonerp.com/signin',
  },
  {
    name: 'Inventory Overview',
    label: 'Inventory',
    description: 'Irshad & Company overview for inventory and business movement.',
    icon: PackageSearch,
    link: 'https://irshad-company-overview.vercel.app/',
  },
  {
    name: 'HR Software',
    label: 'People',
    description: 'Employee records, attendance, HR actions, and staff visibility.',
    icon: UsersRound,
    link: '#ADD-HR-SOFTWARE-LINK',
  },
];

export const websiteLinks = [
  {
    name: 'Fjgroup',
    description: 'Official Fjgroup website.',
    icon: Building2,
    link: 'https://www.fjgroup.pk',
  },
  {
    name: 'Irshad & Company',
    description: 'Official Irshad & Company website.',
    icon: Landmark,
    link: 'https://irshadandcompany.com',
  },
];

export const socialGroups = [
  {
    company: 'Fjgroup',
    description: 'Brand channels and corporate presence.',
    links: [
      { name: 'YouTube', icon: Youtube, link: 'https://www.youtube.com/@fjgrouppk' },
      { name: 'Instagram', icon: Instagram, link: 'https://www.instagram.com/fjtradingcorporation/' },
      { name: 'Facebook', icon: Facebook, link: 'https://facebook.com/fjtradingcorporation/' },
      { name: 'LinkedIn', icon: Linkedin, link: 'https://www.linkedin.com/company/fjgroup-pk' },
    ],
  },
  {
    company: 'Irshad & Company',
    description: 'Company media, updates, and public channels.',
    links: [
      { name: 'YouTube', icon: Youtube, link: 'https://www.youtube.com/@irshadcompany' },
      { name: 'Instagram', icon: Instagram, link: 'https://www.instagram.com/irshadandcompany1984/' },
      { name: 'Facebook', icon: Facebook, link: 'https://www.facebook.com/irshadturbines' },
      { name: 'LinkedIn', icon: Linkedin, link: 'https://linkedin.com/company/irshadandcompany' },
    ],
  },
];

export const dashboardSummary = [
  { label: 'Software', value: '05', icon: MonitorCog },
  { label: 'Websites', value: '02', icon: Globe2 },
  { label: 'Companies', value: '02', icon: Building2 },
  { label: 'Social Channels', value: '08', icon: Instagram },
];

export const defaultPasswords = [
  {
    id: 'axon-erp',
    label: 'Axon ERP',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://fjgroup.axonerp.com/signin',
    notes: 'Primary ERP access.',
  },
  {
    id: 'tele-sales',
    label: 'Tele-Sales',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://tele-sales-client.vercel.app/',
    notes: 'Sales software login.',
  },
  {
    id: 'performance-dashboard',
    label: 'Performance Dashboard',
    company: 'Fjgroup',
    username: 'add-login-here',
    password: 'add-password-here',
    url: 'https://performance-dashboard-lake.vercel.app/',
    notes: 'Executive performance view.',
  },
];
