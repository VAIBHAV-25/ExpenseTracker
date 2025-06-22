import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Plus, History, User, Bell, LogOut, X, Check, Clock, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'history', label: 'History', icon: History },
  { id: 'profile', label: 'Profile', icon: User }
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { auth, logout, notifications, markNotificationRead, unreadNotificationsCount } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense_added':
        return Plus;
      case 'payment_received':
        return Check;
      case 'reminder':
        return Clock;
      case 'group_invite':
        return Users;
      default:
        return Gift;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expense_added':
        return 'text-blue-400';
      case 'payment_received':
        return 'text-green-400';
      case 'reminder':
        return 'text-yellow-400';
      case 'group_invite':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const userNotifications = notifications.filter(n => n.userId === auth.user?.id);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white font-bold text-lg">S</span>
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                SplitSmart
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive
                        ? 'text-emerald-400 shadow-lg'
                        : 'text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                );
              })}
              
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-700">
                <div className="relative">
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bell size={18} />
                    {unreadNotificationsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                      >
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                            <motion.button
                              onClick={() => setShowNotifications(false)}
                              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                          {unreadNotificationsCount > 0 && (
                            <p className="text-sm text-gray-400 mt-1">
                              {unreadNotificationsCount} unread notification{unreadNotificationsCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                          {userNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-700">
                              {userNotifications.map((notification, index) => {
                                const NotificationIcon = getNotificationIcon(notification.type);
                                const iconColor = getNotificationColor(notification.type);
                                
                                return (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                      !notification.read ? 'bg-gray-700/30' : ''
                                    }`}
                                    onClick={() => {
                                      if (!notification.read) {
                                        markNotificationRead(notification.id);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className={`p-2 rounded-lg bg-gray-700 ${iconColor}`}>
                                        <NotificationIcon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <p className="text-sm font-medium text-white truncate">
                                            {notification.title}
                                          </p>
                                          <span className="text-xs text-gray-400 ml-2">
                                            {formatNotificationTime(notification.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">
                                          {notification.message}
                                        </p>
                                        {!notification.read && (
                                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400">No notifications yet</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {auth.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-300">{auth.user?.name}</span>
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Logout"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-gray-400 hover:text-emerald-400'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="text-xs mt-1 font-medium relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Notifications Overlay */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowNotifications(false)} />
      )}
    </>
  );
}