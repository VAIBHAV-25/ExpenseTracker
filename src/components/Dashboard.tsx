import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight, IndianRupee, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const { auth, groups, expenses, balances } = useApp();

  const totalOwed = balances
    .filter(b => b.balance < 0)
    .reduce((sum, b) => sum + Math.abs(b.balance), 0);

  const totalOwedToYou = balances
    .filter(b => b.balance > 0)
    .reduce((sum, b) => sum + b.balance, 0);

  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:pt-20">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
            Welcome back, {auth.user?.name?.split(' ')[0]}!
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Here's your expense overview for today</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-gradient-to-br from-red-900/50 via-red-800/30 to-red-900/50 rounded-2xl p-6 border border-red-500/30 shadow-2xl hover:shadow-red-500/10 transition-all duration-300 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg"
              whileHover={{ rotate: 5 }}
            >
              <ArrowUpRight className="w-6 h-6 text-white" />
            </motion.div>
            <TrendingUp className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-sm font-semibold text-red-300 mb-2">You Owe</h3>
          <div className="flex items-center space-x-1">
            <IndianRupee className="w-6 h-6 text-red-200" />
            <p className="text-2xl font-bold text-red-200">{totalOwed.toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-emerald-900/50 via-emerald-800/30 to-emerald-900/50 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg"
              whileHover={{ rotate: -5 }}
            >
              <ArrowDownRight className="w-6 h-6 text-white" />
            </motion.div>
            <TrendingDown className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-emerald-300 mb-2">Owed to You</h3>
          <div className="flex items-center space-x-1">
            <IndianRupee className="w-6 h-6 text-emerald-200" />
            <p className="text-2xl font-bold text-emerald-200">{totalOwedToYou.toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/50 rounded-2xl p-6 border border-blue-500/30 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
              whileHover={{ rotate: 5 }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-blue-300 mb-2">This Month</h3>
          <div className="flex items-center space-x-1">
            <IndianRupee className="w-6 h-6 text-blue-200" />
            <p className="text-2xl font-bold text-blue-200">{totalThisMonth.toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-900/50 rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg"
              whileHover={{ rotate: -5 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-purple-300 mb-2">Active Groups</h3>
          <p className="text-2xl font-bold text-purple-200">{groups.length}</p>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <span>Recent Expenses</span>
          </h2>
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => {
              const group = groups.find(g => g.id === expense.groupId);
              return (
                <motion.div 
                  key={expense.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl hover:from-emerald-900/30 hover:to-teal-900/30 transition-all duration-300 border border-gray-600/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">{expense.description}</p>
                    <p className="text-sm text-gray-400">{group?.name} • {expense.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4 text-gray-300" />
                      <p className="font-bold text-white">{expense.amount.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Your Groups</span>
          </h2>
          <div className="space-y-4">
            {groups.map((group, index) => {
              const groupBalance = balances
                .filter(b => b.groupId === group.id && b.userId === auth.user?.id)
                .reduce((sum, b) => sum + b.balance, 0);

              return (
                <motion.div 
                  key={group.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl hover:from-emerald-900/30 hover:to-teal-900/30 transition-all duration-300 border border-gray-600/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">{group.name}</p>
                    <p className="text-sm text-gray-400">{group.members.length} members</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 font-bold ${
                      groupBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      <IndianRupee className="w-4 h-4" />
                      <span>
                        {groupBalance >= 0 ? '+' : ''}{groupBalance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <IndianRupee className="w-3 h-3" />
                      <span>{group.totalExpenses.toFixed(2)} total</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}