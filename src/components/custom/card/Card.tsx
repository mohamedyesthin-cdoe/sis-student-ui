import { Card } from '@mui/material';
import type { ReactNode } from 'react';

type CardComponentProps = {
    children: ReactNode;
    mb?: number;
    p?: number;
    className?: string; // Optional prop to allow extra classes
};

const CardComponent = ({ children, mb = 3, p = 0, className = '' }: CardComponentProps) => {
    return (
        <Card
            className={`${className}`}
            sx={{ borderRadius: '1rem', mb, p }}
        >
            {children}
        </Card>
    );
};

export default CardComponent;
