import styled from "styled-components";
 


export const BannerContainer = styled.section`

  width: min(1250px, 95%);

  min-height: 365px;

  margin: 40px auto;

  background:

    radial-gradient(circle at left, color-mix(in srgb, var(--primary-color-accent) 18%, transparent), transparent 30%),

    #050505;

  display: grid;

  grid-template-columns: 280px 180px 220px 1fr;

  gap: 25px;

  align-items: center;

  padding: 35px;

  border-radius: 19px;

  border: 1px solid rgba(255,255,255,.08);

  box-shadow: 0 0 40px color-mix(in srgb, var(--primary-color-accent) 18%, transparent);



  @media(max-width:1100px){

    height: auto;

    grid-template-columns: 1fr;

  }

`;



export const Left = styled.div`

  display: flex;

  flex-direction: column;

  justify-content: center;

`;



export const Vip = styled.div`

  width: max-content;

  padding: 8px 18px;

  border: 2px solid var(--primary-color-accent);

  border-radius: 30px;

  color: #fff;

  font-size: 15px;

  font-weight: 700;

  margin-bottom: 30px;

  text-transform: uppercase;

`;



export const Title = styled.h1`

  margin: 0;

  color: white;

  font-size: 45px;

  line-height: 1.1;

  font-weight: 600;

`;



export const TitleRed = styled.span`
  color: #fff;
  text-shadow: 0 0 18px color-mix(in srgb, var(--primary-color-accent) 75%, transparent);

`;



export const Description = styled.p`

  margin-top: 25px;

  color: #cfcfcf;

  font-size: 16px;

  line-height: 1.5;

  max-width: 260px;



  strong {

    color: #fff;
    text-shadow: 0 0 12px color-mix(in srgb, var(--primary-color-accent) 65%, transparent);

  }

`;



export const Benefits = styled.div`

  min-height: 310px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 22px;

  border: 3px solid var(--primary-color-accent);
  border-top-right-radius: 22px;
  border-bottom-left-radius: 22px;
  padding: 40px 20px;
  box-sizing: border-box;

`;



export const Benefit = styled.div`

  display: flex;

  align-items: center;

  gap: 15px;



  img {

    width: 55px;

    height: 55px;

    object-fit: contain;

  }



  span {

    color: white;

    font-size: 14px;

    font-weight: 700;

    line-height: 1.2;

  }

`;



export const Buttons = styled.div`

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 15px;

`;



export const ActionButton = styled.button`

  width: 210px;

  height: 65px;

  border: none;

  border-radius: 12px;

  background: ${props =>

    props.$primary

    ? "var(--primary-color-accent)"

    : "rgba(255, 255, 255, 0.12)"
  };

  color: ${props => (props.$primary ? "var(--primary-color-ink)" : "#fff")};

  border: ${props =>
    props.$primary ? "none" : "1px solid rgba(255, 255, 255, 0.22)"};

  font-size: 25px;

  font-weight: 500;

  cursor: pointer;

  box-shadow: ${props =>

    props.$primary

    ? "0 0 25px color-mix(in srgb, var(--primary-color-accent) 45%, transparent)"

    : "none"

  };

  transition: .3s;



  &:hover {

    transform: translateY(-3px);
    background: ${props =>
      props.$primary
        ? "color-mix(in srgb, var(--primary-color-accent) 88%, #fff)"
        : "rgba(255, 255, 255, 0.2)"};

  }

`;



export const ImageArea = styled.div`

  width: 100%;

  height: 380px;

  border-radius: 22px;
   border-bottom-left-radius: 0px;
  overflow: hidden;

  border: 3px solid var(--primary-color-accent);

  box-shadow: 0 0 30px color-mix(in srgb, var(--primary-color-accent) 40%, transparent);



  img {

    width: 100%;

    height: 100%;

    object-fit: cover;

  }

`; 
