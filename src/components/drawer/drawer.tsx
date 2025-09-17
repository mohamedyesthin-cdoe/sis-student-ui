// NotificationsDrawer.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  Typography,
  Divider,
  Button,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function NotificationsDrawer({ open, onClose }) {
  const notifications = [
    {
      avatarText: 'AB',
      message: 'Ashwin Bose is requesting access to Design File - Final...',
      extra: '📁 Design brief and... 2.2 MB',
      time: '2 mins ago',
    },
    {
      avatarText: 'P',
      message: 'Patrick added a comment on Design Assets - Smart Tags file:',
      extra: '',
      time: '5 mins ago',
    },
    {
      avatarText: 'PR',
      message: 'New version of Project Roadmap is uploaded.',
      extra: '',
      time: '10 mins ago',
    },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="w-[340px] h-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-300">

        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pl={2}
          py={1}
          bgcolor="secondary.main"
          color="white"
        >
          <Typography variant="subtitle1" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
            Notifications
          </Typography>

          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <Box className="flex-1 overflow-auto p-2">
          <List>
            {notifications.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem className="flex items-start space-x-3 py-3 px-2 rounded hover:bg-gray-100 transition-colors">
                  <Avatar className="w-10 h-10 bg-gray-300 text-gray-600 text-xs">
                    {item.avatarText}
                  </Avatar>

                  <Box className="flex-1">
                    <Typography className="font-medium text-gray-800 text-sm">
                      {item.message}
                    </Typography>

                    {item.extra && (
                      <Box className="flex items-center text-gray-600 text-xs mt-1">
                        {item.extra}
                      </Box>
                    )}

                    <Typography className="text-xs text-gray-400 mt-1">
                      {item.time}
                    </Typography>
                  </Box>
                </ListItem>

                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box className="p-4 border-t border-gray-300 text-center">
          <Button variant="outlined" size="small" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
