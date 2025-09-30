import '@mui/material/styles';
import '@mui/x-date-pickers/themeAugmentation';
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      accent: string;
      highlight: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      accent?: string;
      highlight?: string;
    };
  }

  // If you want, you can also add global typography or other component types here
  // interface TypographyVariants { ... }
  // interface Components { ... } 
}
