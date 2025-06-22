import { AICategory } from '../types';

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Travel',
  'Healthcare',
  'Education',
  'Personal Care',
  'Home & Garden',
  'Gifts',
  'Groceries',
  'Rent',
  'Insurance',
  'Other'
];

const categoryKeywords: Record<string, string[]> = {
  'Food & Dining': ['restaurant', 'food', 'dinner', 'lunch', 'breakfast', 'coffee', 'pizza', 'burger', 'cafe', 'kitchen', 'zomato', 'swiggy', 'dominos', 'mcdonalds', 'kfc'],
  'Transportation': ['uber', 'ola', 'taxi', 'auto', 'bus', 'train', 'metro', 'petrol', 'diesel', 'fuel', 'parking', 'toll', 'flight', 'car'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'store', 'mall', 'clothes', 'shopping', 'purchase', 'buy'],
  'Entertainment': ['movie', 'cinema', 'pvr', 'inox', 'netflix', 'prime', 'hotstar', 'game', 'concert', 'party', 'bar', 'club'],
  'Bills & Utilities': ['electricity', 'water', 'gas', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'bill'],
  'Travel': ['hotel', 'resort', 'booking', 'makemytrip', 'goibibo', 'vacation', 'trip', 'holiday'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medicine', 'medical', 'health', 'clinic'],
  'Education': ['school', 'college', 'university', 'book', 'course', 'tuition', 'fees'],
  'Personal Care': ['salon', 'spa', 'gym', 'fitness', 'beauty', 'parlour'],
  'Home & Garden': ['furniture', 'decor', 'garden', 'tools', 'repair', 'maintenance'],
  'Groceries': ['grocery', 'vegetables', 'fruits', 'milk', 'bread', 'rice', 'dal', 'supermarket'],
  'Rent': ['rent', 'house', 'flat', 'apartment', 'accommodation'],
  'Insurance': ['insurance', 'policy', 'premium', 'lic'],
  'Gifts': ['gift', 'present', 'birthday', 'anniversary', 'wedding']
};

export const aiService = {
  async categorizeExpense(description: string): Promise<AICategory> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerDescription = description.toLowerCase();
    let bestMatch = 'Other';
    let bestScore = 0;
    let reasoning = 'Based on general classification';
    let matchedKeywords: string[] = [];
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(keyword => lowerDescription.includes(keyword));
      if (matches.length > bestScore) {
        bestScore = matches.length;
        bestMatch = category;
        matchedKeywords = matches;
        reasoning = `Detected keywords: ${matches.join(', ')}`;
      }
    }
    
    const confidence = Math.min(0.95, 0.4 + (bestScore * 0.15));
    
    // Generate suggested tags
    const suggestedTags = matchedKeywords.slice(0, 3);
    
    return {
      category: bestMatch,
      confidence,
      reasoning,
      suggestedTags
    };
  },

  async extractReceiptData(imageData: string): Promise<{
    amount: number;
    description: string;
    category: string;
    confidence: number;
    items?: Array<{ name: string; price: number; quantity: number }>;
    merchant?: string;
    date?: Date;
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock receipt extraction with Indian context
    const mockReceipts = [
      { 
        amount: 1250.50, 
        description: "Big Bazaar - Grocery Shopping", 
        category: "Groceries",
        merchant: "Big Bazaar",
        items: [
          { name: "Rice (5kg)", price: 450, quantity: 1 },
          { name: "Dal (2kg)", price: 280, quantity: 1 },
          { name: "Vegetables", price: 320.50, quantity: 1 },
          { name: "Milk (2L)", price: 200, quantity: 1 }
        ]
      },
      { 
        amount: 350.00, 
        description: "Cafe Coffee Day", 
        category: "Food & Dining",
        merchant: "CCD",
        items: [
          { name: "Cappuccino", price: 180, quantity: 2 },
          { name: "Sandwich", price: 170, quantity: 1 }
        ]
      },
      { 
        amount: 2500.00, 
        description: "Reliance Digital - Electronics", 
        category: "Shopping",
        merchant: "Reliance Digital",
        items: [
          { name: "Phone Case", price: 800, quantity: 1 },
          { name: "Earphones", price: 1700, quantity: 1 }
        ]
      },
      { 
        amount: 180.00, 
        description: "Ola Cab Ride", 
        category: "Transportation",
        merchant: "Ola"
      },
      { 
        amount: 850.00, 
        description: "Domino's Pizza", 
        category: "Food & Dining",
        merchant: "Domino's",
        items: [
          { name: "Margherita Pizza", price: 450, quantity: 1 },
          { name: "Garlic Bread", price: 200, quantity: 1 },
          { name: "Coke", price: 200, quantity: 2 }
        ]
      }
    ];
    
    const receipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
    
    return {
      ...receipt,
      date: new Date(),
      confidence: 0.85 + Math.random() * 0.1
    };
  },

  async smartSplit(amount: number, members: string[], context?: string): Promise<{
    suggestion: Record<string, number>;
    reasoning: string;
    confidence: number;
  }> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // For now, suggest equal split but could be enhanced with ML
    const perPerson = amount / members.length;
    const suggestion: Record<string, number> = {};
    
    members.forEach(memberId => {
      suggestion[memberId] = perPerson;
    });
    
    return {
      suggestion,
      reasoning: `Suggested equal split of ₹${perPerson.toFixed(2)} per person`,
      confidence: 0.9
    };
  }
};