import { useState, useEffect } from "react";
import { translations, Language, Translations } from "./translations";

export const useTranslation = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("1boost_language");
    if (saved === "pt-BR" || saved === "en") return saved;
    const browserLang = navigator.language;
    if (browserLang.startsWith("pt")) return "pt-BR";
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("1boost_language", lang);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("1boost_language");
      if (saved === "pt-BR" || saved === "en") {
        setLanguageState(saved);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return {
    language,
    setLanguage,
    t,
  };
};
