const swiperTemplate = document.createElement('template');

swiperTemplate.innerHTML = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
    </style>
    `;

class Swiper extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(swiperTemplate.content);
    }
}

customElements.define('c-swiper', Swiper);