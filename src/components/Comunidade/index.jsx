import { useEffect, useState } from "react";
import {
  FaDiscord,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";

import {
  Container,
  Content,
  Intro,
  Eyebrow,
  Title,
  Description,
  CommunityGrid,
  CommunityLink,
  IconBox,
  CommunityName,
  CommunityDescription,
  Arrow,
  PublicFoldersSection,
  PublicFoldersHeading,
  PublicFoldersEyebrow,
  PublicFoldersTitle,
  PublicFoldersDescription,
  PublicFoldersMessage,
  PublicFoldersGrid,
  PublicFolderCard,
  PublicFolderCover,
  PublicFolderCoverFallback,
  PublicFolderDetails,
  PublicFolderName,
  PublicFolderCreator,
  PublicFolderThumbs,
  PublicFolderThumb,
  PublicFolderCount,
} from "./styles";
import useAuth from "../../contexts/useAuth";
import { apiRequest, isProtectedWallpaperImage } from "../../services/api";

const communities = [
  {
    name: "Discord",
    description: "Converse, compartilhe ideias e crie junto.",
    href: "https://discord.com/",
    Icon: FaDiscord,
    color: "#7289da",
  },
  {
    name: "Instagram",
    description: "Acompanhe novidades e inspirações da comunidade.",
    href: "https://www.instagram.com/",
    Icon: FaInstagram,
    color: "#e6683c",
  },
  {
    name: "TikTok",
    description: "Veja conteúdos rápidos e descubra novas criações.",
    href: "https://www.tiktok.com/",
    Icon: FaTiktok,
    color: "#25f4ee",
  },
  {
    name: "Twitter",
    description: "Fique por dentro das conversas e atualizações.",
    href: "https://x.com/",
    Icon: FaTwitter,
    color: "#1d9bf0",
  },
];

export default function Comunidade() {
  const { user } = useAuth();
  const [publicFolders, setPublicFolders] = useState([]);
  const [foldersError, setFoldersError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/folders?visibility=public")
      .then((data) => {
        if (active) {
          setPublicFolders(data.folders);
          setFoldersError("");
        }
      })
      .catch((error) => {
        if (active) setFoldersError(error.message || "Não foi possível carregar as pastas públicas.");
      });
    return () => { active = false; };
  }, [user?.id]);

  return (
    <Container>
      <Content>
        <Intro>
          <Eyebrow>WA1PAPER · COMUNIDADE</Eyebrow>
          <Title>Nos encontramos por aqui.</Title>
          <Description>
            Um espaço para trocar referências, compartilhar criações e ficar
            perto de quem também gosta de imaginar.
          </Description>
        </Intro>

        <CommunityGrid aria-label="Nossas redes sociais">
          {communities.map(({ name, description, href, Icon, color }) => (
            <CommunityLink
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              $accent={color}
            >
              <IconBox $accent={color}>
                <Icon aria-hidden="true" />
              </IconBox>
              <CommunityName>{name}</CommunityName>
              <CommunityDescription>{description}</CommunityDescription>
              <Arrow aria-hidden="true">↗</Arrow>
            </CommunityLink>
          ))}
        </CommunityGrid>

        <PublicFoldersSection>
          <PublicFoldersHeading>
            <div>
              <PublicFoldersEyebrow>CRIADAS PELA COMUNIDADE</PublicFoldersEyebrow>
              <PublicFoldersTitle>Pastas públicas</PublicFoldersTitle>
            </div>
            <PublicFoldersDescription>
              Pastas públicas compartilhadas pelos usuários do WA1PAPER.
            </PublicFoldersDescription>
          </PublicFoldersHeading>
          {foldersError ? (
            <PublicFoldersMessage role="alert">{foldersError}</PublicFoldersMessage>
          ) : publicFolders.length === 0 ? (
            <PublicFoldersMessage>Nenhuma pasta pública por enquanto.</PublicFoldersMessage>
          ) : (
            <PublicFoldersGrid>
              {publicFolders.map((folder) => {
                const items = folder.items;
                const cover = folder.coverImage || items[0]?.image;
                return (
                  <PublicFolderCard key={folder.id}>
                    {cover ? (
                      <PublicFolderCover
                        src={cover}
                        alt={`Capa da pasta ${folder.name}`}
                        crossOrigin={isProtectedWallpaperImage(cover) ? "use-credentials" : undefined}
                      />
                    ) : (
                      <PublicFolderCoverFallback aria-hidden="true">W</PublicFolderCoverFallback>
                    )}
                    <PublicFolderDetails>
                      <PublicFolderName>{folder.name}</PublicFolderName>
                      <PublicFolderCreator>
                        {folder.creator_name ? `Por ${folder.creator_name}` : "Criada pela comunidade"}
                      </PublicFolderCreator>
                      <PublicFolderThumbs>
                        {items.slice(0, 4).map((item) => (
                          <PublicFolderThumb
                            key={item.id}
                            src={item.image}
                            alt={item.title || "Wallpaper"}
                            crossOrigin={isProtectedWallpaperImage(item.image) ? "use-credentials" : undefined}
                          />
                        ))}
                        <PublicFolderCount>{items.length} wallpapers</PublicFolderCount>
                      </PublicFolderThumbs>
                    </PublicFolderDetails>
                  </PublicFolderCard>
                );
              })}
            </PublicFoldersGrid>
          )}
        </PublicFoldersSection>
      </Content>
    </Container>
  );
}