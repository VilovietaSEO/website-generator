import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 300px;
  z-index: 9999;
`;

const Toast = styled.div`
  background-color: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FFC107';
      default:
        return '#2196F3';
    }
  }};
  color: white;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const ToastNotification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer>
      <Toast type={type}>
        <span>{message}</span>
        <CloseButton onClick={() => {
          setIsVisible(false);
          onClose();
        }}>
          &times;
        </CloseButton>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;