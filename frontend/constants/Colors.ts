/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primaryGold = '#FFD700';
const darkBrown = '#4B2E2F';
const deepBlue = '#002D72';
const mossGreen = '#3B7A57';
const parchmentBeige = '#F5DEB3';

const rubyRed = '#E63946';
const silver = '#C0C0C0';
const brightGreen = '#2ECC71';

export const Colors = {
  bgNav : '#90EE90',
  light: {
    text: darkBrown,
    background: parchmentBeige,
    tint: primaryGold,
    icon: mossGreen,
    tabIconDefault: darkBrown,
    tabIconSelected: primaryGold,
    error: rubyRed,
    success: brightGreen,
    highlight: deepBlue,
  },
  dark: {
    text: silver,
    background: darkBrown,
    tint: primaryGold,
    icon: brightGreen,
    tabIconDefault: silver,
    tabIconSelected: primaryGold,
    error: rubyRed,
    success: brightGreen,
    highlight: deepBlue,
  },
};
