// Debug spacing
function logSpacing() {
    const layout = document.querySelector('.layout');
    const sidebar = document.querySelector('.sidebar');
    const h1 = document.querySelector('.sidebar h1');

    if (layout && sidebar && h1) {
        const layoutStyles = window.getComputedStyle(layout);
        const sidebarStyles = window.getComputedStyle(sidebar);
        const h1Styles = window.getComputedStyle(h1);

        console.log('=== SPACING DEBUG ===');
        console.log('Window width:', window.innerWidth);
        console.log('Layout padding-top:', layoutStyles.paddingTop);
        console.log('Layout flex-direction:', layoutStyles.flexDirection);
        console.log('Sidebar margin-top:', sidebarStyles.marginTop);
        console.log('H1 margin-top:', h1Styles.marginTop);
        console.log('H1 getBoundingClientRect().top:', h1.getBoundingClientRect().top);
        console.log('Layout getBoundingClientRect().top:', layout.getBoundingClientRect().top);
    }
}

// Log on load and resize
window.addEventListener('load', logSpacing);
window.addEventListener('resize', logSpacing);

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
if (friendshipTrigger) {
    let friendsList = null;
    let isExpanded = false;

    friendshipTrigger.addEventListener('click', function() {
        if (!isExpanded) {
            // Create and show friends list
            friendsList = document.createElement('div');
            friendsList.className = 'friends-list';
            friendsList.innerHTML = '<a href="https://rhotter.vercel.app/" target="_blank">raffi</a><a href="https://ca.linkedin.com/in/sideris-george" target="_blank">george</a><a href="https://www.marleyx.com/" target="_blank">marley</a><a href="https://ca.linkedin.com/in/wilfred-mason-054ba8308" target="_blank">wilfred</a><a href="https://lev.la/" target="_blank">lev</a><a href="https://www.linkedin.com/in/derunnikita" target="_blank">nikita</a>';

            const socialIcons = document.querySelector('.social-icons');
            if (socialIcons) {
                socialIcons.parentNode.insertBefore(friendsList, socialIcons.nextSibling);
            }
            isExpanded = true;
        } else {
            // Hide friends list
            if (friendsList && friendsList.parentNode) {
                friendsList.parentNode.removeChild(friendsList);
            }
            isExpanded = false;
        }
    });
}
