export type UserRole = 'student' | 'secretary' | 'admin';
export type SatisfactionStatus = 'ATENDEU' | 'NAO_ATENDEU';
export type InquiryStatus = 'ABERTA' | 'RESPONDIDA';
export type InquiryFilter = 'TODAS' | InquiryStatus;
export type SatisfactionFilter = 'TODAS' | SatisfactionStatus;

export interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: Extract<UserRole, 'admin' | 'secretary'>;
}

export interface ChatNode {
  id: number;
  title: string;
  content?: string;
  parentId?: number | null;
  children?: ChatNode[];
}

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  html?: boolean;
}

export interface ChatHistoryEntry {
  nodeId: number | null;
  title: string;
}

export type ChatPhase = 'chat' | 'inquiry' | 'satisfaction' | 'done';

export interface Inquiry {
  id: number;
  requesterName: string;
  requesterEmail: string;
  question: string;
  answerText: string;
  status: InquiryStatus;
  createdAt: string;
  attachmentName?: string;
  attachmentMime?: string;
}

export interface LogEntry {
  id: number;
  sessionId: string;
  navigationFlow: number[];
  satisfaction?: SatisfactionStatus;
  createdAt: string;
}

export interface SatisfactionChartItem {
  name: string;
  value: number;
  color: string;
}

export interface VolumeChartItem {
  date: string;
  count: number;
}

export interface LogStats {
  total: number;
  satisfied: number;
  unsatisfied: number;
  rate: number;
  satisfactionData: SatisfactionChartItem[];
  volumeData: VolumeChartItem[];
}
