import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  MapPin, 
  Settings, 
  BarChart3, 
  Shield,
  ChevronRight,
  Database,
  Gamepad2,
  TrendingUp,
  Activity,
  Globe,
  Zap,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Coins,
  DollarSign,
  MessageSquare,
  Store,
  Search,
  Crown,
  Ban,
  UserCheck,
  Gift,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Item, Pet, Achievement, User } from '../../types/game';

interface Shop {
  id: string;
  name: string;
  description: string;
  npcId: string;
  npcName: string;
  npcDialogue: string;
  items: ShopItem[];
  isActive: boolean;
}

interface ShopItem {
  id: string;
  itemId: string;
  price: number;
  currency: 'xenocoins' | 'cash';
  stockLimit?: number;
  isAvailable: boolean;
}

interface NPC {
  id: string;
  name: string;
  personality: string;
  dialogue: string;
  services: string[];
}

const adminSections = [
  {
    id: 'analytics',
    name: 'Game Analytics',
    description: 'View detailed game statistics and player metrics',
    icon: BarChart3,
    color: 'bg-blue-500',
    stats: { players: 0, pets: 0, revenue: 0 }
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage users, permissions, and account settings',
    icon: Users,
    color: 'bg-green-500',
    stats: { total: 0, active: 0, new: 0 }
  },
  {
    id: 'pets',
    name: 'Pet Management', 
    description: 'Manage pet species, attributes, and breeding system',
    icon: Shield,
    color: 'bg-purple-500',
    stats: { total: 0, alive: 0, legendary: 0 }
  },
  {
    id: 'items',
    name: 'Items & Economy',
    description: 'Manage universal items, effects, and game economy',
    icon: Package,
    color: 'bg-orange-500',
    stats: { items: 0, shops: 0, transactions: 0 }
  },
  {
    id: 'shops',
    name: 'Shop Management',
    description: 'Configure shops, NPCs, dialogues, and item sales',
    icon: Store,
    color: 'bg-emerald-500',
    stats: { shops: 0, npcs: 0, sales: 0 }
  },
  {
    id: 'world',
    name: 'World & POIs',
    description: 'Manage continents, maps, and points of interest',
    icon: MapPin,
    color: 'bg-red-500',
    stats: { continents: 6, pois: 48, quests: 127 }
  },
  {
    id: 'minigames',
    name: 'Minigames & Events',
    description: 'Configure minigames, rewards, and leaderboards',
    icon: Gamepad2,
    color: 'bg-indigo-500',
    stats: { games: 8, events: 3, players: 0 }
  },
  {
    id: 'content',
    name: 'Content & Sagas',
    description: 'Manage sagas, quests, NPCs, and storylines',
    icon: Database,
    color: 'bg-pink-500',
    stats: { sagas: 5, npcs: 89, dialogues: 234 }
  }
];

export const AdminPanel: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Partial<Item>>({});
  const [shops, setShops] = useState<Shop[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [newShop, setNewShop] = useState<Partial<Shop>>({});
  const [realTimeStats, setRealTimeStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    totalPets: 0,
    alivePets: 0,
    totalXenocoins: 0,
    totalCash: 0,
    dailyTransactions: 0,
    averageSessionTime: 0,
    retentionRate: 0,
    serverUptime: 99.9
  });

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currencyAmount, setCurrencyAmount] = useState<number>(0);
  const [currencyType, setCurrencyType] = useState<'xenocoins' | 'cash'>('xenocoins');
  const [users, setUsers] = useState<User[]>([]);

  const { 
    inventory, 
    addNotification, 
    pets, 
    user, 
    xenocoins, 
    cash, 
    updateCurrency, 
    searchPlayers,
    getAllUniversalItems,
    addUniversalItem,
    updateUniversalItem,
    deleteUniversalItem,
    getUniversalItem
  } = useGameStore();

  // Calculate real-time statistics from actual game state
  useEffect(() => {
    const calculateRealTimeStats = () => {
      // Get all users count (simulated - in real app would come from database)
      const totalPlayers = 1; // Current user (in real app, query all users)
      const activePlayers = user ? 1 : 0; // Users currently online
      
      // Pet statistics
      const totalPets = pets.length;
      const alivePets = pets.filter(pet => pet.isAlive).length;
      
      // Currency in circulation
      const totalXenocoins = xenocoins; // In real app, sum all users' xenocoins
      const totalCash = cash; // In real app, sum all users' cash
      
      // Universal items count
      const universalItems = getAllUniversalItems();
      const totalItems = universalItems.length;
      
      // Calculate other metrics
      const averageSessionTime = 45; // Would be calculated from session data
      const retentionRate = totalPlayers > 0 ? (activePlayers / totalPlayers) * 100 : 0;
      
      setRealTimeStats({
        totalPlayers,
        activePlayers,
        totalPets,
        alivePets,
        totalXenocoins,
        totalCash,
        dailyTransactions: inventory.reduce((sum, item) => sum + item.quantity, 0),
        averageSessionTime,
        retentionRate,
        serverUptime: 99.9
      });

      // Update section stats with real data
      adminSections[0].stats = { players: totalPlayers, pets: totalPets, revenue: totalXenocoins };
      adminSections[1].stats = { total: totalPlayers, active: activePlayers, new: 0 };
      adminSections[2].stats = { total: totalPets, alive: alivePets, legendary: pets.filter(p => p.species === 'Dragon').length };
      adminSections[3].stats = { items: totalItems, shops: shops.length, transactions: inventory.length };
      adminSections[4].stats = { shops: shops.length, npcs: npcs.length, sales: inventory.length };
      adminSections[6].stats = { games: 8, events: 3, players: activePlayers };
    };

    calculateRealTimeStats();
    
    // Update stats every 5 seconds
    const interval = setInterval(calculateRealTimeStats, 5000);
    
    return () => clearInterval(interval);
  }, [pets, inventory, xenocoins, cash, user, shops, npcs, getAllUniversalItems]);

  useEffect(() => {
    // Initialize sample shops and NPCs
    const sampleNPCs: NPC[] = [
      {
        id: 'npc-1',
        name: 'Merchant Maya',
        personality: 'Friendly and helpful',
        dialogue: 'Welcome to my shop, traveler! I have the finest items for your pets. What can I help you find today?',
        services: ['shop']
      },
      {
        id: 'npc-2',
        name: 'Healer Hank',
        personality: 'Wise and caring',
        dialogue: 'Your pets look like they could use some healing potions. I have just what they need to restore their health!',
        services: ['hospital', 'shop']
      },
      {
        id: 'npc-3',
        name: 'Armorer Alex',
        personality: 'Tough and reliable',
        dialogue: 'Looking for equipment to make your pets stronger? You\'ve come to the right place! My gear is the best in the realm.',
        services: ['shop']
      }
    ];

    const sampleShops: Shop[] = [
      {
        id: 'shop-1',
        name: 'General Store',
        description: 'Basic items for everyday pet care',
        npcId: 'npc-1',
        npcName: 'Merchant Maya',
        npcDialogue: 'Welcome to my shop, traveler! I have the finest items for your pets.',
        items: [
          { id: 'si-1', itemId: 'health-potion-1', price: 50, currency: 'xenocoins', isAvailable: true },
          { id: 'si-2', itemId: 'magic-apple-1', price: 25, currency: 'xenocoins', isAvailable: true }
        ],
        isActive: true
      },
      {
        id: 'shop-2',
        name: 'Healing Sanctuary',
        description: 'Specialized in health and recovery items',
        npcId: 'npc-2',
        npcName: 'Healer Hank',
        npcDialogue: 'Your pets look like they could use some healing potions.',
        items: [
          { id: 'si-3', itemId: 'health-potion-1', price: 45, currency: 'xenocoins', isAvailable: true }
        ],
        isActive: true
      }
    ];

    setNpcs(sampleNPCs);
    setShops(sampleShops);

    // Initialize sample users (in real app, this would come from database)
    if (user) {
      setUsers([user]);
    }
  }, [user]);

  const handleCreateItem = () => {
    if (!newItem.name || !newItem.description || !newItem.type || !newItem.rarity) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    const item: Item = {
      id: `admin-item-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      type: newItem.type as any,
      rarity: newItem.rarity as any,
      price: newItem.price || 0,
      currency: newItem.currency as any || 'xenocoins',
      effects: newItem.effects || {},
      quantity: 1,
      createdAt: new Date()
    };

    // Add to universal items system
    addUniversalItem(item);
    setNewItem({});
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setNewItem({ ...item });
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.name || !newItem.description) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    updateUniversalItem(editingItem.id, {
      name: newItem.name,
      description: newItem.description,
      type: newItem.type as any,
      rarity: newItem.rarity as any,
      price: newItem.price || 0,
      currency: newItem.currency as any || 'xenocoins',
      effects: newItem.effects || {}
    });

    setEditingItem(null);
    setNewItem({});
  };

  const handleDeleteItem = (itemId: string) => {
    deleteUniversalItem(itemId);
  };

  const handleCreateShop = () => {
    if (!newShop.name || !newShop.description || !newShop.npcName || !newShop.npcDialogue) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    const npcId = `npc-${Date.now()}`;
    const shopId = `shop-${Date.now()}`;

    const newNPC: NPC = {
      id: npcId,
      name: newShop.npcName!,
      personality: 'Friendly merchant',
      dialogue: newShop.npcDialogue!,
      services: ['shop']
    };

    const shop: Shop = {
      id: shopId,
      name: newShop.name!,
      description: newShop.description!,
      npcId: npcId,
      npcName: newShop.npcName!,
      npcDialogue: newShop.npcDialogue!,
      items: [],
      isActive: true
    };

    setNpcs(prev => [...prev, newNPC]);
    setShops(prev => [...prev, shop]);

    addNotification({
      type: 'success',
      title: 'Shop Created',
      message: `${shop.name} has been created with NPC ${newNPC.name}!`
    });

    setNewShop({});
  };

  const addItemToShop = (shopId: string, itemId: string, price: number, currency: 'xenocoins' | 'cash') => {
    // Verify item exists in universal system
    const universalItem = getUniversalItem(itemId);
    if (!universalItem) {
      addNotification({
        type: 'error',
        title: 'Item Not Found',
        message: 'This item does not exist in the universal items system!'
      });
      return;
    }

    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        const newShopItem: ShopItem = {
          id: `si-${Date.now()}`,
          itemId,
          price,
          currency,
          isAvailable: true
        };
        return { ...shop, items: [...shop.items, newShopItem] };
      }
      return shop;
    }));

    addNotification({
      type: 'success',
      title: 'Item Added to Shop',
      message: `${universalItem.name} has been added to the shop inventory!`
    });
  };

  const handleUserSearch = async () => {
    if (!userSearchQuery.trim()) return;
    
    try {
      const results = await searchPlayers(userSearchQuery);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleGiveCurrency = () => {
    if (!selectedUser || currencyAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please select a user and enter a valid amount'
      });
      return;
    }

    // In real app, this would update the database
    updateCurrency(currencyType, currencyAmount);
    
    addNotification({
      type: 'success',
      title: 'Currency Added',
      message: `Added ${currencyAmount} ${currencyType} to ${selectedUser.username}`
    });

    setCurrencyAmount(0);
  };

  const handleBanUser = (userId: string) => {
    addNotification({
      type: 'warning',
      title: 'User Action',
      message: 'User ban functionality would be implemented here'
    });
  };

  const handlePromoteUser = (userId: string) => {
    addNotification({
      type: 'info',
      title: 'User Action',
      message: 'User promotion functionality would be implemented here'
    });
  };

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* User Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search Users</h3>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            placeholder="Search by username..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
          />
          <motion.button
            onClick={handleUserSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </motion.button>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {users.map((userItem, index) => (
            <motion.div
              key={userItem.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedUser?.id === userItem.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {userItem.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{userItem.username}</h4>
                    {userItem.isAdmin && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Score: {userItem.accountScore.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Joined: {userItem.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setSelectedUser(userItem)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedUser?.id === userItem.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedUser?.id === userItem.id ? 'Selected' : 'Select'}
                </motion.button>
                
                <motion.button
                  onClick={() => handlePromoteUser(userItem.id)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Promote User"
                >
                  <UserCheck className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  onClick={() => handleBanUser(userItem.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Ban User"
                >
                  <Ban className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Currency Management */}
      {selectedUser && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Manage Currency for {selectedUser.username}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Type</label>
              <select
                value={currencyType}
                onChange={(e) => setCurrencyType(e.target.value as 'xenocoins' | 'cash')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="xenocoins">Xenocoins</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            
            <div className="flex items-end">
              <motion.button
                onClick={handleGiveCurrency}
                disabled={currencyAmount <= 0}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gift className="w-4 h-4" />
                <span>Give Currency</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { amount: 100, label: '100 XC', type: 'xenocoins' },
              { amount: 500, label: '500 XC', type: 'xenocoins' },
              { amount: 10, label: '10 Cash', type: 'cash' },
              { amount: 50, label: '50 Cash', type: 'cash' }
            ].map((quick) => (
              <motion.button
                key={`${quick.type}-${quick.amount}`}
                onClick={() => {
                  setCurrencyType(quick.type as 'xenocoins' | 'cash');
                  setCurrencyAmount(quick.amount);
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {quick.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* User Statistics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">User Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-blue-600 font-medium">Total Users</p>
            <p className="text-xl font-bold text-blue-800">{realTimeStats.totalPlayers}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-green-600 font-medium">Active Users</p>
            <p className="text-xl font-bold text-green-800">{realTimeStats.activePlayers}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-yellow-600 font-medium">Admins</p>
            <p className="text-xl font-bold text-yellow-800">{users.filter(u => u.isAdmin).length}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-purple-600 font-medium">Avg Score</p>
            <p className="text-xl font-bold text-purple-800">
              {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.accountScore, 0) / users.length).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Real-time Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              Live
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Players</p>
          <p className="text-2xl font-bold text-gray-900">{realTimeStats.totalPlayers}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              Live
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Pets</p>
          <p className="text-2xl font-bold text-gray-900">{realTimeStats.totalPets}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Coins className="w-8 h-8 text-yellow-600" />
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Circulation
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Xenocoins</p>
          <p className="text-2xl font-bold text-gray-900">{realTimeStats.totalXenocoins.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Premium
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Cash in Circulation</p>
          <p className="text-2xl font-bold text-gray-900">{realTimeStats.totalCash}</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Player Engagement</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Players</span>
              <span className="font-bold text-gray-900">{realTimeStats.activePlayers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Session Time</span>
              <span className="font-bold text-gray-900">{realTimeStats.averageSessionTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Player Retention Rate</span>
              <span className="font-bold text-green-600">{realTimeStats.retentionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Uptime</span>
              <span className="font-bold text-green-600">{realTimeStats.serverUptime}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Economy Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Item Transactions</span>
              <span className="font-bold text-gray-900">{realTimeStats.dailyTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Universal Items</span>
              <span className="font-bold text-gray-900">{getAllUniversalItems().length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pet to Player Ratio</span>
              <span className="font-bold text-gray-900">
                {realTimeStats.totalPlayers > 0 ? (realTimeStats.totalPets / realTimeStats.totalPlayers).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pet Survival Rate</span>
              <span className="font-bold text-green-600">
                {realTimeStats.totalPets > 0 ? ((realTimeStats.alivePets / realTimeStats.totalPets) * 100).toFixed(1) : 100}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Real-time System Status</h3>
        <div className="space-y-3">
          {[
            { action: `Current user: ${user?.username || 'Anonymous'}`, player: 'System', time: 'Now', type: 'user' },
            { action: `${realTimeStats.totalPets} pets currently active`, player: 'Game State', time: 'Live', type: 'pet' },
            { action: `${realTimeStats.totalXenocoins} Xenocoins in circulation`, player: 'Economy', time: 'Live', type: 'transaction' },
            { action: `${getAllUniversalItems().length} universal items in system`, player: 'Item System', time: 'Live', type: 'item' },
            { action: `Server running at ${realTimeStats.serverUptime}% uptime`, player: 'System Monitor', time: 'Live', type: 'system' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">by {activity.player}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShopManagement = () => (
    <div className="space-y-6">
      {/* Create New Shop */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Shop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Shop Name"
            value={newShop.name || ''}
            onChange={(e) => setNewShop(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="NPC Name"
            value={newShop.npcName || ''}
            onChange={(e) => setNewShop(prev => ({ ...prev, npcName: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            placeholder="Shop Description"
            value={newShop.description || ''}
            onChange={(e) => setNewShop(prev => ({ ...prev, description: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <textarea
            placeholder="NPC Dialogue"
            value={newShop.npcDialogue || ''}
            onChange={(e) => setNewShop(prev => ({ ...prev, npcDialogue: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <motion.button
          onClick={handleCreateShop}
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Shop</span>
        </motion.button>
      </div>

      {/* Existing Shops */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Existing Shops ({shops.length})</h3>
        <div className="space-y-4">
          {shops.map((shop) => (
            <div key={shop.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                  <p className="text-sm text-gray-600">{shop.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{shop.npcName}</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{shop.npcDialogue}"</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">Shop Items ({shop.items.length})</h5>
                {shop.items.map((shopItem) => {
                  const item = getUniversalItem(shopItem.itemId);
                  return (
                    <div key={shopItem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{item?.name || 'Unknown Item'}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {shopItem.price} {shopItem.currency}
                      </span>
                    </div>
                  );
                })}
                
                <div className="flex items-center space-x-2 mt-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option value="">Select Universal Item</option>
                    {getAllUniversalItems().map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    className="text-sm border border-gray-300 rounded px-2 py-1 w-20"
                  />
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option value="xenocoins">Xenocoins</option>
                    <option value="cash">Cash</option>
                  </select>
                  <motion.button
                    onClick={() => {
                      const firstItem = getAllUniversalItems()[0];
                      if (firstItem) {
                        addItemToShop(shop.id, firstItem.id, 100, 'xenocoins');
                      }
                    }}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderItemManagement = () => (
    <div className="space-y-6">
      {/* Create/Edit Item */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {editingItem ? 'Edit Universal Item' : 'Create New Universal Item'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={newItem.type || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="Food">Food</option>
            <option value="Potion">Potion</option>
            <option value="Equipment">Equipment</option>
            <option value="Special">Special</option>
            <option value="Weapon">Weapon</option>
          </select>
          <select
            value={newItem.rarity || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, rarity: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
            <option value="Unique">Unique</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={newItem.price || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={newItem.currency || 'xenocoins'}
            onChange={(e) => setNewItem(prev => ({ ...prev, currency: e.target.value as 'xenocoins' | 'cash' }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="xenocoins">Xenocoins</option>
            <option value="cash">Cash</option>
          </select>
          <textarea
            placeholder="Description (include utility info like 'hunger decays over time')"
            value={newItem.description || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Effects (JSON format)</label>
            <textarea
              placeholder='{"health": 5, "hunger": 3, "happiness": 1}'
              value={JSON.stringify(newItem.effects || {})}
              onChange={(e) => {
                try {
                  const effects = JSON.parse(e.target.value);
                  setNewItem(prev => ({ ...prev, effects }));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <motion.button
            onClick={editingItem ? handleUpdateItem : handleCreateItem}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingItem ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editingItem ? 'Update Item' : 'Create Item'}</span>
          </motion.button>
          {editingItem && (
            <motion.button
              onClick={() => {
                setEditingItem(null);
                setNewItem({});
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Universal Items List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Universal Items ({getAllUniversalItems().length})</h3>
        <div className="space-y-3">
          {getAllUniversalItems().map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.type} • {item.rarity} • {item.price} {item.currency}</p>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                {item.effects && Object.keys(item.effects).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(item.effects).map(([effect, value]) => (
                      <span key={effect} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        +{value} {effect}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => handleEditItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (selectedSection) {
    const section = adminSections.find(s => s.id === selectedSection);
    
    return (
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`${section?.color} p-3 rounded-xl`}>
                {section?.icon && <section.icon className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{section?.name}</h2>
                <p className="text-gray-600">{section?.description}</p>
              </div>
            </div>
            <motion.button
              onClick={() => setSelectedSection(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
          
          {selectedSection === 'analytics' && renderAnalytics()}
          {selectedSection === 'users' && renderUserManagement()}
          {selectedSection === 'items' && renderItemManagement()}
          {selectedSection === 'shops' && renderShopManagement()}
          {!['analytics', 'users', 'items', 'shops'].includes(selectedSection) && (
            <div className="text-center py-16">
              <motion.div 
                className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Settings className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {section?.name} Interface
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This comprehensive management interface will be implemented in the next development phase, 
                featuring advanced tools for {section?.name.toLowerCase()}.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Real-time</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Secure</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Efficient</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Calculate real-time stats for dashboard
  const quickStats = [
    { 
      label: 'Total Players', 
      value: realTimeStats.totalPlayers.toString(), 
      change: realTimeStats.activePlayers > 0 ? '+100%' : '0%', 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Active Pets', 
      value: realTimeStats.totalPets.toString(), 
      change: realTimeStats.alivePets === realTimeStats.totalPets ? '+100%' : `${Math.round((realTimeStats.alivePets / Math.max(realTimeStats.totalPets, 1)) * 100)}%`, 
      icon: Shield, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Money in Circulation', 
      value: `${(realTimeStats.totalXenocoins / 1000).toFixed(1)}K XC`, 
      change: realTimeStats.totalXenocoins > 1000 ? '+' + Math.round(((realTimeStats.totalXenocoins - 1000) / 1000) * 100) + '%' : '0%', 
      icon: Coins, 
      color: 'text-yellow-600' 
    },
    { 
      label: 'Universal Items', 
      value: getAllUniversalItems().length.toString(), 
      change: '+100%', 
      icon: Package, 
      color: 'text-orange-600' 
    }
  ];

  const recentActivity = [
    { id: 1, type: 'user', message: `Current user: ${user?.username || 'Anonymous'}`, time: 'Now', icon: Users, color: 'bg-blue-500' },
    { id: 2, type: 'item', message: `${getAllUniversalItems().length} universal items in system`, player: 'Item System', time: 'Live', icon: Package, color: 'bg-green-500' },
    { id: 3, type: 'pet', message: `${realTimeStats.totalPets} pets active`, player: 'Pet System', time: 'Live', icon: Shield, color: 'bg-purple-500' },
    { id: 4, type: 'system', message: `${realTimeStats.totalXenocoins} XC in circulation`, player: 'Economy', time: 'Live', icon: Settings, color: 'bg-gray-500' },
    { id: 5, type: 'event', message: `${shops.length} shops operational`, player: 'Commerce', time: 'Live', icon: Gamepad2, color: 'bg-indigo-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Header */}
      <motion.div 
        className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 text-white rounded-3xl p-8 shadow-2xl border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Xenopets Admin Panel</h1>
              <p className="opacity-90 text-lg">Universal Item System & Real-time Management</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Last updated</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Admin Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`${section.color} p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {section.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600 transition-all" />
              </div>
              
              {/* Section Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {Object.entries(section.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 capitalize">{key}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Real-time System Status</h3>
          <Activity className="w-6 h-6 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};