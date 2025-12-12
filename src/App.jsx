import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './App.module.css';
import { Header } from './components/Header/Header';
import { JsonEditor } from './components/JsonPanel/JsonEditor';
import { Configuration } from './components/JsonPanel/Configuration';
import { CodePreview } from './components/CodePanel/CodePreview';
import { ModelSummary } from './components/CodePanel/ModelSummary';
import { useDebounce } from './hooks/useDebounce';
import { parseAndAnalyzeJson } from './utils/jsonParser';
import { generateCode, LANGUAGES } from './utils/generators';

import { Background } from './components/Background/Background';
import { HeroOverlay } from './components/Effects/HeroOverlay';

function App() {
  const [theme, setTheme] = useState('dark');
  const [jsonInput, setJsonInput] = useState('');
  const [showHero, setShowHero] = useState(true); // Default true
  const [language, setLanguage] = useState(LANGUAGES.JAVA);
  const [config, setConfig] = useState({
    rootClassName: 'Root',
    useLombok: false,
    strictNulls: false,
  });

  // Dismiss hero when user types
  const handleJsonChange = (val) => {
    setJsonInput(val);
    if (val.length > 0 && showHero) {
      setShowHero(false);
    }
  };

  const debouncedJson = useDebounce(jsonInput, 300);

  // Derived state
  const { ir, error, code } = useMemo(() => {
    const { root, error } = parseAndAnalyzeJson(debouncedJson);
    if (error || !root) {
      if (!jsonInput) return { ir: null, error: null, code: '// Paste JSON to start generating...' };
      return { ir: null, error, code: '// Waiting for valid JSON...' };
    }
    const generated = generateCode(language, { root }, { ...config, packageName: 'com.example' });
    return { ir: root, error: null, code: generated };
  }, [debouncedJson, language, config, jsonInput]);

  // Effect for theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  const languages = Object.values(LANGUAGES).map(lang => ({
    id: lang,
    label: lang.charAt(0).toUpperCase() + lang.slice(1)
  }));

  return (
    <div className={styles.app}>
      <Background />
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Hero overlay in center of screen if empty */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeroOverlay visible={showHero && !jsonInput} onDismiss={() => setShowHero(false)} />
      </div>

      <main className={styles.main}>
        {/* Left Panel */}
        <motion.section
          className={styles.panel}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Input & Config</span>
          </div>
          <div className={styles.scrollArea}>
            <JsonEditor
              value={jsonInput}
              onChange={handleJsonChange}
              error={error}
              onFormat={handleFormat}
            />
            <Configuration config={config} onChange={setConfig} />
          </div>
        </motion.section>

        {/* Right Panel */}
        <motion.section
          className={styles.panel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Generated Model</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <CodePreview
              code={code}
              language={language}
              onLanguageChange={setLanguage}
              availableLanguages={languages}
            />
            <ModelSummary ir={ir} />
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default App;
