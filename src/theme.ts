export interface Theme {
  darkAccent: string;
  mainBackground: string;
  lightAccent: string;
  primaryButton: string;
  white: string;
  black: string;
  gray: string;
  errorRed: string;
  warning: string;
}

export type ColorThemeProps = {
  theme: Theme;
};

export const defaultTheme: Theme = {
  darkAccent: '#17191E',
  mainBackground: '#010101',
  lightAccent: '#64ffda',
  primaryButton: '#304ffe',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CBCBCB',
  errorRed: '#FF4646',
  warning: '#F79009',
};
