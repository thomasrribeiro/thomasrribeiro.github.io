
// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add click handlers for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        console.log('Project clicked:', this.querySelector('.project-title').textContent);
    });
});

// Friendship box click handler
const friendshipTrigger = document.getElementById('friendship-trigger');
const friendsListContainer = document.getElementById('friends-list-container');
const dlaCircle = document.getElementById('dla-circle');

if (friendshipTrigger && friendsListContainer) {
    let friendsList = null;
    let isExpanded = false;

    friendshipTrigger.addEventListener('click', function() {
        if (!isExpanded) {
            // Create and show friends in 3-column grid
            const friends = [
                { name: 'raffi', url: 'https://rhotter.vercel.app/' },
                { name: 'george', url: 'https://ca.linkedin.com/in/sideris-george' },
                { name: 'marley', url: 'https://www.marleyx.com/' },
                { name: 'wilfred', url: 'https://ca.linkedin.com/in/wilfred-mason-054ba8308' },
                { name: 'lev', url: 'https://lev.la/' },
                { name: 'nikita', url: 'https://www.linkedin.com/in/derunnikita' }
            ];

            friends.forEach(friend => {
                const link = document.createElement('a');
                link.href = friend.url;
                link.target = '_blank';
                link.textContent = friend.name;
                link.className = 'friend-link';
                friendsListContainer.appendChild(link);
            });

            isExpanded = true;
        } else {
            // Hide friends list
            friendsListContainer.innerHTML = '';
            isExpanded = false;
        }
    });
}

// Handle Human Head Viewer image - use production URL directly
const humanHeadImg = document.getElementById('human-head-img');
if (humanHeadImg) {
    // In production, use the deployed human-head-viewer image
    // In dev, the local symlink will work
    if (import.meta.env.PROD) {
        humanHeadImg.src = 'https://thomasrribeiro.github.io/human-head-viewer/images/edge-slice-52-7.png';
    }
}

// Debug project image dimensions
window.addEventListener('load', function() {
    const projectImg = document.querySelector('.project-img');
    const img = document.querySelector('.project-img img');
    if (projectImg && img) {
        console.log('=== PROJECT IMAGE DEBUG ===');
        console.log('Container dimensions:', {
            width: projectImg.offsetWidth,
            height: projectImg.offsetHeight,
            computedHeight: window.getComputedStyle(projectImg).height,
            overflow: window.getComputedStyle(projectImg).overflow
        });
        console.log('Image dimensions:', {
            width: img.offsetWidth,
            height: img.offsetHeight,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            computedStyle: {
                width: window.getComputedStyle(img).width,
                height: window.getComputedStyle(img).height,
                objectFit: window.getComputedStyle(img).objectFit
            }
        });
        console.log('=========================');
    }
});

// Import DLA simulation
import { DLASimulation } from './dla.js';

const dlaCanvas = document.getElementById('dla-canvas');
const generateTreeBtn = document.getElementById('generate-tree-btn');

let dlaSimulation = null;

if (dlaCanvas && generateTreeBtn) {
    // Initialize canvas size - full About Me width
    dlaCanvas.width = 320;
    dlaCanvas.height = 250;

    // Auto-start simulation on page load
    window.addEventListener('load', function() {
        dlaSimulation = new DLASimulation(dlaCanvas);
        dlaSimulation.start();
    });

    // Generate new tree on button click
    generateTreeBtn.addEventListener('click', function() {
        if (dlaSimulation) {
            dlaSimulation.stop();
            dlaSimulation.reset();
        } else {
            dlaSimulation = new DLASimulation(dlaCanvas);
        }
        dlaSimulation.start();
    });
}
