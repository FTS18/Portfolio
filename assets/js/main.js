const footerUrl = 'components/footer.html';
const headerUrl = 'components/navbar.html';

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    fetch(footerUrl)
        .then((response) => response.text())
        .then((footerHtml) => {
            footerPlaceholder.innerHTML = footerHtml;
            updateYear();
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


// Function to fetch projects data from JSON file
function fetchProjects() {
    return fetch('assets/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching projects: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            return [];
        });
}
// Function to display projects based on input text
function displayProjects(projects) {
    const projectRow = document.getElementById("project-row");
    projectRow.innerHTML = ""; // Clear existing projects

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "column";
        card.innerHTML = `
            <div class="card">
                <img class="lazy" alt="${project.title}" data-src="${project.image}" src="assets/images/placeholder.webp">
                <div class="content img-content">
                    <div class="overlay">
                        <div class="p-title">${project.title}</div>
                        <div class="p-date">${project.date}</div>
                        <a href="${project.link}" class="p-btn">Open</a>
                    </div>
                </div>
            </div>
        `;
        projectRow.appendChild(card);
    });

    // Lazy load images after they have been appended to the DOM
    lazyLoadImages();
}

// Function to search projects based on input text
function searchProjects() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    fetchProjects()
        .then(projects => {
            const filteredProjects = projects.filter(project => {
                const isMatchingTitle = project.title.toLowerCase().includes(searchTerm);
                const isMatchingDate = project.date.toLowerCase().includes(searchTerm);
                const isMatchingTags = project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                return isMatchingTitle || isMatchingDate || isMatchingTags;
            });
            displayProjects(filteredProjects);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
}
// Display all projects initially
fetchProjects()
    .then(projects => {
        displayProjects(projects);
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
    });

const swiper = new Swiper('.overlay', {
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 4500,
    },
    speed: 400
});
// Function to update the year
function updateYear() {
    var currentYear = new Date().getFullYear();
    document.getElementById("year").textContent = currentYear;
}// Function to calculate age based on birthdate
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Function to update age dynamically
function updateAge() {
    const ageElement = document.getElementById('age');
    const birthDate = '2006-03-13'; // Change this to the birthdate in YYYY-MM-DD format
    const age = calculateAge(birthDate);
    ageElement.textContent = age;
}

updateAge();
function lazyLoadImages() {
    var lazyImages = document.querySelectorAll('.card img.lazy');

    lazyImages.forEach(function (img) {
        img.setAttribute('loading', 'lazy'); // Set loading="lazy" attribute
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src; // Set the src to the value of data-src
                        observer.unobserve(img);
                    }
                });
            });

            observer.observe(img);
        } else {
            // Fallback for browsers that do not support IntersectionObserver
            img.src = img.dataset.src;
        }
    });
}
lazyLoadImages(); document.addEventListener("DOMContentLoaded", function () {
    // Lazy load images within the Swiper slider
    var swiperImages = document.querySelectorAll('.swiper-slide img.lazy');

    swiperImages.forEach(function (img) {
        img.setAttribute('loading', 'lazy'); // Set loading="lazy" attribute
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src; // Set the src to the value of data-src
                        observer.unobserve(img);
                    }
                });
            });

            observer.observe(img);
        } else {
            // Fallback for browsers that do not support IntersectionObserver
            img.src = img.dataset.src;
        }
    });
}); document.addEventListener("DOMContentLoaded", function () {
    var lazyDivs = document.querySelectorAll('.lazy-bg');

    lazyDivs.forEach(function (div) {
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var bgUrl = div.getAttribute('data-bg');
                        div.style.backgroundImage = bgUrl; // Set the background image
                        div.classList.remove('lazy-bg');
                        div.classList.add('loaded-bg');
                        observer.unobserve(div);
                    }
                });
            });

            observer.observe(div);
        } else {
            // Fallback for browsers that do not support IntersectionObserver
            var bgUrl = div.getAttribute('data-bg');
            div.style.backgroundImage = bgUrl; // Set the background image
            div.classList.remove('lazy-bg');
            div.classList.add('loaded-bg');
        }
    });
});
