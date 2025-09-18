import { Card } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material'; // 👈 type-only import

type CardComponentProps = {
  children: ReactNode;
  mb?: number;
  p?: number;
  className?: string;
  sx?: SxProps<Theme>; // ✅ custom sx support
};

const CardComponent = ({
  children,
  mb = 3,
  p = 0,
  className = '',
  sx = {},
}: CardComponentProps) => {
  return (
    <Card
      className={className}
      sx={{
        borderRadius: '1rem',
        mb,
        p,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        ...sx, // merge user styles
      }}
    >
      {children}
    </Card>
  );
};

export default CardComponent;
