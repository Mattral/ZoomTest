import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, List, Typography } from 'antd';
import { useState, useContext, useMemo } from 'react';
import ZoomVideo from '@zoom/videosdk';
import ZoomContext from '../../../context/zoom-context';
import './report-btn.scss';

const trackingId = Object.fromEntries(new URLSearchParams(location.search))?.customerJoinId;
const { Item: ListItem } = List;

const ReportBtn = () => {
  const [messageApi, msgContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const zmClient = useContext(ZoomContext);

  const infoList = useMemo(() => {
    const data = [
      {
        label: 'Video SDK version',
        value: ZoomVideo.VERSION
      },
      {
        label: 'JsMedia version',
        value: (window as any).JsMediaSDK_Instance?.version
      },
      {
        label: 'SharedArrayBuffer',
        value: `${window.crossOriginIsolated}`
      },
      {
        label: 'Session ID',
        value: zmClient.getSessionInfo().sessionId
      },
      {
        label: 'Telemetry tracking ID',
        value: trackingId ? window.atob(trackingId) : 'N/A'
      }
    ];
    return (
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <ListItem>
            <Typography.Title level={5} className="list-label">{item.label}:</Typography.Title>
            <Typography.Text className="list-value">{item.value}</Typography.Text>
          </ListItem>
        )}
      />
    );
  }, [zmClient]);

  const onInfoClick = async () => {
    modal.info({
      title: 'Session Information',
      content: infoList,
      okText: 'Report Log',
      onOk: async () => {
        await zmClient.getLoggerClient().reportToGlobalTracing();
        messageApi.success('Successfully reported the log.');
      },
      closable: true,
      icon: null,
      width: 550
    });
  };

  return (
    <>
      {msgContextHolder}
      {modalContextHolder}
      <div className="report-btn-container">
        <Button
          type="primary"
          shape="circle"
          icon={<InfoCircleOutlined />}
          size="large"
          onClick={onInfoClick}
          className="info-button"
        />
      </div>
    </>
  );
};

export default ReportBtn;
