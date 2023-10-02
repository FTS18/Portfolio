const footerUrl = 'components/footer.html';
const headerUrl = 'components/navbar.html';

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    fetch(footerUrl)
        .then((response) => response.text())
        .then((footerHtml) => {
            footerPlaceholder.innerHTML = footerHtml;
        })
        .catch((error) => {
            console.error('Error loading footer:', error);
        });
}

loadFooter();

function loadHeader() {
    const cNav = document.querySelector('c-nav'); 
    fetch(headerUrl)
        .then((response) => response.text())
        .then((headerHtml) => {
            cNav.innerHTML = headerHtml;
        })
        .catch((error) => {
            console.error('Error loading header:', error);
        });
}

loadHeader();



fetch('assets/projects.json')
    .then((response) => response.json())
    .then((projectsData) => {
        const projectRow = document.getElementById("project-row");

        projectsData.forEach((project) => {
            const card = document.createElement("div");
            card.className = "column";
            card.innerHTML = `
                        <div class="card">
                            <a href="${project.link}">
                                <img alt="${project.title}" src="${project.image}">
                                <div class="content img-content">
                                    <div class="p-title">${project.title}</div>
                                    <div class="p-date">${project.date}</div>
                                </div>
                            </a>
                        </div>
                    `;
            projectRow.appendChild(card);
        });
    })
    .catch((error) => console.error('Error loading project data:', error));

const swiper = new Swiper('.overlay', {
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 5500,
    },
    speed: 600
});