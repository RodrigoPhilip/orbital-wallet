import { useEffect } from 'react';
import { storage } from '../utils/storage';
import { locked } from '../signals';
import { useSignals } from '@preact/signals-react/runtime';

export const useActivityDetector = () => {
  useSignals();
  useEffect(() => {
    const handleActivity = async () => {
      if (locked.value) return;

      const timestamp = Date.now();
      storage.set({ lastActiveTime: timestamp });
    };

    document.addEventListener('mousemove', handleActivity);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
    };
  }, []);
};
