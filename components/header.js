const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Chivo+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Chivo Mono', monospace;
}
.wrapper{
  background: #121212;
  position: fixed;
  width: 100%;
}
.wrapper nav{
  position: relative;
  display: flex;
  max-width: calc(100% - 200px);
  margin: 0 auto;
  height: 75px;
  align-items: center;
  justify-content: space-between;
}
nav .content{
  display: flex;
  align-items: center;
}
nav .content .links{
  margin-left: 380px;
  display: flex;
}
.content .logo a{
  color: #e7e7e7;
  font-size: 30px;
  font-weight: 600;
}
.content .links li{
  list-style: none;
  line-height: 70px;
}
.content .links li a,
.content .links li label{
  color: #e7e7e7;
  font-size: 18px;
  font-weight: 500;
  padding: 9px 17px;
  border-radius: 5px;
  transition: all 0.3s ease;
}
.content .links li label{
  display: none;
}
.content .links li a:hover,
.content .links li label:hover{
  background: #323c4e;
}
.content .links li .active{
  color: #03fc7f:;
}
.wrapper .search-icon,
.wrapper .menu-icon{
  color: #5eff8f;
  font-size: 18px;
  cursor: pointer;
  line-height: 70px;
  width: 70px;
  text-align: center;
}
.wrapper .menu-icon{
  display: none;
}
.wrapper #show-search:checked ~ .search-icon i::before{
  content: "\f00d";
}

.wrapper .search-box{
  position: absolute;
  height: 100%;
  max-width: calc(100% - 50px);
  width: 100%;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}
.wrapper #show-search:checked ~ .search-box{
  opacity: 1;
  pointer-events: auto;
}
.search-box input{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 17px;
  color: #e7e7e7;
  background: #222;
  padding: 0 100px 0 15px;
}
.search-box input::placeholder{
  color: #f2f2f2;
}
.search-box .go-icon{
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  line-height: 60px;
  width: 70px;
  height: 100%;
  background: #121212;
  border: none;
  outline: none;
  color: #e7e7e7;
  font-size: 20px;
  cursor: pointer;
}
.wrapper input[type="checkbox"]{
  display: none;
}

/* Dropdown Menu code start */
.content .links ul{
  position: absolute;
  background: #121212;
  top: 80px;
  z-index: -1;
  opacity: 0;
  visibility: hidden;
}
.content .links li:hover > ul{
  top: 70px;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
}
.content .links ul li a{
  display: block;
  width: 100%;
  line-height: 30px;
  border-radius: 0px!important;
}
.content .links .active{
  color: #5eff8f;
  background: #333;
  margin-left: 15px;
  margin-right: 20px;
}
.content .links ul ul{
  position: absolute;
  top: 0;
  right: calc(-100% + 8px);
}
.content .links ul li{
  position: relative;
}
.content .links ul li:hover ul{
  top: 0;
}

/* Responsive code start */
@media screen and (max-width: 1250px){
  .wrapper nav{
    max-width: 100%;
    padding: 0 20px;
  }
  nav .content .links{
    margin-left: 270px;
  }
  .content .links li a{
    padding: 8px 13px;
  }
  .wrapper .search-box{
    max-width: calc(100% - 100px);
  }
  .wrapper .search-box input{
    padding: 0 100px 0 15px;
  }
}

@media screen and (max-width: 900px){
  .wrapper .menu-icon{
    display: block;
  }
  .wrapper #show-menu:checked ~ .menu-icon i::before{
    content: "\f00d";
  }
  nav .content .links{
    display: block;
    position: fixed;
    background: #121212;
    height: 100%;
    width: 100%;
    top: 70px;
    left: -100%;
    margin-left: 0;
    max-width: 300px;
    overflow-y: auto;
    padding-bottom: 100px;
    transition: all 0.3s ease;
  }
  nav #show-menu:checked ~ .content .links{
    left: 0%;
  }
  .content .links li{
    margin: 15px 20px;
  }
  .content .links li a,
  .content .links li label{
    line-height: 40px;
    font-size: 20px;
    display: block;
    padding: 8px 18px;
    cursor: pointer;
  }
  .content .links .active{
    color: #5eff8f;
    background: #333;
    margin:0;
  }
  .content .links li a.desktop-link{
    display: none;
  }

  /* dropdown responsive code start */
  .content .links ul,
  .content .links ul ul{
    position: static;
    opacity: 1;
    visibility: visible;
    background: none;
    max-height: 0px;
    overflow: hidden;
  }
  .content .links #show-features:checked ~ ul,
  .content .links #show-services:checked ~ ul,
  .content .links #show-items:checked ~ ul{
    max-height: 100vh;
  }
  .content .links ul li{
    margin: 7px 20px;
  }
  .content .links ul li a{
    font-size: 18px;
    line-height: 30px;
    border-radius: 5px!important;
  }
}

@media screen and (max-width: 400px){
  .wrapper nav{
    padding: 0 10px;
  }
  .content .logo a{
    font-size: 27px;
  }
  .wrapper .search-box{
    max-width: calc(100% - 70px);
  }
  .wrapper .search-box .go-icon{
    width: 30px;
    right: 0;
  }
  .wrapper .search-box input{
    padding-right: 30px;
  }
}

.dummy-text{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  z-index: -1;
  padding: 0 20px;
  text-align: center;
  transform: translate(-50%, -50%);
}
.dummy-text h2{
  font-size: 45px;
  margin: 5px 0;
}
</style>
<div class="wrapper">
<nav>
  <input type="checkbox" id="show-search">
  <input type="checkbox" id="show-menu">
  <label for="show-menu" class="menu-icon"><i class="fas fa-bars"></i></label>
  <div class="content">
  <div class="logo"><a href="#">Ananay Dubey</a></div>
    <ul class="links">
      <li><a href="#">Home</a></li>
      <li>
        <a href="#" class="desktop-link">Explore</a>
        <input type="checkbox" id="show-features">
        <label for="show-features">Explore</label>
        <ul>
          <li><a href="finixx.netlify.app">Finixx</a></li>
          <li><a href="radioo.netlify.app">Musify</a></li>
          <li><a href="#">Python</a></li>
          <li><a href="#">Weather</a></li>
        </ul>
      </li>
      <li>
        <a href="#" class="desktop-link">Connect</a>
        <input type="checkbox" id="show-services">
        <label for="show-services">Connect</label>
        <ul>
          <li><a href="#">Mail Us</a></li>
          <li><a href="#">Chat</a></li>
          <li>
            <a href="#" class="desktop-link">Social</a>
            <input type="checkbox" id="show-items">
            <label for="show-items">Social</label>
            <ul>
            <li><a href="#">Youtube</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            </ul>
          </li>
        </ul>
      </li>
      <li><a href="#">Feedback</a></li>
      <li><a class="active" href="#">Login</a></li>
    </ul>
  </div>
  <label for="show-search" class="search-icon"><i class="fas fa-search"></i></label>
  <form action="#" class="search-box">
    <input type="text" placeholder="Type Something to Search..." required>
    <button type="submit" class="go-icon"><i class="fas fa-long-arrow-alt-right"></i></button>
  </form>
</nav>
</div>
`;

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('c-nav', Header);