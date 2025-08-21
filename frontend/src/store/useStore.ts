import { create } from 'zustand';

// User Interface
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  fitnessGoals: string[];
  membershipType: 'basic' | 'premium' | 'pro';
  wallet: {
    balance: number;
    transactions: Transaction[];
  };
  profile: {
    age?: number;
    weight?: number;
    height?: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  };
}

// Gym Interface
interface Gym {
  id: string;
  name: string;
  location: string;
  rating: number;
  images: string[];
  amenities: string[];
  openingHours: string;
  priceRange: string;
  distance?: number;
  isPartner: boolean;
}

// Fitness Data Interface
interface FitnessData {
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  workouts: Workout[];
  goals: {
    daily: {
      steps: number;
      calories: number;
      water: number;
    };
    weekly: {
      workouts: number;
      activeMinutes: number;
    };
  };
}

// Workout Interface
interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  type: 'cardio' | 'strength' | 'yoga' | 'sports' | 'other';
  date: Date;
}

// Meal Interface
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
}

// Product Interface
interface Product {
  id: string;
  name: string;
  price: number;
  category: 'supplements' | 'equipment' | 'clothing' | 'accessories';
  image: string;
  rating: number;
  inStock: boolean;
  description: string;
}

// Transaction Interface
interface Transaction {
  id: string;
  type: 'recharge' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

// Notification Interface
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
  date: Date;
}

// Store State Interface
interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';

  // Gyms
  gyms: Gym[];
  selectedGym: Gym | null;
  checkedInGym: Gym | null;

  // Fitness
  fitnessData: FitnessData;
  todayStats: {
    steps: number;
    calories: number;
    water: number;
    workouts: number;
  };

  // Nutrition
  meals: Meal[];
  dailyNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  // E-commerce
  products: Product[];
  cart: (Product & { quantity: number })[];
  orders: any[];

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // UI State
  sidebarOpen: boolean;
  loading: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateFitnessData: (data: Partial<FitnessData>) => void;
  checkInToGym: (gym: Gym) => void;
  addMeal: (meal: Meal) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  theme: 'dark',
  
  gyms: [],
  selectedGym: null,
  checkedInGym: null,
  
  fitnessData: {
    steps: 8547,
    calories: 2340,
    distance: 6.2,
    activeMinutes: 45,
    workouts: [],
    goals: {
      daily: { steps: 10000, calories: 2500, water: 8 },
      weekly: { workouts: 5, activeMinutes: 300 }
    }
  },
  
  todayStats: {
    steps: 8547,
    calories: 2340,
    water: 6,
    workouts: 2
  },
  
  meals: [],
  dailyNutrition: {
    calories: 1850,
    protein: 120,
    carbs: 185,
    fat: 65
  },
  
  products: [],
  cart: [],
  orders: [],
  
  notifications: [],
  unreadCount: 0,
  
  sidebarOpen: false,
  loading: false,

  // Actions
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    checkedInGym: null,
    cart: []
  }),
  
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  
  updateFitnessData: (data) => set((state) => ({
    fitnessData: { ...state.fitnessData, ...data }
  })),
  
  checkInToGym: (gym) => set({ checkedInGym: gym }),
  
  addMeal: (meal) => set((state) => ({
    meals: [...state.meals, meal]
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      { ...notification, id: Date.now().toString() },
      ...state.notifications
    ],
    unreadCount: state.unreadCount + 1
  })),
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  }))
}));

export type { User, Gym, FitnessData, Workout, Meal, Product, Transaction, Notification };