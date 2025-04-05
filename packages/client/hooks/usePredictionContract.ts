import { getContract, getProvider } from '@/lib/web3Config';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export const usePredictionContract = (predictionId: number) => {
  const [yesPercentage, setYesPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = getProvider();
        const contract = getContract(provider);

        const [totalYes, totalNo] = await Promise.all([
          contract.getTotalYes(),
          contract.getTotalNo(),
        ]);

        console.log(totalYes, totalNo);

        const totalYesNum = Number(ethers.formatEther(totalYes));
        const totalNoNum = Number(ethers.formatEther(totalNo));
        const total = totalYesNum + totalNoNum;

        if (total === 0) {
          setYesPercentage(50); // Default to 50% when no bets
        } else {
          setYesPercentage((totalYesNum / total) * 100);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching prediction data:', err);
        setError('Failed to fetch prediction data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { yesPercentage, loading, error };
};
