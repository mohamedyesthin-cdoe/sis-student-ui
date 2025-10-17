import { Card } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

type CardComponentProps = {
  children: ReactNode;
  mb?: number;
  p?: number;
  className?: string;
  sx?: SxProps<Theme>;
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
      elevation={0} // ✅ removes default Paper shadow
      className={className}
      sx={{
        mb,
        p,
        boxShadow: '0px 4.4px 12px -1px rgba(222, 222, 222, 0.3607843137)',
        borderRadius: '5px',
        border: '1px solid #e8e9ebff',
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default CardComponent;
