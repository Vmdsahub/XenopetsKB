import React, { useState } from 'react';
import { Trophy, Calendar, Star, Settings, Shield, Users, Award, Gift, LogOut, Crown, Search, UserPlus, ArrowLeft, Eye, MessageCircle, UserCheck } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types/game';

export const ProfileScreen: React.FC = () => {
  const { user, activePet, pets, achievements, searchPlayers, getPlayerProfile } = useGameStore();
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(null);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleSearchPlayers = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchPlayers(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        // Show no results message
      }
    } catch (error) {
      console.error('Error searching players:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewProfile = async (playerId: string) => {
    try {
      const profile = await getPlayerProfile(playerId);
      if (profile) {
        setViewingProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching player profile:', error);
    }
  };

  if (!user) {
    return (
      <motion.div 
        className="flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Não Logado</h2>
          <p className="text-gray-600">Por favor, faça login para ver seu perfil.</p>
        </div>
      </motion.div>
    );
  }

  const totalDaysPlayed = Math.floor(
    (new Date().getTime() - user.createdAt.getTime()) / (1000 * 3600 * 24)
  );

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const totalAchievements = achievements.length;

  const quickActions = [
    {
      id: 'collectibles',
      title: 'Colecionáveis',
      description: 'Veja sua coleção rara',
      icon: Star,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'search',
      title: 'Buscar Jogadores',
      description: 'Encontre outros treinadores',
      icon: Search,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Gerencie preferências da conta',
      icon: Settings,
      color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
      iconColor: 'text-gray-600'
    }
  ];

  const renderPlayerProfile = (player: User) => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Profile Header - Identical to user's own profile */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {player.username.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </motion.div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{player.username}</h2>
            <p className="text-gray-600 text-sm">Treinador Xenopets</p>
            <div className="flex items-center space-x-3 mt-2">
              {player.isAdmin && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-300">
                  <Crown className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">Admin</span>
                </div>
              )}
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full">
                <Star className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Level {Math.floor(player.accountScore / 500) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <motion.div 
            className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Dias Jogados</p>
            <p className="text-xl font-bold text-blue-800">{player.daysPlayed}</p>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-xs text-yellow-600 font-medium">Pontuação</p>
            <p className="text-xl font-bold text-yellow-800">{player.accountScore.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-xs text-purple-600 font-medium">Xenocoins</p>
            <p className="text-xl font-bold text-purple-800">{player.totalXenocoins.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium text-sm">Perfil Público</span>
          </div>
          <span className="text-green-600 text-sm">Membro desde {player.createdAt.toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <motion.button
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mensagem</span>
          </motion.button>
          <motion.button
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Actions and Collectibles Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Conquistas</h3>
            <div className="flex items-center space-x-1">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">Públicas</span>
            </div>
          </div>
          <div className="space-y-3">
            {/* Sample achievements for viewed profile */}
            {[
              { name: 'Primeiro Pet', description: 'Criou seu primeiro pet', icon: '🐾' },
              { name: 'Explorador', description: 'Visitou 5 continentes', icon: '🗺️' },
              { name: 'Colecionador', description: 'Coletou 10 itens únicos', icon: '💎' }
            ].map((achievement, index) => (
              <motion.div
                key={achievement.name}
                className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-2xl border border-yellow-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Collectibles */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Colecionáveis</h3>
            <Star className="w-5 h-5 text-purple-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {/* Sample collectibles for viewed profile */}
            {[
              { name: 'Cristal Raro', rarity: 'Rare', icon: '💎' },
              { name: 'Peixe Dourado', rarity: 'Epic', icon: '🐟' },
              { name: 'Ovo Místico', rarity: 'Legendary', icon: '🥚' }
            ].map((collectible, index) => (
              <motion.div
                key={collectible.name}
                className="aspect-square bg-purple-50 rounded-xl border border-purple-200 flex flex-col items-center justify-center p-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl mb-1">{collectible.icon}</span>
                <p className="text-xs font-medium text-purple-800 text-center">{collectible.name}</p>
                <p className="text-xs text-purple-600">{collectible.rarity}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Player Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Último login</p>
              <p className="text-xs text-gray-600">{player.lastLogin.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Membro desde</p>
              <p className="text-xs text-gray-600">{player.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPlayerSearch = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Buscar Jogadores</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Digite o nome do jogador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchPlayers()}
          />
          <motion.button
            onClick={handleSearchPlayers}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Buscar</span>
          </motion.button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Resultados da Busca ({searchResults.length})</h4>
          <div className="space-y-3">
            {searchResults.map((player, index) => (
              <motion.div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {player.username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{player.username}</p>
                      {player.isAdmin && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Score: {player.accountScore.toLocaleString()}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleViewProfile(player.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Perfil</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Nenhum jogador encontrado com o nome "{searchQuery}".</p>
          <p className="text-gray-500 text-sm mt-2">Tente usar um nome diferente ou verifique a ortografia.</p>
        </div>
      )}
    </motion.div>
  );

  // Show player profile view
  if (viewingProfile) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Perfil do Jogador</h2>
          <motion.button
            onClick={() => setViewingProfile(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </motion.button>
        </div>
        {renderPlayerProfile(viewingProfile)}
      </div>
    );
  }

  // Show search interface
  if (activeSection === 'search') {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Buscar Jogadores</h2>
          <motion.button
            onClick={() => setActiveSection(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </motion.button>
        </div>
        {renderPlayerSearch()}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {user.username.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </motion.div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <div className="flex items-center space-x-3 mt-2">
              {user.isAdmin && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-300">
                  <Crown className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">Admin</span>
                </div>
              )}
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full">
                <Star className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Level {Math.floor(user.accountScore / 500) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <motion.div 
            className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Dias Jogados</p>
            <p className="text-xl font-bold text-blue-800">{totalDaysPlayed}</p>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-xs text-yellow-600 font-medium">Pontuação</p>
            <p className="text-xl font-bold text-yellow-800">{user.accountScore.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-xs text-purple-600 font-medium">Conquistas</p>
            <p className="text-xl font-bold text-purple-800">{unlockedAchievements.length}</p>
          </motion.div>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium text-sm">Online</span>
          </div>
          <span className="text-green-600 text-sm">Conectado ao servidor</span>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </motion.div>

      {/* My Pets */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Meus Pets</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>{pets.length}</span>
            <span>/</span>
            <span>3</span>
          </div>
        </div>
        <div className="space-y-3">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                activePet?.id === pet.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold">
                  {pet.species === 'Dragon' ? '🐉' : 
                   pet.species === 'Phoenix' ? '🔥' : 
                   pet.species === 'Griffin' ? '🦅' : '🦄'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{pet.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{pet.species}</span>
                  <span>•</span>
                  <span>Level {pet.level}</span>
                  <span>•</span>
                  <span className="capitalize">{pet.personality}</span>
                  {pet.conditions.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600">{pet.conditions.length} condição(ões)</span>
                    </>
                  )}
                </div>
              </div>
              {activePet?.id === pet.id && (
                <motion.span 
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Ativo
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions and Collectibles Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Conquistas</h3>
            <div className="flex items-center space-x-1">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">{unlockedAchievements.length}/{totalAchievements}</span>
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  onClick={() => setActiveSection(action.id)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all text-left ${action.color}`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={`p-3 rounded-xl ${action.iconColor} bg-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Collectibles */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Colecionáveis</h3>
            <Star className="w-5 h-5 text-purple-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {/* Sample collectibles */}
            {[
              { name: 'Cristal Raro', rarity: 'Rare', icon: '💎' },
              { name: 'Peixe Dourado', rarity: 'Epic', icon: '🐟' },
              { name: 'Ovo Místico', rarity: 'Legendary', icon: '🥚' },
              { name: 'Pedra Lunar', rarity: 'Uncommon', icon: '🌙' },
              { name: 'Flor Eterna', rarity: 'Rare', icon: '🌸' },
              { name: 'Selo Antigo', rarity: 'Epic', icon: '📜' }
            ].map((collectible, index) => (
              <motion.div
                key={collectible.name}
                className="aspect-square bg-purple-50 rounded-xl border border-purple-200 flex flex-col items-center justify-center p-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl mb-1">{collectible.icon}</span>
                <p className="text-xs font-medium text-purple-800 text-center">{collectible.name}</p>
                <p className="text-xs text-purple-600">{collectible.rarity}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements - Moved to bottom */}
      {unlockedAchievements.length > 0 && (
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Conquistas Recentes</h3>
            <div className="flex items-center space-x-1">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">{unlockedAchievements.length}/{totalAchievements}</span>
            </div>
          </div>
          <div className="space-y-3">
            {unlockedAchievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-2xl border border-yellow-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <Gift className="w-4 h-4 text-yellow-600" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};