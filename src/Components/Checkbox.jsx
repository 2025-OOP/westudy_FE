// src/Components/Checkbox.js

import styled from "styled-components";

const StyledInput = styled.input`
  appearance: none;
  border: 2px solid #ABABAB;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  position: relative;
  background-color: white;
  cursor: pointer;

  &:checked {
    border: 2px solid #4C4C4C;
    background-color: white;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      background-color: #4C4C4C;
      border-radius: 1px;
    }
  }
`;

export default function Checkbox({ className, checked = false, onChange }) {
  return (
    <StyledInput
      type="checkbox"
      className={className}
      checked={checked}
      onChange={onChange}
    />
  );
}