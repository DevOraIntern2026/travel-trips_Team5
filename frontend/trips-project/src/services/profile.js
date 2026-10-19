import { api } from '../lib/api';
import salmanImg from '../assets/images/salman.png';

export const mockProfile = {
  fullName: 'Sheikh Salem Al-Jabali',
  entityName: 'Sheikh Salem Al-Jabali Expeditions',
  title: 'Master Pathfinder & Certified EEAA Wilderness Outfitter',
  email: 'salem@sinai-expeditions.org',
  phone: '+20 69 347 0021 / Mobile: +20 100 482 1190',
  baseLocation: 'St. Catherine, South Sinai Protectorate, Egypt',
  bio: 'Native Jabaliya Bedouin pathfinder with 28 years leading high-altitude treks across Mt. Katherine, Bab El-Dunya, and the red granite canyons of South Sinai. Accredited by the Egyptian Environmental Affairs Agency (EEAA) and Ministry of Tourism. Committed to zero-trace expedition ethics and local tribal community stewardship.',
  portraitUrl: salmanImg,
  portraitAlt: 'Sheikh Salem Al-Jabali in traditional Bedouin attire, South Sinai...',
  portraitFileName: 'salem_aljabali_portrait_2025.jpg',
  portraitFileSize: '2.8 MB • 1440×1440 px',
  sealUrl: '',
  sealGuild: 'Guild #441',
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'Bedouin Dialect', level: 'Fluent' },
    { name: 'English', level: 'Fluent' },
    { name: 'French', level: 'Conversational' },
  ],
  licenses: [
    {
      id: '1',
      title: 'EEAA Protectorate Permit',
      reference: '#EEAA-SIN-441-EXP',
      footer: 'Expires: 31 Dec 2026',
      state: 'active',
      action: 'validated',
    },
    {
      id: '2',
      title: 'Ministry of Tourism',
      reference: '#MOTA-OP-892',
      footer: 'Class: Grade A Outfitter',
      state: 'active',
      action: 'validated',
    },
    {
      id: '3',
      title: 'Wilderness First Responder',
      reference: '#WFR-INTL-90214',
      footer: 'Certifier: Red Cross Sinai',
      renewed: 'Renewed 2024',
      state: 'valid',
      action: 'validated',
    },
    {
      id: '4',
      title: 'Bedouin Guild Clearance',
      reference: 'bedouin_guild_2025.pdf',
      footer: 'Annual Council Stamped',
      fileSize: '4.2 MB',
      state: 'valid',
      action: 'download',
    },
  ],
  alerts: {
    instantBooking: true,
    whatsappPing: true,
    seatCapacity: true,
    escrowSettlement: true,
    marketplaceDigest: false,
  },
  portalLanguage: 'English (US) – Operator Standard',
  timezone: 'Cairo (GMT+2) – Eastern European Time (EET)',
  currencyDisplay: 'Dual Display (Recommended) – USD ($) / EGP (ج.م)',
};

export const profileService = {
  get: async () => {
    try {
      return await api('/operator/profile');
    } catch {
      return mockProfile;
    }
  },
  update: async (data) => {
    try {
      return await api('/operator/profile', { method: 'PATCH', body: JSON.stringify(data) });
    } catch {
      return data;
    }
  },
  uploadImage: async (kind, file) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      return await api(`/operator/profile/${kind}`, { method: 'POST', body: fd });
    } catch {
      return { url: URL.createObjectURL(file) };
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await api('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
    } catch {
      return { success: true };
    }
  },
  pauseDepartures: async () => {
    try {
      return await api('/operator/departures/pause', { method: 'POST' });
    } catch {
      return { success: true };
    }
  },
  requestDeactivation: async () => {
    try {
      return await api('/operator/deactivation-request', { method: 'POST' });
    } catch {
      return { success: true };
    }
  },
};
