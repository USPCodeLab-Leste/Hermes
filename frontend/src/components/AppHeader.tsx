export default function AppHeader() {
  const background = {
      borderRadius: "0 0 16px 16px",
      background: "#3A1F1A",
      display: "flex",
      width: "100%",
      padding: "28px 16px",
      flexDirection: "row",
      justifyContent   : "space-between",
      alignItems: "center",
      gap: "1%"
    };
    const tituloEfoto={
gap: "1%",
      display: "flex",

      justifyContent   : "flex-start",
      alignItems: "center",
       flexDirection: "row"
    };
    const titulo ={
      
      display: "flex",

      alignItems: "center",
      flexDirection: "column"
    };
    
    const HermesNa ={
color: "#F4F3F8",

/* Headline/H6 */
fontFamily: "Montserrat",
fontSize: "120%",
fontStyle: "normal",
fontWeight: "700",
lineHeight: "120%" /* 120% */
    };
    const campus ={

color: "#F4F3F8",

      height: "20%  ",
    alignSelf: "stretch"
    };
    const userPic = {
      maxWidth : "120px",
      width: "30%",
      maxHeight : "120px",
      height: "30%",
      borderRadius: "50% 50% 50% 50%",
      
      fill: "var(--Amarelo-01, #D69F17)"
      
    };
    const icone={
      width:"10%", height:"10%", maxHeight:"50px", maxWidth: "50px"
    }
  return (
    <header className="p-0">
      <div style={background}>
      <div style={tituloEfoto}>
      <img src="https://placehold.co/400x400" style={userPic}></img> 
        <div style={titulo}>
        <h2 style={HermesNa}>Hermes na</h2>

        <h3 style={campus}> EACH</h3>
        </div>
      </div>
<div style={icone}>
      <svg width = "100%" height = "100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 25.5V27C13.5 28.1935 13.9741 29.3381 14.818 30.182C15.6619 31.0259 16.8065 31.5 18 31.5C19.1935 31.5 20.3381 31.0259 21.182 30.182C22.0259 29.3381 22.5 28.1935 22.5 27V25.5M15 7.5C15 6.70435 15.3161 5.94129 15.8787 5.37868C16.4413 4.81607 17.2044 4.5 18 4.5C18.7956 4.5 19.5587 4.81607 20.1213 5.37868C20.6839 5.94129 21 6.70435 21 7.5C22.7226 8.31454 24.1911 9.58249 25.2481 11.1679C26.305 12.7534 26.9107 14.5966 27 16.5V21C27.1129 21.9326 27.4432 22.8256 27.9642 23.6072C28.4853 24.3888 29.1826 25.0371 30 25.5H6C6.81741 25.0371 7.51471 24.3888 8.03578 23.6072C8.55685 22.8256 8.88712 21.9326 9 21V16.5C9.08934 14.5966 9.69495 12.7534 10.7519 11.1679C11.8089 9.58249 13.2774 8.31454 15 7.5Z" stroke="#F4F3F8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
      </div>

    </header>
  )
}