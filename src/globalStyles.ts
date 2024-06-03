import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        background: #144fcc;
        font-family: Graphik, sans-serif;
        color: #fff;
        padding: 1em;
    }

    div {
        display: flex;
        flex-direction: column;
    }

    a {
        color: #fff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default GlobalStyle;
