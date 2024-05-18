import React from 'react';
import ReactDOM from 'react-dom';
import { Button, notification, Space } from 'antd';

const ComponentDemo = (props) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: 'Notification Title',
      description: description,
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={() => openNotificationWithIcon('success', props.success)}>Success</Button>
        <Button onClick={() => openNotificationWithIcon('info', props.info)}>Info</Button>
        <Button onClick={() => openNotificationWithIcon('warning', props.warning)}>Warning</Button>
        <Button onClick={() => openNotificationWithIcon('error', props.error)}>Error</Button>
      </Space>
    </>
  );
};

export default ComponentDemo
