import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  ${({ error }) => error && `
    border-color: ${({ theme }) => theme.colors.error};
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.errorLight};
    }
  `}

  ${({ disabled }) => disabled && `
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.label};
`;

const ErrorMessage = styled.span`
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

const Input = ({ label, error, ...props }) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;