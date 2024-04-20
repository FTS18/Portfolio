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
                        <img alt="${project.title}" src="${project.image}">
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
});// Get the input element
const input = document.getElementById("search-input");

// Add event listener for "keypress" event on the input element
input.addEventListener("keypress", function(event) {
    // If the key pressed is "Enter"
    if (event.key === "Enter") {
        // Prevent the default action (e.g., form submission)
        event.preventDefault();
        
        // Get the button element
        const btn = document.getElementById("search-btn");
        
        // Trigger a click event on the button element
        btn.click();
    }
});
