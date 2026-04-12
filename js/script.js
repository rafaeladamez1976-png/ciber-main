document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Handle scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Handle mobile menu toggle (simple version)
  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = navLinks.style.display === 'flex';
    navLinks.style.display = isExpanded ? 'none' : 'flex';
    if (!isExpanded) {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.backgroundColor = document.documentElement.style.getPropertyValue('--bg-white') || '#ffffff';
      navLinks.style.padding = '1rem';
      navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      
      const links = navLinks.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.style.color = '#1e293b'; // Text dark
      });
    } else {
      // Reset styles for desktop if closed
      navLinks.style = '';
    }
  });
});
