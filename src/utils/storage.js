export const saveGameData = (data) => {
  localStorage.setItem('ninjaRushData', JSON.stringify(data));
};

export const loadGameData = () => {
  const saved = localStorage.getItem('ninjaRushData');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse save data', e);
    }
  }
  return {
    xp: 0,
    level: 1,
    coins: 0,
    unlockedSkins: ['default'],
    currentSkin: 'default',
    highScore: 0,
    completedMissions: [],
  };
};

export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 500)) + 1;
};

export const SKINS = [
  { id: 'default', name: 'Classic Ninja', cost: 0, color: 'bg-black', accent: 'bg-red-600' },
  { id: 'red', name: 'Crimson Assassin', cost: 500, color: 'bg-red-800', accent: 'bg-black' },
  { id: 'gold', name: 'Golden Master', cost: 2000, color: 'bg-yellow-500', accent: 'bg-white' },
  { id: 'shadow', name: 'Shadow Weaver', cost: 5000, color: 'bg-purple-900', accent: 'bg-fuchsia-500' },
];

export const MISSIONS = [
  { id: 'score_1000', desc: 'Reach 1000 Score in one run', type: 'score', target: 1000, reward: 200 },
  { id: 'score_5000', desc: 'Reach 5000 Score in one run', type: 'score', target: 5000, reward: 500 },
  { id: 'coins_50', desc: 'Collect 50 Coins in one run', type: 'coins', target: 50, reward: 300 },
  { id: 'level_5', desc: 'Reach Ninja Level 5', type: 'level', target: 5, reward: 1000 },
];
