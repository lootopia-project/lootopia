import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';

import en from '@/assets/locales/en.json';
import fr from '@/assets/locales/fr.json';

const lang = new I18n();

lang.translations = { en, fr };
lang.enableFallback = true;
lang.locale = Localization.locale || 'en';

export default lang;
