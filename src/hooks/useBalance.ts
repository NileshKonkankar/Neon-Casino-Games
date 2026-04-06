import { useState, useEffect } from 'react';

const INITIAL_BALANCE = 1000;
const STORAGE_KEY = 'neon_vault_balance';
const LAST_REWARD_KEY = 'neon_vault_last_reward';

export function useBalance() {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : INITIAL_BALANCE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const claimDailyReward = () => {
    const now = Date.now();
    const lastReward = localStorage.getItem(LAST_REWARD_KEY);
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastReward || now - parseInt(lastReward, 10) > oneDay) {
      const reward = 500;
      updateBalance(reward);
      localStorage.setItem(LAST_REWARD_KEY, now.toString());
      return reward;
    }
    return 0;
  };

  return { balance, updateBalance, claimDailyReward };
}
