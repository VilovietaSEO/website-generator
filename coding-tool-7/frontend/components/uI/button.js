import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
  }

  ${props => props.secondary && `
    background-color: ${props.theme.colors.secondary};
    &:hover {
      background-color: ${props.theme.colors.secondaryDark};
    }
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const Button = ({ children, onClick, disabled, secondary, fullWidth, ...props }) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      secondary={secondary}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;