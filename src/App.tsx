/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { Toast } from './components/Toast';

// Screens
import { Splash } from './screens/Splash';
import { Welcome } from './screens/Welcome';
import { Auth } from './screens/Auth';
import { Onboarding } from './screens/Onboarding';
import { Discover } from './screens/Discover';
import { ProfileView } from './screens/ProfileView';
import { Network } from './screens/Network';
import { Messages } from './screens/Messages';
import { Chat } from './screens/Chat';
import { MyProfile } from './screens/MyProfile';
import { EditProfile } from './screens/EditProfile';
import { Settings } from './screens/Settings';

const ScreenRenderer: React.FC = () => {
  const {
    currentScreen,
    theme,
    deviceType,
    setDeviceType,
    toggleTheme,
    resetDemo,
    toast,
    hideToast,
  } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash key="splash" />;
      case 'welcome':
        return <Welcome key="welcome" />;
      case 'auth':
        return <Auth key="auth" />;
      case 'onboarding':
        return <Onboarding key="onboarding" />;
      case 'discover':
        return <Discover key="discover" />;
      case 'profile-view':
        return <ProfileView key="profile-view" />;
      case 'network':
        return <Network key="network" />;
      case 'messages':
        return <Messages key="messages" />;
      case 'chat':
        return <Chat key="chat" />;
      case 'my-profile':
        return <MyProfile key="my-profile" />;
      case 'edit-profile':
        return <EditProfile key="edit-profile" />;
      case 'settings':
        return <Settings key="settings" />;
      default:
        return <Discover key="default-discover" />;
    }
  };

  return (
    <DeviceFrame
      deviceType={deviceType}
      onChangeDeviceType={setDeviceType}
      onResetDemo={resetDemo}
      isDarkTheme={theme === 'dark'}
      onToggleTheme={toggleTheme}
    >
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Screen Container with AnimatePresence */}
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full h-full flex flex-col"
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ScreenRenderer />
    </AppProvider>
  );
}
