import styled from "styled-components";

export const Container = styled.header`
    width:100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 18px 48px;
    box-sizing: border-box;
`;

export const TopBar = styled.div`
    position: relative;
    z-index: 2;
    height:64px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    padding:0 24px;

    border-radius:20px;

    background:rgba(255,255,255,.08);

    backdrop-filter:blur(20px);

    border:1px solid rgba(255,255,255,.18);

    box-shadow:
    inset 0 1px rgba(255,255,255,.15),
    0 10px 30px rgba(0,0,0,.4);
`;

export const Logo = styled.h1`
    color:white;
    font-size:30px;
    font-weight:300;
    margin: 0;
`;

export const Menu = styled.div`
display:flex;
align-items:center;
gap:28px;

a{
display:flex;
align-items:center;
gap:8px;

color:white;
text-decoration:none;
font-size:18px;
}

.messages-trigger,
.notification-trigger {
    width: auto;
    height: auto;
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: white;
    font-size: 18px;
    gap: 8px;
}

.messages-trigger:hover,
.messages-trigger[aria-expanded="true"],
.notification-trigger:hover,
.notification-trigger[aria-expanded="true"] {
    background: transparent;
}

.messages-trigger:focus-visible,
.notification-trigger:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.7);
    outline-offset: 4px;
}

> button{

width:48px;
height:48px;

border-radius:50%;

border:none;

background:rgba(255,255,255,.1);

color:white;

font-size:24px;

display:flex;
justify-content:center;
align-items:center;

cursor:pointer;

}

.notification-trigger {
    width: auto;
    height: auto;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    font-size: 18px;
}

.notification-trigger:hover,
.notification-trigger[aria-expanded="true"] {
    background: transparent;
}
`;

export const NotificationAnchor = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    .notification-trigger {
        display: flex;
        align-items: center;
    }
`;

export const UnreadBadge = styled.span`
    display: inline-grid;
    min-width: 17px;
    height: 17px;
    place-items: center;
    margin-left: -5px;
    padding: 0 4px;
    border-radius: 99px;
    background: #ed3943;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
`;

export const SearchArea = styled.div`

position: relative;
z-index: 1;

margin-top:20px;

padding:14px;

border-radius:35px;

backdrop-filter:blur(20px);

border:1px solid rgba(255,255,255,.18);

`;

export const SearchBox = styled.div`

height:56px;

display:flex;
align-items:center;

padding:0 18px;

border-radius:20px;

background:rgba(0,0,0,.25);

input{

flex:1;

background:none;

border:none;

outline:none;

font-size:20px;

color:white;

}

svg{

font-size:24px;

color:white;

}

`;

export const Categories = styled.div`

display:flex;

gap:10px;

margin-top:14px;

overflow-x:auto;

padding-bottom:5px;

::-webkit-scrollbar{

display:none;

}

`;

export const Category = styled.button`

padding:8px 16px;

background:rgba(255,255,255,.08);

border:1px solid rgba(255,255,255,.2);

border-radius:12px;

color:white;

font-size:16px;

cursor:pointer;

transition:.3s;

&:hover{

background:rgba(255,255,255,.18);

}

`;
