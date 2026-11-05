import styled from "styled-components";

export const Field = styled.div`
  position: relative;
  width: 100%;
`;

export const Toggle = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  display: grid;
  place-items: center;
  padding: 6px;
  color: #fff;
  background: transparent;
  border: 0;
  border-radius: 6px;
  transform: translateY(-50%);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;
