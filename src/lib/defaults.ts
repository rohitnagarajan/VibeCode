import { v4 as uuidv4 } from 'uuid';
import type { BrandSettings, OverlayTemplate } from '../types';

export const DEFAULT_BRAND: BrandSettings = {
  companyName: 'Your Company',
  primaryColor: '#0070D2',
  secondaryColor: '#032D60',
  accentColor: '#FF6B35',
  textColor: '#FFFFFF',
  fontFamily: 'system-ui',
  logoUrl: '',
};

const now = new Date().toISOString();

export const DEFAULT_TEMPLATES: OverlayTemplate[] = [
  {
    id: uuidv4(),
    name: 'Speaker Introduction',
    type: 'lower-third',
    content: { name: 'Jane Smith', title: 'VP of Product', subtitle: 'Acme Corp', role: 'Speaker' },
    animation: 'slide-up',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuidv4(),
    name: 'Session Title',
    type: 'title-card',
    content: { title: 'Q2 All-Hands Meeting', subtitle: 'April 2026', description: 'Quarterly business review and team updates' },
    animation: 'fade',
    duration: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuidv4(),
    name: 'Meeting Agenda',
    type: 'agenda',
    content: {
      title: "Today's Agenda",
      items: ['Welcome & Introductions', 'Q1 Results Review', 'Product Roadmap', 'Team Updates', 'Q&A'],
      activeItem: 0,
    },
    animation: 'slide-left',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuidv4(),
    name: 'Resources QR Code',
    type: 'qr-code',
    content: { url: 'https://example.com', label: 'Scan for Resources', description: 'Meeting slides & recordings' },
    animation: 'fade',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuidv4(),
    name: 'News Ticker',
    type: 'ticker',
    content: {
      label: 'LIVE',
      items: ['Q1 Revenue up 24% YoY', 'New product launch on May 15', '500 new customers this quarter', 'Hiring open roles in Engineering and Sales'],
      speed: 'medium',
    },
    animation: 'slide-up',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: uuidv4(),
    name: 'Break Screen',
    type: 'full-screen',
    content: { title: 'Taking a Short Break', subtitle: 'Back in 5 minutes', style: 'brand' },
    animation: 'fade',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  },
];
