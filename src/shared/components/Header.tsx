import styled from "styled-components";
import { Link } from "react-router-dom";

export const Header = styled.div`
  flex-direction: row;
`;

export const StyledLink = styled(Link)`
  width: fit-content;
  margin-bottom: 1em;
  margin-right: 1em;
  padding: 0.5em 0.75em;
  border: 1px solid #fff;
  border-radius: 24px;
  font-size: 1.5em;
`;
