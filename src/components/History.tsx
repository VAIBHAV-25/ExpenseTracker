import React, { useState } from 'react';
import { Search, Filter, Calendar, DollarSign, Users, ChevronDown, Eye, IndianRupee, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function History() {
  const { expenses, groups, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Travel', 'Healthcare', 'Education',
    'Personal Care', 'Home & Garden', 'Gifts', 'Other'
  ];

  // Filter expenses to only show those where current user is involved
  const userExpenses = expenses.filter(expense => 
    expense.paidBy === currentUser?.id || expense.splitBetween.includes(currentUser?.id || '')
  );

  const filteredExpenses = userExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || expense.groupId === selectedGroup;
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesGroup && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-900/50 text-orange-300 border-orange-500/30',
      'Transportation': 'bg-blue-900/50 text-blue-300 border-blue-500/30',
      'Shopping': 'bg-purple-900/50 text-purple-300 border-purple-500/30',
      'Entertainment': 'bg-pink-900/50 text-pink-300 border-pink-500/30',
      'Bills & Utilities': 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
      'Travel': 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30',
      'Healthcare': 'bg-red-900/50 text-red-300 border-red-500/30',
      'Education': 'bg-green-900/50 text-green-300 border-green-500/30',
      'Personal Care': 'bg-teal-900/50 text-teal-300 border-teal-500/30',
      'Home & Garden': 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30',
      'Gifts': 'bg-rose-900/50 text-rose-300 border-rose-500/30',
      'Other': 'bg-gray-700/50 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors['Other'];
  };

  if (selectedExpense) {
    const group = groups.find(g => g.id === selectedExpense.groupId);
    const paidByMember = group?.members.find(m => m.id === selectedExpense.paidBy);
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setSelectedExpense(null)}
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Expense Details</h1>
            <p className="text-gray-400">Complete breakdown of the expense</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedExpense.description}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedExpense.category)}`}>
                {selectedExpense.category}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Amount</h3>
                <div className="flex items-center space-x-1">
                  <IndianRupee className="w-6 h-6 text-white" />
                  <span className="text-3xl font-bold text-white">{selectedExpense.amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Date</h3>
                <p className="text-xl text-white">{new Date(selectedExpense.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Paid by</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {paidByMember?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{paidByMember?.name}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Group</h3>
                <p className="text-white font-medium">{group?.name}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Split Details</h3>
            <div className="space-y-3">
              {Object.entries(selectedExpense.splitDetails).map(([userId, amount]) => {
                const member = group?.members.find(m => m.id === userId);
                if (!member) return null;
                
                return (
                  <div key={userId} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{member.name}</span>
                      {userId === currentUser?.id && (
                        <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 font-semibold text-white">
                      <IndianRupee className="w-4 h-4" />
                      <span>{(amount as number).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Expense History</h1>
        <p className="text-gray-400">Track and review all your expenses</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400"
                placeholder="Search expenses..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="text-sm text-gray-400">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
              >
                <option value="">All groups</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
              >
                <option value="">All categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Total Amount:</span>
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-5 h-5 text-white" />
              <span className="text-xl font-bold text-white">{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => {
          const group = groups.find(g => g.id === expense.groupId);
          const paidByMember = group?.members.find(m => m.id === expense.paidBy);
          const userShare = expense.splitDetails[currentUser?.id || ''] || 0;
          const isPaidByUser = expense.paidBy === currentUser?.id;
          
          return (
            <div key={expense.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{expense.description}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{group?.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span>Paid by {paidByMember?.name}</span>
                      {isPaidByUser && <span className="text-emerald-400">(You)</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-400">Your share:</span>
                    <div className="flex items-center space-x-1 font-medium text-white">
                      <IndianRupee className="w-4 h-4" />
                      <span>{userShare.toFixed(2)}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">Split {expense.splitType}</span>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="flex items-center space-x-1 text-2xl font-bold text-white mb-1">
                    <IndianRupee className="w-6 h-6" />
                    <span>{expense.amount.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedExpense(expense)}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No expenses found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}