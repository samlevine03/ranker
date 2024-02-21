"use client"

import React, { ReactNode, useState } from 'react';
import TabContext from './TabContext';

type TabProviderProps = {
    children: ReactNode;
};

const TabProvider = ({ children }: TabProviderProps) => {
    const [currentTab, setCurrentTab] = useState<string>('input');

    return (
        <TabContext.Provider value={{ currentTab, setCurrentTab }}>
            {children}
        </TabContext.Provider>
    );
};

export default TabProvider;