import React, { createContext, useState, useContext, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from "@/assets/locales/en.json";
import fr from "@/assets/locales/fr.json";

const i18n = new I18n({
  en,
  fr,
});
i18n.enableFallback = true;
i18n.locale = Localization.locale || 'en';


const contextDefaultValue = {
    locale: i18n.locale,
    changeLanguage: (lang: string) => {},
    i18n,
};


const LanguageContext = createContext(contextDefaultValue);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(i18n.locale);

  const changeLanguage = (lang:string) => {
    setLocale(lang);
    i18n.locale = lang;
    AsyncStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
