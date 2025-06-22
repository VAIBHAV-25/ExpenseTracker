export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
  totalExpenses: number;
  currency: string;
  category: 'trip' | 'home' | 'couple' | 'friends' | 'family' | 'other';
  avatar?: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  paidBy: string;
  splitBetween: string[];
  splitType: 'equal' | 'exact' | 'percentage' | 'shares';
  splitDetails: Record<string, number>;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  receipt?: string;
  notes?: string;
  location?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  tags: string[];
}

export interface Balance {
  userId: string;
  groupId: string;
  balance: number;
  currency: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
}

export interface AICategory {
  category: string;
  confidence: number;
  reasoning: string;
  suggestedTags?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expense_added' | 'payment_received' | 'reminder' | 'group_invite';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}