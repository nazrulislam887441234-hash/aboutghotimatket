'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Respect user's reduced-motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  initDynamicAgeAndYear();
  initMobileNavigation();
  initFAQAccordion();
  initTypingAnimation(prefersReducedMotion);
  initScrollAnimations(prefersReducedMotion);
  initScrollToTop(prefersReducedMotion);
});


/* =========================================================
   DYNAMIC AGE & COPYRIGHT YEAR
   ========================================================= */

/**
 * Calculates the founder's current age from birth year.
 * Also updates the copyright year.
 */
function initDynamicAgeAndYear() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Founder birth year
    const birthYear = 2010;

    // Basic age calculation
    let calculatedAge = currentYear - birthYear;

    // If an exact birthday is required, set the month/day here.
    // Example:
    // const birthMonth = 5;
    // const birthDay = 15;

    if (calculatedAge < 0) {
      calculatedAge = 0;
    }

    // Dynamic age display
    const ageElement = document.getElementById('dynamicAgeDisplay');

    if (ageElement) {
      ageElement.textContent = `বর্তমান বয়স: ${calculatedAge} বছর`;
    }

    // Dynamic copyright year
    const yearElement = document.getElementById('copyrightYear');

    if (yearElement) {
      yearElement.textContent = String(currentYear);
    }
  } catch (error) {
    console.error(
      'Error updating dynamic age and copyright year:',
      error
    );
  }
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

/**
 * Mobile navigation drawer.
 * Includes:
 * - Open / close
 * - Overlay
 * - ESC key
 * - Mobile link close
 * - ARIA state
 * - Body scroll lock
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');

  const mobileLinks = document.querySelectorAll(
    '.mobile-nav-link'
  );

  // Required elements missing
  if (!menuBtn || !drawer || !overlay) {
    return;
  }

  /**
   * Open mobile drawer.
   */
  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');

    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling
    document.body.classList.add('menu-open');

    // Fallback for existing CSS/JS
    document.body.style.overflow = 'hidden';

    // Move focus into drawer if possible
    if (closeBtn) {
      setTimeout(() => {
        closeBtn.focus();
      }, 50);
    }
  }

  /**
   * Close mobile drawer.
   */
  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');

    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    // Restore scrolling
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';

    // Return focus to menu button
    if (document.activeElement === closeBtn) {
      menuBtn.focus();
    }
  }

  /**
   * Toggle drawer.
   */
  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');

    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Overlay click
  overlay.addEventListener('click', closeDrawer);

  // Close after clicking mobile navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ESC key
  document.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' &&
      drawer.classList.contains('active')
    ) {
      closeDrawer();
    }
  });

  // Close drawer when viewport becomes desktop size
  const mediaQuery = window.matchMedia('(min-width: 769px)');

  const handleDesktopChange = event => {
    if (event.matches) {
      closeDrawer();
    }
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleDesktopChange);
  }
}


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

/**
 * Accessible FAQ accordion.
 * Only one FAQ item remains open at a time.
 */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  if (!faqHeaders.length) {
    return;
  }

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const body = header.nextElementSibling;

      if (!item || !body) {
        return;
      }

      const isExpanded =
        header.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem === item) {
          return;
        }

        otherItem.classList.remove('active');

        const otherHeader =
          otherItem.querySelector('.faq-header');

        const otherBody =
          otherItem.querySelector('.faq-body');

        if (otherHeader) {
          otherHeader.setAttribute(
            'aria-expanded',
            'false'
          );
        }

        if (otherBody) {
          otherBody.hidden = true;
        }
      });

      // Toggle current FAQ item
      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        body.hidden = true;
        item.classList.remove('active');
      } else {
        header.setAttribute('aria-expanded', 'true');
        body.hidden = false;
        item.classList.add('active');
      }
    });
  });
}


/* =========================================================
   TYPING ANIMATION
   ========================================================= */

/**
 * Hero typing animation.
 */
function initTypingAnimation(reducedMotion) {
  const typingElement =
    document.getElementById('typingText');

  if (!typingElement) {
    return;
  }

  const phrases = [
    'অনলাইন শপিংয়ের',
    'Seller Business গড়ার',
    'Reseller Business শুরু করার',
    'Affiliate Marketing করার',
    'Product Landing Page তৈরির'
  ];

  // Safety check
  if (!phrases.length) {
    return;
  }

  // Reduced motion users get static text
  if (reducedMotion) {
    typingElement.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED = 100;
  const DELETE_SPEED = 50;
  const PHRASE_PAUSE = 1800;
  const NEXT_PHRASE_PAUSE = 500;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!currentPhrase) {
      return;
    }

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);

      typingElement.textContent =
        currentPhrase.substring(0, charIndex);
    } else {
      charIndex = Math.min(
        currentPhrase.length,
        charIndex + 1
      );

      typingElement.textContent =
        currentPhrase.substring(0, charIndex);
    }

    let nextDelay;

    // Finished typing
    if (
      !isDeleting &&
      charIndex >= currentPhrase.length
    ) {
      isDeleting = true;
      nextDelay = PHRASE_PAUSE;
    }

    // Finished deleting
    else if (
      isDeleting &&
      charIndex <= 0
    ) {
      isDeleting = false;

      phraseIndex =
        (phraseIndex + 1) % phrases.length;

      nextDelay = NEXT_PHRASE_PAUSE;
    }

    // Normal typing
    else if (isDeleting) {
      nextDelay = DELETE_SPEED;
    }

    // Normal deleting
    else {
      nextDelay = TYPE_SPEED;
    }

    window.setTimeout(type, nextDelay);
  }

  type();
}


/* =========================================================
   SCROLL REVEAL + ACTIVE NAVIGATION
   ========================================================= */

/**
 * Initializes scroll reveal animations and
 * active navigation section detection.
 */
function initScrollAnimations(reducedMotion) {
  const revealElements =
    document.querySelectorAll('.reveal-up');

  /*
   * -------------------------------------------------------
   * Scroll Reveal
   * -------------------------------------------------------
   */

  if (revealElements.length) {
    if (reducedMotion) {
      revealElements.forEach(element => {
        element.classList.add('revealed');
      });
    } else if ('IntersectionObserver' in window) {
      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add('revealed');

              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
          }
        );

      revealElements.forEach(element => {
        revealObserver.observe(element);
      });
    } else {
      // Fallback for older browsers
      revealElements.forEach(element => {
        element.classList.add('revealed');
      });
    }
  }


  /*
   * -------------------------------------------------------
   * Active Navigation
   * -------------------------------------------------------
   */

  const sections =
    document.querySelectorAll(
      'section[id], header[id]'
    );

  const navLinks =
    document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) {
    return;
  }

  /**
   * Update active navigation item.
   */
  function setActiveNav(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (href === `#${id}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  if (
    reducedMotion ||
    !('IntersectionObserver' in window)
  ) {
    // Use first visible section as fallback
    return;
  }

  const navObserver =
    new IntersectionObserver(
      entries => {
        const visibleEntries = entries.filter(
          entry => entry.isIntersecting
        );

        if (!visibleEntries.length) {
          return;
        }

        // Choose the section closest to viewport top
        visibleEntries.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top)
        );

        const activeSection =
          visibleEntries[0].target;

        const id =
          activeSection.getAttribute('id');

        if (id) {
          setActiveNav(id);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '-15% 0px -65% 0px'
      }
    );

  sections.forEach(section => {
    navObserver.observe(section);
  });
}


/* =========================================================
   SCROLL TO TOP
   ========================================================= */

/**
 * Floating scroll-to-top button.
 */
function initScrollToTop(reducedMotion) {
  const scrollTopBtn =
    document.getElementById('scrollTopBtn');

  if (!scrollTopBtn) {
    return;
  }

  let ticking = false;

  /**
   * Update button visibility.
   */
  function updateScrollButton() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
      scrollTopBtn.setAttribute(
        'aria-hidden',
        'false'
      );
    } else {
      scrollTopBtn.classList.remove('visible');
      scrollTopBtn.setAttribute(
        'aria-hidden',
        'true'
      );
    }

    ticking = false;
  }

  /**
   * Optimized scroll listener.
   */
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(
          updateScrollButton
        );

        ticking = true;
      }
    },
    {
      passive: true
    }
  );

  /**
   * Scroll to page top.
   */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion
        ? 'auto'
        : 'smooth'
    });
  });

  // Set initial state
  updateScrollButton();
}


/* =========================================================
   GLOBAL ERROR HANDLING
   ========================================================= */

/**
 * Prevent unexpected JavaScript errors from
 * completely breaking unrelated UI features.
 */
window.addEventListener('error', event => {
  console.error(
    'JavaScript error:',
    event.error || event.message
  );
});


/**
 * Handle unhandled Promise errors.
 */
window.addEventListener(
  'unhandledrejection',
  event => {
    console.error(
      'Unhandled Promise rejection:',
      event.reason
    );
  }
);
