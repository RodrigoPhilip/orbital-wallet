import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

export type SocialProfile = {
  displayName: string;
  avatar: string;
};

export const useSocialProfile = () => {
  const [socialProfile, setSocialProfile] = useState<SocialProfile>({
    displayName: 'Anon Orbital',
    avatar: "",
  });

  useEffect(() => {
    const getSocialProfile = (): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        storage.get(['socialProfile'], async (result) => {
          try {
            if (result?.socialProfile) {
              setSocialProfile(result.socialProfile);
            }
            resolve(result.socialProfile);
          } catch (error) {
            reject(error);
          }
        });
      });
    };

    getSocialProfile();
  }, []);

  const storeSocialProfile = (profile: SocialProfile) => {
    storage.set({
      socialProfile: profile,
    });
    setSocialProfile(profile);
  };

  return {
    socialProfile,
    storeSocialProfile,
  };
};
