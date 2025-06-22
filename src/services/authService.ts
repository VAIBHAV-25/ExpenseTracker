import { User } from '../types';

class AuthService {
  private users: User[] = [
    {
      id: 'user-1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      createdAt: new Date('2024-01-01'),
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: true,
        theme: 'dark'
      }
    },
    {
      id: 'user-2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      createdAt: new Date('2024-01-15'),
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: true,
        theme: 'dark'
      }
    }
  ];

  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // In real app, verify password
    return user;
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user already exists
    if (this.users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date(),
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: true,
        theme: 'dark'
      }
    };

    this.users.push(newUser);
    return newUser;
  }

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async searchUsers(query: string): Promise<User[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      (user.phone && user.phone.includes(query))
    );
  }

  async inviteUser(email: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let user = this.users.find(u => u.email === email);
    
    if (!user) {
      // Create a placeholder user for invitation
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        createdAt: new Date(),
        preferences: {
          currency: 'INR',
          language: 'en',
          notifications: true,
          theme: 'dark'
        }
      };
      this.users.push(user);
    }
    
    return user;
  }
}

export const authService = new AuthService();