const burger = document.querySelector('.burger');
const body = document.querySelector('body');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', function() {
    navLinks.classList.toggle('open');
    burger.classList.toggle('open');
    body.classList.toggle('disabledScroll');
});
const container = document.querySelector(".slideshow-container");
const text = document.querySelector(".title");
const image = new Image();

image.src = container.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
image.crossOrigin = "Anonymous";

image.addEventListener("load", function() {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(image);
    const textColor = getContrastYIQ(color);
    text.style.color = textColor;
});

function getContrastYIQ(backgroundColor) {
    const yiq = ((backgroundColor[0] * 299) + (backgroundColor[1] * 587) + (backgroundColor[2] * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#e7e7e7e7e7e7';
}