import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { User, Group, Expense, Balance, Settlement, AuthState, Notification } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AppState {
  auth: AuthState;
  groups: Group[];
  expenses: Expense[];
  balances: Balance[];
  settlements: Settlement[];
  notifications: Notification[];
  loading: boolean;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: Group }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_BALANCES'; payload: Balance[] }
  | { type: 'ADD_SETTLEMENT'; payload: Settlement }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    loading: true
  },
  groups: [],
  expenses: [],
  balances: [],
  settlements: [],
  notifications: [],
  loading: false
};

// Mock data for demonstration
const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Goa Trip 2024',
    description: 'Beach vacation with friends',
    members: [
      { 
        id: 'user-1', 
        name: 'Rahul Sharma', 
        email: 'rahul@example.com',
        createdAt: new Date(),
        preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
      },
      { 
        id: 'user-2', 
        name: 'Priya Patel', 
        email: 'priya@example.com',
        createdAt: new Date(),
        preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
      },
      { 
        id: 'user-3', 
        name: 'Arjun Singh', 
        email: 'arjun@example.com',
        createdAt: new Date(),
        preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    totalExpenses: 15750.50,
    currency: 'INR',
    category: 'trip',
    isActive: true
  },
  {
    id: 'group-2',
    name: 'Flat Expenses',
    description: 'Monthly household expenses',
    members: [
      { 
        id: 'user-1', 
        name: 'Rahul Sharma', 
        email: 'rahul@example.com',
        createdAt: new Date(),
        preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
      },
      { 
        id: 'user-4', 
        name: 'Vikram Kumar', 
        email: 'vikram@example.com',
        createdAt: new Date(),
        preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
      }
    ],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    totalExpenses: 8900.00,
    currency: 'INR',
    category: 'home',
    isActive: true
  }
];

const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    groupId: 'group-1',
    description: 'Hotel booking - Goa resort',
    amount: 8500.00,
    currency: 'INR',
    category: 'Travel',
    paidBy: 'user-1',
    splitBetween: ['user-1', 'user-2', 'user-3'],
    splitType: 'equal',
    splitDetails: { 'user-1': 2833.33, 'user-2': 2833.33, 'user-3': 2833.34 },
    date: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    tags: ['accommodation', 'vacation']
  },
  {
    id: 'exp-2',
    groupId: 'group-2',
    description: 'Electricity bill - March',
    amount: 2450.00,
    currency: 'INR',
    category: 'Bills & Utilities',
    paidBy: 'user-1',
    splitBetween: ['user-1', 'user-4'],
    splitType: 'equal',
    splitDetails: { 'user-1': 1225.00, 'user-4': 1225.00 },
    date: new Date('2024-03-15'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    tags: ['utilities', 'monthly']
  },
  {
    id: 'exp-3',
    groupId: 'group-1',
    description: 'Dinner at beach restaurant',
    amount: 3200.00,
    currency: 'INR',
    category: 'Food & Dining',
    paidBy: 'user-2',
    splitBetween: ['user-1', 'user-2', 'user-3'],
    splitType: 'equal',
    splitDetails: { 'user-1': 1066.67, 'user-2': 1066.67, 'user-3': 1066.66 },
    date: new Date('2024-03-02'),
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02'),
    tags: ['dinner', 'vacation']
  },
  {
    id: 'exp-4',
    groupId: 'group-1',
    description: 'Scuba diving activity',
    amount: 4050.50,
    currency: 'INR',
    category: 'Entertainment',
    paidBy: 'user-3',
    splitBetween: ['user-1', 'user-2', 'user-3'],
    splitType: 'equal',
    splitDetails: { 'user-1': 1350.17, 'user-2': 1350.17, 'user-3': 1350.16 },
    date: new Date('2024-03-03'),
    createdAt: new Date('2024-03-03'),
    updatedAt: new Date('2024-03-03'),
    tags: ['activity', 'adventure']
  },
  {
    id: 'exp-5',
    groupId: 'group-2',
    description: 'Grocery shopping - BigBasket',
    amount: 1850.00,
    currency: 'INR',
    category: 'Groceries',
    paidBy: 'user-4',
    splitBetween: ['user-1', 'user-4'],
    splitType: 'equal',
    splitDetails: { 'user-1': 925.00, 'user-4': 925.00 },
    date: new Date('2024-03-10'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    tags: ['groceries', 'household']
  },
  {
    id: 'exp-6',
    groupId: 'group-2',
    description: 'Internet bill - Airtel',
    amount: 1200.00,
    currency: 'INR',
    category: 'Bills & Utilities',
    paidBy: 'user-1',
    splitBetween: ['user-1', 'user-4'],
    splitType: 'equal',
    splitDetails: { 'user-1': 600.00, 'user-4': 600.00 },
    date: new Date('2024-03-20'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    tags: ['internet', 'monthly']
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'expense_added',
    title: 'New expense added',
    message: 'Priya added "Dinner at beach restaurant" for ₹3,200',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    data: { expenseId: 'exp-3', groupId: 'group-1' }
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'reminder',
    title: 'Payment reminder',
    message: 'You owe ₹1,066.67 to Priya for dinner',
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    data: { amount: 1066.67, to: 'user-2' }
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'payment_received',
    title: 'Payment received',
    message: 'Vikram paid you ₹925 for grocery shopping',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    data: { amount: 925, from: 'user-4' }
  }
];

// Calculate initial balances
const calculateInitialBalances = (): Balance[] => {
  const balances: Balance[] = [];
  const groups = mockGroups;
  const expenses = mockExpenses;

  groups.forEach(group => {
    group.members.forEach(member => {
      let balance = 0;
      
      // Add what they paid
      expenses.forEach(expense => {
        if (expense.groupId === group.id && expense.paidBy === member.id) {
          balance += expense.amount;
        }
      });
      
      // Subtract what they owe
      expenses.forEach(expense => {
        if (expense.groupId === group.id && expense.splitBetween.includes(member.id)) {
          balance -= expense.splitDetails[member.id] || 0;
        }
      });
      
      balances.push({
        userId: member.id,
        groupId: group.id,
        balance,
        currency: group.currency
      });
    });
  });
  
  return balances;
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { 
        ...state, 
        auth: { ...state.auth, loading: action.payload }
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload,
          loading: false
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          loading: false
        },
        groups: [],
        expenses: [],
        balances: [],
        settlements: [],
        notifications: []
      };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload.id ? action.payload : g)
      };
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.payload),
        expenses: state.expenses.filter(e => e.groupId !== action.payload),
        balances: state.balances.filter(b => b.groupId !== action.payload)
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'SET_BALANCES':
      return { ...state, balances: action.payload };
    case 'ADD_SETTLEMENT':
      return { ...state, settlements: [...state.settlements, action.payload] };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (groupId: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBalances: (groupId: string) => void;
  searchUsers: (query: string) => Promise<User[]>;
  inviteUser: (email: string) => Promise<User>;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  markNotificationRead: (notificationId: string) => void;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize app - check for existing session
    const initializeApp = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          dispatch({ type: 'SET_GROUPS', payload: mockGroups });
          dispatch({ type: 'SET_EXPENSES', payload: mockExpenses });
          dispatch({ type: 'SET_BALANCES', payload: calculateInitialBalances() });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications });
        } else {
          // No saved user, set loading to false
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.login(email, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      dispatch({ type: 'SET_GROUPS', payload: mockGroups });
      dispatch({ type: 'SET_EXPENSES', payload: mockExpenses });
      dispatch({ type: 'SET_BALANCES', payload: calculateInitialBalances() });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications });
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.signup(userData);
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success(`Welcome to SplitSmart, ${user.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('currentUser');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const addGroup = (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: `group-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    
    // Add notification for group creation
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: state.auth.user?.id || '',
      type: 'group_invite',
      title: 'Group created',
      message: `You created "${newGroup.name}" group`,
      read: false,
      createdAt: new Date(),
      data: { groupId: newGroup.id }
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    toast.success('Group created successfully!');
  };

  const updateGroup = (group: Group) => {
    dispatch({ type: 'UPDATE_GROUP', payload: group });
    toast.success('Group updated successfully!');
  };

  const deleteGroup = (groupId: string) => {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
      dispatch({ type: 'DELETE_GROUP', payload: groupId });
      
      // Add notification for group deletion
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: state.auth.user?.id || '',
        type: 'group_invite',
        title: 'Group deleted',
        message: `You deleted "${group.name}" group`,
        read: false,
        createdAt: new Date(),
        data: { groupId }
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
      toast.success('Group deleted successfully!');
    }
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    updateBalances(expenseData.groupId);
    
    // Add notification for expense creation
    const group = state.groups.find(g => g.id === expenseData.groupId);
    const paidByUser = group?.members.find(m => m.id === expenseData.paidBy);
    
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: state.auth.user?.id || '',
      type: 'expense_added',
      title: 'Expense added',
      message: `${paidByUser?.name || 'Someone'} added "${expenseData.description}" for ₹${expenseData.amount}`,
      read: false,
      createdAt: new Date(),
      data: { expenseId: newExpense.id, groupId: expenseData.groupId }
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    toast.success('Expense added successfully!');
  };

  const updateBalances = (groupId: string) => {
    const groupExpenses = state.expenses.filter(exp => exp.groupId === groupId);
    const group = state.groups.find(g => g.id === groupId);
    
    if (!group) return;

    const newBalances: Balance[] = [];
    
    group.members.forEach(member => {
      let balance = 0;
      
      groupExpenses.forEach(expense => {
        if (expense.paidBy === member.id) {
          balance += expense.amount;
        }
        if (expense.splitBetween.includes(member.id)) {
          balance -= expense.splitDetails[member.id] || 0;
        }
      });
      
      newBalances.push({
        userId: member.id,
        groupId,
        balance,
        currency: group.currency
      });
    });
    
    dispatch({ 
      type: 'SET_BALANCES', 
      payload: [
        ...state.balances.filter(b => b.groupId !== groupId),
        ...newBalances
      ]
    });
  };

  const searchUsers = async (query: string) => {
    return await authService.searchUsers(query);
  };

  const inviteUser = async (email: string) => {
    return await authService.inviteUser(email);
  };

  const setCurrentUser = (user: User) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const markNotificationRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const unreadNotificationsCount = state.notifications.filter(n => 
    n.userId === state.auth.user?.id && !n.read
  ).length;

  const value: AppContextType = {
    ...state,
    login,
    signup,
    logout,
    addGroup,
    updateGroup,
    deleteGroup,
    addExpense,
    updateBalances,
    searchUsers,
    inviteUser,
    currentUser: state.auth.user,
    setCurrentUser,
    markNotificationRead,
    unreadNotificationsCount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}