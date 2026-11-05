import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { applyThemeColor, DEFAULT_THEME_COLOR } from "../utils/theme";
import useAuth from "../contexts/useAuth";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: ${DEFAULT_THEME_COLOR};
    --primary-color-accent: ${DEFAULT_THEME_COLOR};
    --primary-color-ink: #ffffff;
    --primary-button-bg: #f3f4f6;
    --primary-button-ink: #111827;
    --primary-color-soft: rgba(255, 255, 255, 0.08);
    --primary-color-border: rgba(255, 255, 255, 0.16);
    --primary-color-glow: rgba(255, 255, 255, 0.08);
  }

  :root[data-custom-theme="true"] {
    --primary-color-soft: color-mix(in srgb, var(--primary-color-accent) 16%, transparent);
    --primary-color-border: color-mix(in srgb, var(--primary-color-accent) 58%, transparent);
    --primary-color-glow: color-mix(in srgb, var(--primary-color-accent) 32%, transparent);
  }

  :root[data-custom-theme="true"] body {
    background:
      radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--primary-color-accent) 8%, transparent), transparent 38%),
      #000000;
  }

  :root[data-custom-theme="true"] main {
    background-image:
      radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary-color-accent) 10%, transparent), transparent 42%),
      linear-gradient(135deg, #06060a 0%, #111827 100%) !important;
  }

  :root[data-custom-theme="true"] button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--primary-color-accent) 28%, #171b25) !important;
    border-color: var(--primary-color-border) !important;
    color: #fff !important;
    box-shadow: 0 0 0 1px var(--primary-color-soft);
  }

  :root[data-custom-theme="true"] button:focus-visible,
  :root[data-custom-theme="true"] input:focus-visible,
  :root[data-custom-theme="true"] textarea:focus-visible,
  :root[data-custom-theme="true"] select:focus-visible {
    outline: 2px solid var(--primary-color-accent) !important;
    outline-offset: 3px;
  }

  :root[data-custom-theme="true"] input:focus,
  :root[data-custom-theme="true"] textarea:focus,
  :root[data-custom-theme="true"] select:focus {
    border-color: var(--primary-color-accent) !important;
    box-shadow: 0 0 0 3px var(--primary-color-soft);
  }

  :root[data-custom-theme="true"] a:hover,
  :root[data-custom-theme="true"] a:focus-visible {
    color: var(--primary-color-accent);
    text-decoration-color: var(--primary-color-accent);
  }

  :root[data-custom-theme="true"] main article:hover,
  :root[data-custom-theme="true"] footer a:hover,
  :root[data-custom-theme="true"] footer a:focus-visible {
    border-color: var(--primary-color-border);
    box-shadow: 0 8px 24px var(--primary-color-soft);
  }

  :root[data-custom-theme="true"] footer svg {
    color: var(--primary-color-accent);
  }

  body {
    margin: 0;
    padding: 0;
    background: #000000;
    min-height: 100vh;
    color: #111;
  }
`;

function GlobalStyles() {
  const { user } = useAuth();

  useEffect(() => {
    const savedColor = window.localStorage.getItem(`wa1paper-primary-color:${user?.id ?? "guest"}`);
    applyThemeColor(savedColor ?? DEFAULT_THEME_COLOR);
  }, [user?.id]);

  return <GlobalStyle />;
}

export default GlobalStyles;
