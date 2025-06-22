import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, DollarSign, Users, Calendar, Tag, Check, Loader, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { Expense } from '../types';

export function AddExpense() {
  const { groups, currentUser, addExpense } = useApp();
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: '',
    groupId: '',
    paidBy: currentUser?.id || '',
    splitType: 'equal' as 'equal' | 'exact' | 'percentage',
    splitDetails: {} as Record<string, number>
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedGroup = groups.find(g => g.id === expense.groupId);

  const handleAiCategorization = async () => {
    if (!expense.description.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const suggestion = await aiService.categorizeExpense(expense.description);
      setAiSuggestion(suggestion);
      setExpense(prev => ({ ...prev, category: suggestion.category }));
    } catch (error) {
      console.error('AI categorization failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        try {
          const data = await aiService.extractReceiptData(result);
          setReceiptData(data);
          setExpense(prev => ({
            ...prev,
            description: data.description,
            amount: data.amount.toString(),
            category: data.category
          }));
        } catch (error) {
          console.error('Receipt extraction failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Receipt upload failed:', error);
      setIsAnalyzing(false);
    }
  };

  const calculateSplitDetails = () => {
    if (!selectedGroup || !expense.amount) return {};
    
    const amount = parseFloat(expense.amount);
    const memberCount = selectedGroup.members.length;
    
    if (expense.splitType === 'equal') {
      const perPerson = amount / memberCount;
      const details: Record<string, number> = {};
      selectedGroup.members.forEach(member => {
        details[member.id] = perPerson;
      });
      return details;
    }
    
    return expense.splitDetails;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expense.description || !expense.amount || !expense.groupId || !currentUser) {
      alert('Please fill in all required fields');
      return;
    }

    const splitDetails = calculateSplitDetails();
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      groupId: expense.groupId,
      description: expense.description,
      amount: parseFloat(expense.amount),
      currency: 'INR',
      category: expense.category || 'Other',
      paidBy: expense.paidBy,
      splitBetween: selectedGroup?.members.map(m => m.id) || [],
      splitType: expense.splitType,
      splitDetails,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };

    addExpense(newExpense);
    
    // Reset form
    setExpense({
      description: '',
      amount: '',
      category: '',
      groupId: '',
      paidBy: currentUser.id,
      splitType: 'equal',
      splitDetails: {}
    });
    setAiSuggestion(null);
    setReceiptData(null);
    
    alert('Expense added successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Add Expense</h1>
        <p className="text-gray-400">Track and split expenses with AI assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Receipt Upload */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI-Powered Receipt Scanner</span>
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/50 border-2 border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 hover:bg-purple-900/20 transition-all duration-200 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <Loader className="w-5 h-5 animate-spin text-purple-400" />
              ) : (
                <Upload className="w-5 h-5 text-purple-400" />
              )}
              <span className="text-purple-300 font-medium">
                {isAnalyzing ? 'Processing...' : 'Upload Receipt'}
              </span>
            </button>
            
            <button
              type="button"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span className="font-medium">Take Photo</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReceiptUpload}
            className="hidden"
          />
          
          {receiptData && (
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-purple-400/30">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Receipt processed successfully!</span>
              </div>
              <p className="text-sm text-gray-400">
                Confidence: {(receiptData.confidence * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {/* Basic Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Expense Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description*
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={expense.description}
                  onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Enter expense description"
                  required
                />
                <button
                  type="button"
                  onClick={handleAiCategorization}
                  disabled={!expense.description.trim() || isAnalyzing}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-1"
                >
                  {isAnalyzing ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">AI</span>
                </button>
              </div>
              
              {aiSuggestion && (
                <div className="mt-2 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                  <div className="flex items-center space-x-2 text-purple-300 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-gray-400">{aiSuggestion.reasoning}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {(aiSuggestion.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount*
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={expense.amount}
                  onChange={(e) => setExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={expense.category}
                  onChange={(e) => setExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
                >
                  <option value="">Select category</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Travel">Travel</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Group*
              </label>
              <select
                value={expense.groupId}
                onChange={(e) => setExpense(prev => ({ ...prev, groupId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
                required
              >
                <option value="">Select group</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paid by
              </label>
              <select
                value={expense.paidBy}
                onChange={(e) => setExpense(prev => ({ ...prev, paidBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
              >
                {selectedGroup?.members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Split Details */}
        {selectedGroup && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Split Details</span>
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Split Type
              </label>
              <div className="flex space-x-2">
                {[
                  { value: 'equal', label: 'Equal' },
                  { value: 'exact', label: 'Exact' },
                  { value: 'percentage', label: 'Percentage' }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setExpense(prev => ({ ...prev, splitType: type.value as any }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      expense.splitType === type.value
                        ? 'bg-emerald-600 text-white border-2 border-emerald-500'
                        : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {selectedGroup.members.map(member => {
                const splitAmount = expense.splitType === 'equal' && expense.amount
                  ? (parseFloat(expense.amount) / selectedGroup.members.length)
                  : expense.splitDetails[member.id] || 0;

                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{member.name}</span>
                    </div>
                    <div className="text-right">
                      {expense.splitType === 'equal' ? (
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-4 h-4 text-white" />
                          <span className="font-semibold text-white">
                            {splitAmount.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={expense.splitDetails[member.id] || ''}
                            onChange={(e) => setExpense(prev => ({
                              ...prev,
                              splitDetails: {
                                ...prev.splitDetails,
                                [member.id]: parseFloat(e.target.value) || 0
                              }
                            }))}
                            className="w-20 px-2 py-1 text-right border border-gray-600 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
                            placeholder="0.00"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 font-medium transition-all duration-200 shadow-lg"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}