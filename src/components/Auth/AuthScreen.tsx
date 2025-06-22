import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-8 h-8 bg-emerald-400/20 rounded-lg blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 left-32 w-6 h-6 bg-teal-400/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 8, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-24 w-10 h-10 bg-cyan-400/25 rounded-lg blur-sm"
      />
    </div>
  );
}