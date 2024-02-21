import React, { createContext, useState, ReactNode } from 'react';

type TabContextType = {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};

const defaultState = {
  currentTab: 'input',
  setCurrentTab: () => {},
};

const TabContext = createContext<TabContextType>(defaultState);

export default TabContext;