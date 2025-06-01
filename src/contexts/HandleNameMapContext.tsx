import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAllUsersLdapHandle, buildHandleNameMap, HandleNameMap } from './userApi';

export const HandleNameMapContext = createContext<HandleNameMap>({});

export const HandleNameMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handleNameMap, setHandleNameMap] = useState<HandleNameMap>({});

  useEffect(() => {
    fetchAllUsersLdapHandle().then(users => {
      setHandleNameMap(buildHandleNameMap(users));
    });
  }, []);

  return (
    <HandleNameMapContext.Provider value={handleNameMap}>
      {children}
    </HandleNameMapContext.Provider>
  );
};

export const useHandleNameMap = () => useContext(HandleNameMapContext);
