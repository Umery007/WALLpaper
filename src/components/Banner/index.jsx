import paperjpeg from "../../assets/img-cards/paper.jpeg";
import { useNavigate } from "react-router-dom";

import {

  BannerContainer,

  Left,

  Vip,

  Title,

  TitleRed,

  Description,

  Benefits,

  Benefit,

  Buttons,

  ActionButton,

  ImageArea,

} from "./styles";



import icon1 from "../../assets/icons/icon 1.png";

import icon2 from "../../assets/icons/ICON2.png";

import icon3 from "../../assets/icons/ICON3.png";

import group339 from "../../assets/icons/Group 339.png";



export default function Banner() {
  const navigate = useNavigate();

  return (

    <BannerContainer>

      {/* Coluna 1 */}

      <Left>

        <Vip>🏆 VIP</Vip>

        <Title>

          Sua criatividade

          <br />

          <TitleRed>não tem limite.</TitleRed>

        </Title>

        <Description>

          Crie quantos wallpapers quiser com{" "}

          <strong>créditos infinitos</strong> todos os dias.

        </Description>

      </Left>



      {/* Coluna 2 */}

      <Benefits>

        <Benefit>

          <img src={icon1} alt="Qualidade" />

          <span>

            Qualidade

            <br />

            Máxima

          </span>

        </Benefit>



        <Benefit>

          <img src={icon2} alt="Geração Rápida" />

          <span>

            Geração

            <br />

            Rápida

          </span>

        </Benefit>



        <Benefit>

          <img src={icon3} alt="Créditos Infinitos" />

          <span>

            Créditos

            <br />

            Infinitos

          </span>

        </Benefit>



        <Benefit>

          <img src={group339} alt="Downloads Ilimitados" />

          <span>

            Downloads

            <br />

            Ilimitados

          </span>

        </Benefit>

      </Benefits>



      {/* Coluna 3 - Sem a div por fora! */}

      <Buttons>

        <ActionButton type="button" $primary onClick={() => navigate("/planos")}>
          🏆 Seja VIP
        </ActionButton>
        <ActionButton type="button" onClick={() => navigate("/planos")}>
          Saiba Mais
        </ActionButton>

        <p style={{ color: "#ddd", textAlign: "center", margin: 0, fontSize: "12px" }}>

          Desbloqueie o poder completo da IA

        </p>

      </Buttons>



      {/* Coluna 4 */}

      <ImageArea>

        <img src={paperjpeg} alt="Banner" />

      </ImageArea>

    </BannerContainer>

  );}