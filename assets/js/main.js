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


const firebaseConfig = {
    apiKey: "AIzaSyA6vu0G0qglFmAVdMqf9xVDXqRLE0xwdGs",
    authDomain: "views-4576f.firebaseapp.com",
    projectId: "views-4576f",
    storageBucket: "views-4576f.appspot.com",
    messagingSenderId: "666092567983",
    appId: "1:666092567983:web:f377e366ba0dd3a9b6435a"
};

const app = firebase.initializeApp(firebaseConfig);

function get_viewers_ip(json) {
    const viewers_ip = json.ip;
    count_view(viewers_ip);
}

function count_view(viewers_ip) {
    const ip_to_string = viewers_ip.toString().replace(/\./g, '-');
    const dbRef = app.database().ref("page_views/" + ip_to_string);
    dbRef.set({ viewers_ip: viewers_ip });

    app.database().ref("page_views").on("value", function (snapshot) {
        const views = snapshot.numChildren();
        document.getElementById("vct").innerHTML = "Views: " + views;
    });
}

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
// Function to display projects based on input text
function displayProjects(projects) {
    const projectRow = document.getElementById("project-row");
    projectRow.innerHTML = ""; // Clear existing projects

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "column";
        
        // Remove spaces from project title to match the format in the database
        const projectId = project.title.replace(/\s/g, '');

        card.innerHTML = `
            <div class="card">
                <img class="lazy" alt="${project.title}" data-src="${project.image}" src="assets/images/placeholder.webp">
                <div class="content img-content">
                    <div class="overlay">
                        <div class="p-title">${project.title}</div>
                        <div class="p-date">${project.date}</div>
                        <!-- Add a span element to display views -->
                        <div class=btns>
                        <a onclick="updateClickCount('${projectId}')" target="_blank" href="${project.link}" class="p-btn">Open</a>
                        <span class="p-views" id="${projectId}-views"><i class="fa fa-eye"></i>: Loading...</span>
</div>                    
                        </div>
                </div>
            </div>
        `;
        projectRow.appendChild(card);

        // Fetch and display views for each project
        const dbRefViews = app.database().ref("project_clicks/" + projectId);
        dbRefViews.once("value")
            .then(function(snapshot) {
                const views = snapshot.val() || 0;
                const viewsElement = document.getElementById(projectId + "-views");
                viewsElement.innerHTML = `<i class="fa-solid fa-eye"></i> ${views}`;
            })
            .catch(function(error) {
                console.error("Error fetching views for project:", projectId, error);
            });
    });

    // Lazy load images after they have been appended to the DOM
    lazyLoadImages();
}


// Function to update click count in the database
function updateClickCount(projectId) {
    var projectId = projectId.replace(/\s/g, '');
    const dbRef1 = app.database().ref("project_clicks/" + projectId);
    dbRef1.once("value")
        .then(function (snapshot) {
            const views = (snapshot.val() || 0)+1;
            const viewsElement = document.getElementById(projectId + "-views");
            viewsElement.innerHTML = `<i class="fa-solid fa-eye"></i> ${views}`;
            return dbRef1.set(views);
        })
        .then(function () {
            console.log("Click count updated for project:", projectId);
        })
        .catch(function (error) {
            console.error("Error updating click count:", error);
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
}// Function to extract and filter out unwanted tags from projects
function extractAndFilterTags(projects, excludeTags) {
    let allTags = [];
    projects.forEach(project => {
        allTags = allTags.concat(project.tags);
    });
    // Use Set to get unique tags, filter out tags based on excludeTags array, and convert back to array
    return [...new Set(allTags.filter(tag => !excludeTags.includes(tag)))];
}

// Define the tags you want to exclude
const excludeTags = ['Divyanshi', 'Messaging', "Commerce", "Holiday", "Homework", "Video"]; // Example tags to exclude
// Function to render tags in the sidebar in randomized order
function renderFilteredTags(tags) {
    const shuffledTags = shuffleArray(tags);
    const slicedTags = shuffledTags.slice(0, 42); // Slice the array to get the first 40 tags
    const tagContainer = document.getElementById('tagContainer');
    slicedTags.forEach(tag => {
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1); // Convert tag to capitalized case
        const radioBtn = document.createElement('div');
        radioBtn.className = 'radio-button';
        radioBtn.textContent = capitalizedTag;
        tagContainer.appendChild(radioBtn);
    });
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// Function to add event listeners to tag elements
function addTagEventListeners() {
    const tagButtons = document.querySelectorAll('.radio-button');
    tagButtons.forEach(tagButton => {
        tagButton.addEventListener('click', function () {
            const selectedTag = this.textContent.trim(); // Extract text content of clicked tag
            toggleActiveClass(this); // Toggle active class for clicked tag
            filterProjectsByTags(); // Filter projects based on selected tags
        });
    });
}

// Function to toggle active class for clicked tag
function toggleActiveClass(tagButton) {
    tagButton.classList.toggle('active'); // Toggle "active" class
}

// Function to filter projects based on selected tags
function filterProjectsByTags() {
    const selectedTags = getSelectedTags(); // Get an array of selected tag strings
    fetchProjects()
        .then(projects => {
            let filteredProjects = projects;
            if (selectedTags.length > 0) {
                // Filter projects based on selected tags
                filteredProjects = projects.filter(project => {
                    return selectedTags.every(tag => project.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
                });
            }
            displayProjects(filteredProjects);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
}

// Function to get an array of selected tag strings
function getSelectedTags() {
    const selectedTags = [];
    const tagButtons = document.querySelectorAll('.radio-button.active');
    tagButtons.forEach(tagButton => {
        selectedTags.push(tagButton.textContent.trim().toLowerCase());
    });
    return selectedTags;
}
// Fetch projects and render filtered tags in the sidebar
fetchProjects()
    .then(projects => {
        const filteredTags = extractAndFilterTags(projects, excludeTags);
        renderFilteredTags(filteredTags);
        displayProjects(projects);
        addTagEventListeners(); // Add event listeners to tag elements
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
const zoomContainer = document.getElementById('zoomContainer');
const img = zoomContainer.querySelector('img');

zoomContainer.addEventListener('mousemove', (e) => {
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetRight;
    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = "scale(2)";
});

