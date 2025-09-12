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
} from '@mui/material';

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
      <div className="w-[340px] h-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-300">

        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#105c8e] text-white">
          <Typography variant="subtitle1" className="font-semibold text-sm">
            Notifications
          </Typography>
          <button
            onClick={onClose}
            className="text-white text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto p-2">
          <List>
            {notifications.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem className="flex items-start space-x-3 py-3 px-2 rounded hover:bg-gray-100 transition-colors">
                  <Avatar className="w-10 h-10 bg-gray-300 text-gray-600 text-xs">
                    {item.avatarText}
                  </Avatar>

                  <div className="flex-1">
                    <Typography className="font-medium text-gray-800 text-sm">
                      {item.message}
                    </Typography>

                    {item.extra && (
                      <div className="flex items-center text-gray-600 text-xs mt-1">
                        {item.extra}
                      </div>
                    )}

                    <Typography className="text-xs text-gray-400 mt-1">
                      {item.time}
                    </Typography>
                  </div>
                </ListItem>

                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 text-center">
          <Button variant="outlined" size="small" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
