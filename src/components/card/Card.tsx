import { Card } from '@mui/material';
import type { ReactNode } from 'react';

type CardComponentProps = {
    children: ReactNode;
    mb?: number;
    p?: number;
    className?: string;
};

const CardComponent = ({ children, mb = 3, p = 0, className = '' }: CardComponentProps) => {
    return (
        <Card
            className={`${className}`}
            sx={{
                borderRadius: '1rem',
                mb,
                p,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Add a soft shadow
            }}
        >
            {children}
        </Card>
    );
};

export default CardComponent;
