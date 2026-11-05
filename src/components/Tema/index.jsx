import { useEffect, useState } from "react";
import { Check, ChevronDown, Crown, Lock, X } from "lucide-react";
import { applyThemeColor, DEFAULT_THEME_COLOR } from "../../utils/theme";
import useAuth from "../../contexts/useAuth";
import {
  Category,
  CategoryToggle,
  ColorGrid,
  ColorName,
  ColorOption,
  Header,
  Notice,
  NormalOption,
  Overlay,
  Panel,
  UpgradeButton,
} from "./styles";

const colorGroups = [
  {
    name: "Tons Escuros",
    colors: [
      { name: "Cyberpunk Purple", value: "#12092b" },
      { name: "Deep Midnight", value: "#0a0f1d" },
      { name: "Onyx Black", value: "#0f0f11" },
      { name: "Gothic Crimson", value: "#1b0b0e" },
      { name: "Emerald Night", value: "#071a12" },
      { name: "Deep Obsidian", value: "#16161a" },
      { name: "Abyssal Blue", value: "#050d1a" },
      { name: "Azul Espacial", value: "#142850" },
      { name: "Roxo Nebulosa", value: "#4b1d75" },
      { name: "Preto Galáctico", value: "#101018" },
      { name: "Violeta Estelar", value: "#7137a8" },
      { name: "Azul Nebulosa", value: "#253b80" },
      { name: "Púrpura Cósmico", value: "#652d90" },
      { name: "Índigo Estelar", value: "#303f78" },
    ],
  },
  {
    name: "Tons Neons e Cyberpunk",
    colors: [
      { name: "Neon Cyan", value: "#00f0ff" },
      { name: "Toxic Green", value: "#00ff66" },
      { name: "Electric Violet", value: "#8b00ff" },
      { name: "Hot Pink", value: "#ff007f" },
      { name: "Amber Gold", value: "#ffaa00" },
      { name: "Sunset Orange", value: "#ff5500" },
      { name: "Laser Magenta", value: "#ff00cc" },
      { name: "Roxo Neon", value: "#8b2cff" },
      { name: "Azul Elétrico", value: "#1769ff" },
      { name: "Magenta", value: "#f000b8" },
      { name: "Ciano", value: "#00d9e8" },
      { name: "Violeta Digital", value: "#5e17eb" },
      { name: "Rosa Neon", value: "#ff3cac" },
      { name: "Azul Laser", value: "#00a6ff" },
    ],
  },
  {
    name: "Tons Suaves / Pastéis",
    colors: [
      { name: "Soft Lavender", value: "#b8a7ea" },
      { name: "Mint Pastel", value: "#a3e4d7" },
      { name: "Sky Pastel", value: "#aed6f1" },
      { name: "Rose Quartz", value: "#f5b7b1" },
      { name: "Peach Cream", value: "#fbeee6" },
      { name: "Sand Gold", value: "#e5c07b" },
    ],
  },
  {
    name: "Tons Terrosos",
    colors: [
      { name: "Terracota", value: "#b85c38" },
      { name: "Cobre", value: "#9b542f" },
      { name: "Caramelo", value: "#a66a3f" },
      { name: "Chocolate", value: "#573b32" },
      { name: "Café", value: "#3d2b24" },
      { name: "Oliva", value: "#596342" },
      { name: "Musgo", value: "#344b3b" },
    ],
  },
  {
    name: "Tons Oceânicos",
    colors: [
      { name: "Azul Atlântico", value: "#174a6e" },
      { name: "Azul Petróleo", value: "#155e63" },
      { name: "Turquesa Profundo", value: "#087e83" },
      { name: "Marinho", value: "#172b4d" },
      { name: "Safira", value: "#2447a8" },
      { name: "Aqua", value: "#168aad" },
      { name: "Verde Lago", value: "#2d6a5a" },
      { name: "Azul Glacial", value: "#397ca8" },
      { name: "Ciano Frio", value: "#26a6b5" },
      { name: "Verde-azulado", value: "#267d78" },
      { name: "Roxo Frio", value: "#65558f" },
      { name: "Azul Gelo", value: "#6aaac2" },
      { name: "Turquesa Frio", value: "#309a9b" },
      { name: "Índigo Frio", value: "#485e9b" },
    ],
  },
  {
    name: "Tons Florais",
    colors: [
      { name: "Rosa Antigo", value: "#a64d79" },
      { name: "Malva", value: "#754668" },
      { name: "Ameixa", value: "#603f83" },
      { name: "Orquídea", value: "#9256a8" },
      { name: "Vinho", value: "#762f45" },
      { name: "Lavanda", value: "#7664a8" },
      { name: "Framboesa", value: "#a8325a" },
    ],
  },
  {
    name: "Tons Quentes",
    colors: [
      { name: "Vermelho Rubi", value: "#c1123f" },
      { name: "Laranja Fogo", value: "#f06424" },
      { name: "Amarelo Solar", value: "#e9ad24" },
      { name: "Coral", value: "#f47768" },
      { name: "Vermelho Tomate", value: "#df3b32" },
      { name: "Âmbar", value: "#d98218" },
      { name: "Pêssego Quente", value: "#e99b78" },
    ],
  },
];

const allColors = colorGroups.flatMap((group) => group.colors);

function getSavedThemeColor(themeKey) {
  const savedColor = window.localStorage.getItem(themeKey);
  return allColors.find((color) => color.value === savedColor)?.value ?? DEFAULT_THEME_COLOR;
}

export default function Tema({ isVip = false, onClose, onUpgrade }) {
  const { user } = useAuth();
  const themeKey = `wa1paper-primary-color:${user?.id ?? "guest"}`;
  const [savedTheme, setSavedTheme] = useState(() => ({
    key: themeKey,
    color: getSavedThemeColor(themeKey),
  }));
  const selectedColor = savedTheme.key === themeKey
    ? savedTheme.color
    : getSavedThemeColor(themeKey);
  const [expandedGroup, setExpandedGroup] = useState(null);

  useEffect(() => {
    applyThemeColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSelectColor(color) {
    if (!isVip) return;

    applyThemeColor(color.value);
    window.localStorage.setItem(themeKey, color.value);
    setSavedTheme({ key: themeKey, color: color.value });
  }

  function handleSelectNormal() {
    applyThemeColor(DEFAULT_THEME_COLOR);
    window.localStorage.removeItem(themeKey);
    setSavedTheme({ key: themeKey, color: DEFAULT_THEME_COLOR });
  }

  return (
    <Overlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Panel role="dialog" aria-modal="true" aria-labelledby="theme-picker-title">
        <Header>
          <div>
            <p>PERSONALIZAÇÃO VIP</p>
            <h2 id="theme-picker-title">Personalizar tema</h2>
          </div>
          <button type="button" aria-label="Fechar seletor de tema" onClick={onClose}>
            <X size={21} />
          </button>
        </Header>

        {!isVip && (
          <Notice role="status">
            <Lock size={19} aria-hidden="true" />
            <div>
              <strong>Recurso exclusivo VIP</strong>
              <p>Assine o plano VIP para desbloquear as {allColors.length} cores de tema.</p>
            </div>
            <UpgradeButton type="button" onClick={onUpgrade}>
              <Crown size={16} aria-hidden="true" />
              Ver planos
            </UpgradeButton>
          </Notice>
        )}

        <Category>
          <h3>Tema padrão</h3>
          <NormalOption
            type="button"
            aria-pressed={selectedColor === DEFAULT_THEME_COLOR}
            $selected={selectedColor === DEFAULT_THEME_COLOR}
            onClick={handleSelectNormal}
          >
            <span aria-hidden="true" />
            <div>
              <strong>Normal</strong>
              <small>Restaurar as cores originais do site</small>
            </div>
            {selectedColor === DEFAULT_THEME_COLOR && <Check size={18} aria-hidden="true" />}
          </NormalOption>
        </Category>

        {colorGroups.map((group, index) => {
          const isExpanded = expandedGroup === group.name;
          const colorsId = `theme-colors-${index}`;

          return (
            <Category key={group.name}>
              <CategoryToggle
                type="button"
                aria-expanded={isExpanded}
                $expanded={isExpanded}
                aria-controls={colorsId}
                onClick={() => setExpandedGroup(isExpanded ? null : group.name)}
              >
                <span>{group.name}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </CategoryToggle>
              <ColorGrid id={colorsId} hidden={!isExpanded}>
                {group.colors.map((color) => {
                  const isSelected = selectedColor === color.value;
                  return (
                    <ColorOption
                      key={color.value}
                      type="button"
                      aria-label={`${color.name}${isVip ? "" : ", exclusivo VIP"}`}
                      aria-pressed={isSelected}
                      aria-disabled={!isVip}
                      title={isVip ? color.name : `${color.name} — exclusivo VIP`}
                      $color={color.value}
                      $selected={isSelected}
                      $locked={!isVip}
                      onClick={() => handleSelectColor(color)}
                    >
                      {isSelected && <Check size={17} aria-hidden="true" />}
                      <ColorName>{color.name}</ColorName>
                    </ColorOption>
                  );
                })}
              </ColorGrid>
            </Category>
          );
        })}
      </Panel>
    </Overlay>
  );
}