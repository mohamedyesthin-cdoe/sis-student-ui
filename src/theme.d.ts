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
      highlight: string;
    };
  }
}
