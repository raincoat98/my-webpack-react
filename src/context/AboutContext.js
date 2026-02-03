import React, { createContext } from 'react';

export const AboutContext = createContext();

export function AboutProvider({ children }) {
  const aboutData = {
    features: [
      'React 16',
      'Webpack 5',
      'Babel 7',
      'Ant Design 3.x',
      'React Router v5',
      'Zustand',
      'styled-components',
    ],
    description: {
      title: 'About This Project',
      subtitle: 'Modern React Development Stack',
    },
    features_list: [
      'Webpack bundler with dev server',
      'Babel transpiler for modern JavaScript',
      'React Router for client-side routing',
      'Ant Design 3.x UI components',
      'Zustand for state management',
      'Styled Components for CSS-in-JS',
    ],
  };

  return (
    <AboutContext.Provider value={aboutData}>
      {children}
    </AboutContext.Provider>
  );
}
