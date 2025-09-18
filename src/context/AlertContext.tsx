// AlertContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react';
import { Box, Button, Typography, Fade, Backdrop, Modal } from '@mui/material';

interface AlertContextProps {
  showAlert: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => {});
  const [onCancelCallback, setOnCancelCallback] = useState<() => void>(() => {});

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setAlertOpen(true);
  };

  const showConfirm = (msg: string, onConfirm: () => void, onCancel?: () => void) => {
    setConfirmMessage(msg);
    setOnConfirmCallback(() => onConfirm);
    setOnCancelCallback(() => onCancel || (() => {}));
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onConfirmCallback();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    onCancelCallback();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Simple alert box */}
      <Modal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={alertOpen}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fefefe',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              minWidth: 300,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Alert
            </Typography>
            <Typography sx={{ mb: 3 }}>{alertMessage}</Typography>
            <Button variant="contained" color="primary" onClick={() => setAlertOpen(false)}>
              OK
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        open={confirmOpen}
        onClose={handleCancel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={confirmOpen}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
              minWidth: 320,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Are you sure?
            </Typography>
            <Typography sx={{ mb: 3 }}>{confirmMessage}</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                No
              </Button>
              <Button variant="contained" color='secondary' onClick={handleConfirm}>
                Yes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </AlertContext.Provider>
  );
};
