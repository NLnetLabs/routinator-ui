import React, { JSX } from 'react';

export interface Message {
  message: string;
  level: 'error' | 'warning' | 'success';
}

export interface NotificationProps {
  notification: Message;
  setNotification: (n: Message | null) => void;
}

export default function Notification({
  notification,
  setNotification,
}: NotificationProps): JSX.Element {
  return (
    <div id="notification" className={notification.level}>
      {notification.message}
      <span className="close" onClick={() => setNotification(null)}>
        &times;
      </span>
    </div>
  );
}
