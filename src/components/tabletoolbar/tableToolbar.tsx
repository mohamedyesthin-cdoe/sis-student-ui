import React from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface ActionButton {
  label: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'text' | 'outlined' | 'contained';
  startIcon?: React.ReactNode;
  onClick: () => void;
}

interface TableToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  actions?: ActionButton[];
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  searchText,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  actions = [],
}) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
      {/* Search */}
      <TextField
        size="small"
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ width: { xs: '100%', sm: 280 } }}
      />

      {/* Filters */}
      {filters.map((filter) => (
        <FormControl
          key={filter.key}
          size="small"
          sx={{ minWidth: 150, width: { xs: '100%', sm: 150 } }}
        >
          <Select
            value={filter.value}
            displayEmpty
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      {/* Actions */}
      {actions.map((action, idx) => (
        <Button
          key={idx}
          variant={action.variant || 'contained'}
          color={action.color || 'primary'}
          size="small"
          startIcon={action.startIcon}
          sx={{
            ml: idx === 0 ? { xs: 0, sm: 'auto' } : 0,
            width: { xs: '100%', sm: 'auto' },
          }}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};

export default TableToolbar;
