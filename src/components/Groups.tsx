import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, DollarSign, Calendar, Edit, Trash2, IndianRupee, ArrowLeft, TrendingUp, TrendingDown, Star, Sparkles, Crown, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Group } from '../types';

export function Groups() {
  const { groups, balances, expenses, currentUser, addGroup, updateGroup, deleteGroup } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    memberEmails: ['']
  });

  const handleCreateGroup = () => {
    if (!newGroup.name.trim() || !currentUser) return;

    const group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newGroup.name,
      description: newGroup.description,
      members: [
        currentUser,
        ...newGroup.memberEmails
          .filter(email => email.trim())
          .map((email, index) => ({
            id: `user-${Date.now()}-${index}`,
            name: email.split('@')[0],
            email: email.trim(),
            createdAt: new Date(),
            preferences: { currency: 'INR', language: 'en', notifications: true, theme: 'dark' }
          }))
      ],
      totalExpenses: 0,
      currency: 'INR',
      category: 'other',
      isActive: true
    };

    addGroup(group);
    setShowCreateModal(false);
    setNewGroup({ name: '', description: '', memberEmails: [''] });
  };

  const handleEditGroup = (group: Group) => {
    setGroupToEdit(group);
    setNewGroup({
      name: group.name,
      description: group.description || '',
      memberEmails: group.members.slice(1).map(m => m.email) // Exclude current user
    });
    setShowEditModal(true);
  };

  const handleUpdateGroup = () => {
    if (!groupToEdit || !newGroup.name.trim()) return;

    const updatedGroup: Group = {
      ...groupToEdit,
      name: newGroup.name,
      description: newGroup.description,
      updatedAt: new Date()
    };

    updateGroup(updatedGroup);
    setShowEditModal(false);
    setGroupToEdit(null);
    setNewGroup({ name: '', description: '', memberEmails: [''] });
  };

  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      deleteGroup(groupToDelete.id);
      setShowDeleteModal(false);
      setGroupToDelete(null);
      
      // If the deleted group was selected, go back to groups list
      if (selectedGroup?.id === groupToDelete.id) {
        setSelectedGroup(null);
      }
    }
  };

  const addMemberField = () => {
    setNewGroup(prev => ({
      ...prev,
      memberEmails: [...prev.memberEmails, '']
    }));
  };

  const updateMemberEmail = (index: number, email: string) => {
    setNewGroup(prev => ({
      ...prev,
      memberEmails: prev.memberEmails.map((e, i) => i === index ? email : e)
    }));
  };

  const removeMemberField = (index: number) => {
    setNewGroup(prev => ({
      ...prev,
      memberEmails: prev.memberEmails.filter((_, i) => i !== index)
    }));
  };

  const getGroupExpenses = (groupId: string) => {
    return expenses.filter(exp => exp.groupId === groupId);
  };

  const getGroupTotalExpenses = (groupId: string) => {
    return getGroupExpenses(groupId).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getGroupIcon = (category: string) => {
    const icons = {
      'trip': Star,
      'home': Users,
      'couple': Crown,
      'friends': Sparkles,
      'family': Users,
      'other': Zap
    };
    return icons[category as keyof typeof icons] || Zap;
  };

  const getGroupGradient = (index: number) => {
    const gradients = [
      'from-purple-500/20 via-pink-500/20 to-red-500/20',
      'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      'from-green-500/20 via-emerald-500/20 to-teal-500/20',
      'from-yellow-500/20 via-orange-500/20 to-red-500/20',
      'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
      'from-cyan-500/20 via-blue-500/20 to-indigo-500/20'
    ];
    return gradients[index % gradients.length];
  };

  if (selectedGroup) {
    const groupExpenses = getGroupExpenses(selectedGroup.id);
    const groupBalance = balances
      .filter(b => b.groupId === selectedGroup.id && b.userId === currentUser?.id)
      .reduce((sum, b) => sum + b.balance, 0);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
        <motion.div 
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => setSelectedGroup(null)}
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedGroup.name}</h1>
            <p className="text-gray-400">{selectedGroup.description || 'Group details and expenses'}</p>
          </div>
        </motion.div>

        {/* Group Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/50 rounded-2xl p-6 border border-blue-500/30 hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
                whileHover={{ rotate: 5 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-blue-300 mb-2">Total Expenses</h3>
            <div className="flex items-center space-x-1">
              <IndianRupee className="w-6 h-6 text-blue-200" />
              <p className="text-2xl font-bold text-blue-200">{getGroupTotalExpenses(selectedGroup.id).toFixed(2)}</p>
            </div>
          </motion.div>

          <motion.div 
            className={`bg-gradient-to-br ${groupBalance >= 0 ? 'from-emerald-900/50 via-emerald-800/30 to-emerald-900/50' : 'from-red-900/50 via-red-800/30 to-red-900/50'} rounded-2xl p-6 border ${groupBalance >= 0 ? 'border-emerald-500/30 hover:shadow-emerald-500/20' : 'border-red-500/30 hover:shadow-red-500/20'} hover:shadow-2xl transition-all duration-300`}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className={`p-3 bg-gradient-to-br ${groupBalance >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-xl shadow-lg`}
                whileHover={{ rotate: -5 }}
              >
                {groupBalance >= 0 ? <TrendingDown className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white" />}
              </motion.div>
            </div>
            <h3 className={`text-sm font-semibold ${groupBalance >= 0 ? 'text-emerald-300' : 'text-red-300'} mb-2`}>Your Balance</h3>
            <div className={`flex items-center space-x-1 ${groupBalance >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
              <IndianRupee className="w-6 h-6" />
              <p className="text-2xl font-bold">{groupBalance >= 0 ? '+' : ''}{groupBalance.toFixed(2)}</p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-900/50 rounded-2xl p-6 border border-purple-500/30 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg"
                whileHover={{ rotate: 5 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Members</h3>
            <p className="text-2xl font-bold text-purple-200">{selectedGroup.members.length}</p>
          </motion.div>
        </motion.div>

        {/* Members List */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Members</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedGroup.members.map((member, index) => {
              const memberBalance = balances
                .filter(b => b.groupId === selectedGroup.id && b.userId === member.id)
                .reduce((sum, b) => sum + b.balance, 0);

              return (
                <motion.div 
                  key={member.id} 
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className={`text-right font-bold ${memberBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{memberBalance >= 0 ? '+' : ''}{memberBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Recent Expenses</span>
          </h2>
          {groupExpenses.length > 0 ? (
            <div className="space-y-4">
              {groupExpenses.slice(0, 10).map((expense, index) => {
                const paidByMember = selectedGroup.members.find(m => m.id === expense.paidBy);
                return (
                  <motion.div 
                    key={expense.id} 
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{expense.description}</p>
                      <p className="text-sm text-gray-400">
                        Paid by {paidByMember?.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="w-4 h-4 text-white" />
                        <span className="font-bold text-white">{expense.amount.toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-gray-400">{expense.category}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <DollarSign className="w-8 h-8 text-gray-400" />
              </motion.div>
              <p className="text-gray-400">No expenses yet</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent mb-2">
            Your Groups
          </h1>
          <p className="text-gray-400">Manage your expense sharing groups</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Create Group</span>
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, staggerChildren: 0.1 }}
      >
        {groups.map((group, index) => {
          const groupBalance = balances
            .filter(b => b.groupId === group.id && b.userId === currentUser?.id)
            .reduce((sum, b) => sum + b.balance, 0);

          const totalExpenses = getGroupTotalExpenses(group.id);
          const GroupIcon = getGroupIcon(group.category);

          return (
            <motion.div 
              key={group.id} 
              className={`bg-gradient-to-br ${getGroupGradient(index)} backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300 group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="bg-gray-800/70 backdrop-blur-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <GroupIcon className="w-5 h-5 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button 
                      onClick={() => handleEditGroup(group)}
                      className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button 
                      onClick={() => handleDeleteGroup(group)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
                
                {group.description && (
                  <p className="text-gray-400 text-sm mb-4">{group.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users size={16} />
                      <span className="text-sm">{group.members.length} members</span>
                    </div>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, memberIndex) => (
                        <motion.div
                          key={member.id}
                          className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-gray-800 shadow-lg"
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          style={{ zIndex: 3 - memberIndex }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </motion.div>
                      ))}
                      {group.members.length > 3 && (
                        <motion.div 
                          className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-xs font-medium border-2 border-gray-800 shadow-lg"
                          whileHover={{ scale: 1.2 }}
                        >
                          +{group.members.length - 3}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <IndianRupee size={16} />
                      <span className="text-sm">Total expenses</span>
                    </div>
                    <span className="font-semibold text-white">
                      ₹{totalExpenses.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar size={16} />
                      <span className="text-sm">Your balance</span>
                    </div>
                    <span className={`font-semibold ${
                      groupBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {groupBalance >= 0 ? '+' : ''}₹{groupBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-600/50">
                <motion.button 
                  onClick={() => setSelectedGroup(group)}
                  className="w-full text-center text-emerald-400 hover:text-emerald-300 font-medium text-sm py-1 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Create New Group</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Group Name*
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter group name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newGroup.description}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Member Emails
                    </label>
                    <div className="space-y-2">
                      {newGroup.memberEmails.map((email, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateMemberEmail(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-200"
                            placeholder="Enter email address"
                          />
                          {newGroup.memberEmails.length > 1 && (
                            <motion.button
                              onClick={() => removeMemberField(index)}
                              className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          )}
                        </div>
                      ))}
                      <motion.button
                        onClick={addMemberField}
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={16} />
                        <span>Add member</span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCreateGroup}
                    disabled={!newGroup.name.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Group
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Group Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Edit className="w-5 h-5 text-emerald-400" />
                  <span>Edit Group</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Group Name*
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter group name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newGroup.description}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    onClick={() => {
                      setShowEditModal(false);
                      setGroupToEdit(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleUpdateGroup}
                    disabled={!newGroup.name.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Group
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl max-w-md w-full border border-red-500/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span>Delete Group</span>
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">"{groupToDelete?.name}"</span>? 
                  This action cannot be undone and will remove all associated expenses.
                </p>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setGroupToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete Group
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}