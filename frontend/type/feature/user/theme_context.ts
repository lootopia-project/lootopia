export interface ThemeContextType {
    backgroundImage: string | null;
    changeBackground: (newImage: string | null) => void;
    textColor: string;
}
