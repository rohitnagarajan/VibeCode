export type OverlayType = 'lower-third' | 'title-card' | 'agenda' | 'qr-code' | 'ticker' | 'full-screen';
export type AnimationStyle = 'slide-up' | 'slide-down' | 'slide-left' | 'fade';
export type RoleTag = 'Speaker' | 'Moderator' | 'Host' | 'Guest' | 'Panelist' | 'Expert';

export interface LowerThirdContent {
  name: string;
  title: string;
  subtitle: string;
  role: RoleTag | '';
}
export interface TitleCardContent {
  title: string;
  subtitle: string;
  description: string;
}
export interface AgendaContent {
  title: string;
  items: string[];
  activeItem: number;
}
export interface QRCodeContent {
  url: string;
  label: string;
  description: string;
}
export interface TickerContent {
  items: string[];
  label: string;
  speed: 'slow' | 'medium' | 'fast';
}
export interface FullScreenContent {
  title: string;
  subtitle: string;
  style: 'brand' | 'dark' | 'minimal';
}

export type OverlayContent =
  | LowerThirdContent
  | TitleCardContent
  | AgendaContent
  | QRCodeContent
  | TickerContent
  | FullScreenContent;

export interface OverlayTemplate {
  id: string;
  name: string;
  type: OverlayType;
  content: OverlayContent;
  animation: AnimationStyle;
  duration: number; // 0 = manual
  createdAt: string;
  updatedAt: string;
}

export interface BrandSettings {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl: string;
}

export type BroadcastMessage =
  | { type: 'ACTIVATE'; template: OverlayTemplate; brand: BrandSettings; agendaItem?: number }
  | { type: 'DEACTIVATE' }
  | { type: 'SET_AGENDA_ITEM'; item: number }
  | { type: 'PING' }
  | { type: 'PONG' };
