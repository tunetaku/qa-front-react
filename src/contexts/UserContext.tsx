import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as userApi from './userApi';

// localStorageキー
const LOCAL_USER_KEY = 'user';

// Context型
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  saveUser: (user: User) => Promise<void>;
  clearUser: () => void;
  saveUserToLocalStorage: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 初回マウント時にlocalStorageから取得
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // DBとlocalStorageへ保存
  const saveUser = async (newUser: User) => {
    try {
      await userApi.saveUserToDb(newUser); // DB保存
      saveUserToLocalStorage(newUser);
    } catch (e) {
      throw e;
    }
  };

  //localstorageへ保存
  const saveUserToLocalStorage = (user: User) => {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  // ログアウト等でユーザー情報削除
  const clearUser = () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, saveUser, clearUser,saveUserToLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
