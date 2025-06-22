import React, { useState } from 'react';
import { User, Mail, Settings, Bell, Shield, Palette, LogOut, Edit2, Save, X, IndianRupee, DollarSign, Euro, PoundSterling } from 'lucide-react';
import { useApp } from '../context/AppContext';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', icon: IndianRupee },
  { code: 'USD', symbol: '$', name: 'US Dollar', icon: DollarSign },
  { code: 'EUR', symbol: '€', name: 'Euro', icon: Euro },
  { code: 'GBP', symbol: '£', name: 'British Pound', icon: PoundSterling }
];

export function Profile() {
  const { currentUser, setCurrentUser, groups, expenses, balances, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currency: currentUser?.preferences?.currency || 'INR'
  });

  // Calculate real user stats
  const userGroups = groups.filter(group => 
    group.members.some(member => member.id === currentUser?.id)
  );
  
  const userExpenses = expenses.filter(expense => 
    expense.paidBy === currentUser?.id || expense.splitBetween.includes(currentUser?.id || '')
  );
  
  // Calculate total amount user has paid
  const totalPaidByUser = expenses
    .filter(expense => expense.paidBy === currentUser?.id)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net balance (what user is owed minus what user owes)
  const netBalance = balances
    .filter(balance => balance.userId === currentUser?.id)
    .reduce((sum, balance) => sum + balance.balance, 0);

  const selectedCurrency = currencies.find(c => c.code === editedUser.currency) || currencies[0];
  const CurrencyIcon = selectedCurrency.icon;

  const handleSave = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: editedUser.name,
        email: editedUser.email,
        preferences: {
          ...currentUser.preferences,
          currency: editedUser.currency
        }
      };
      setCurrentUser(updatedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      currency: currentUser?.preferences?.currency || 'INR'
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
        { icon: Shield, label: 'Privacy & Security', description: 'Control your privacy settings' },
        { icon: Palette, label: 'Appearance', description: 'Customize your app experience' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Mail, label: 'Contact Support', description: 'Get help when you need it' },
        { icon: Settings, label: 'App Settings', description: 'Configure app preferences' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                  />
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                    className="text-gray-300 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-300">Currency:</label>
                    <select
                      value={editedUser.currency}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, currency: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white text-sm"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
                  <p className="text-gray-400">{currentUser?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <CurrencyIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {selectedCurrency.name} ({selectedCurrency.symbol})
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userGroups.length}</div>
            <div className="text-sm text-gray-400">Active Groups</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <CurrencyIcon className="w-5 h-5 text-white" />
              <div className="text-2xl font-bold text-white">{totalPaidByUser.toFixed(2)}</div>
            </div>
            <div className="text-sm text-gray-400">Total Paid</div>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center space-x-1 text-2xl font-bold ${
              netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <CurrencyIcon className="w-5 h-5" />
              <span>{netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-400">Net Balance</div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-600 rounded-lg shadow-sm">
                        <Icon className="w-4 h-4 text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-900/50 border border-red-500/50 text-red-300 py-3 px-4 rounded-lg hover:bg-red-800/50 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}