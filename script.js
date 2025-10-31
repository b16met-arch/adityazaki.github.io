/* typing animation (pastikan typed.js sudah diload di head atau sebelum script ini) */
var typed = new Typed(".typing", {
  strings: ["Web Developer", "Game Developer", "Mobile Developer"],
  typeSpeed: 90,
  backSpeed: 50,
  loop: true
});

/* ---------- SELECTORS ---------- */
const nav = document.querySelector(".nav");
const navList = nav ? nav.querySelectorAll("li") : [];
const totalNavList = navList.length;

const navTogglerBtn = document.querySelector(".nav-toggler");
 aside = document.querySelector(".aside");
const sections = document.querySelectorAll(".section");
let allSection = document.querySelectorAll(".section"); // keep for backward compat
let totalSection = allSection.length;

/* ---------- NAV LINKS (klik menu) ---------- */
if (nav) {
  for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    if (!a) continue;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      removebackSection();

      for (let j = 0; j < totalNavList; j++) {
        const aj = navList[j].querySelector("a");
        if (!aj) continue;
        if (aj.classList.contains("active")) {
          addbackSection(j);
        }
        aj.classList.remove("active");
      }

      this.classList.add("active");
      showSection(this);

      if (window.innerWidth < 1200) {
        asideSectionTogglerBtn(); // tutup aside di mobile setelah klik menu
      }
    });
  }
}

/* ---------- ASIDE TOGGLER (hamburger) ---------- */
let isThrottled = false;

function toggleAside() {
  if (!aside) return;
  aside.classList.toggle("open");
  // toggle .open for all sections for consistent behavior
  document.querySelectorAll(".section").forEach(s => s.classList.toggle("open"));
  if (navTogglerBtn) {
    navTogglerBtn.classList.toggle("open");
    navTogglerBtn.setAttribute("aria-expanded", String(navTogglerBtn.classList.contains("open")));
  }
}

// expose named function so existing code can call it
const asideSectionTogglerBtn = toggleAside;

if (navTogglerBtn && aside) {
  navTogglerBtn.addEventListener("click", () => {
    if (isThrottled) return;
    isThrottled = true;
    toggleAside();
    setTimeout(() => isThrottled = false, 300);
  });
}

/* ---------- PAGE LOAD + HASH SUPPORT ---------- */
window.addEventListener("load", () => {
  const hash = window.location.hash || "#home";
  const link = document.querySelector(`.nav a[href="${hash}"]`);
  if (link) {
    // deactivate all sections then show
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.querySelector(hash)?.classList.add("active");
    updateNav(link);
  } else {
    // default: show #home
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.querySelector("#home")?.classList.add("active");
    updateNav(document.querySelector('.nav a[href="#home"]'));
  }
});

/* handle back/forward navigation */
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  const link = document.querySelector(`.nav a[href="${hash}"]`);
  if (link) {
    showSection(link);
    updateNav(link);
  }
});

/* ---------- SECTION HELPERS ---------- */
function removebackSection() {
  allSection = document.querySelectorAll(".section");
  totalSection = allSection.length;
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("back-section");
  }
}

function showSection(element) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("active");
  }
  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}


function addbackSection(num) {
  allSection[num].classList.add("back-section");
}

function updateNav(element) {
  if (!element) return;
  for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    if (!a) continue;
    a.classList.remove("active");
    const target = element.getAttribute("href")?.split("#")[1];
    if (!target) continue;
    if (target === a.getAttribute("href").split("#")[1]) {
      a.classList.add("active");
    }
  }
}

/* ---------- HIRE-ME BUTTON ---------- */
const hireBtn = document.querySelector(".hire-me");
if (hireBtn) {
  hireBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const targetLink = document.querySelector('.nav a[href="#contact"]');
    if (targetLink) {
      showSection(targetLink);
      updateNav(targetLink);
      removebackSection();
      for (let i = 0; i < totalNavList; i++) {
        const a = navList[i].querySelector("a");
        if (a && a.getAttribute("href") === "#contact") {
          addbackSection(i);
          break;
        }
      }
      // on small screens, close the aside after clicking hire
      if (window.innerWidth < 1200) asideSectionTogglerBtn();
    }
  });
}



(() => {
  const skillsCard = document.getElementById('skillsCard');
  if (!skillsCard) return;

  const animateSkill = (display, target, duration = 800) => {
    if (!display || display.dataset.done) return;
    let current = 0;
    const step = Math.max(Math.floor(duration / Math.max(target,1)), 10);
    const id = setInterval(() => {
      current++;
      display.textContent = `${current}%`;
      if (current >= target) {
        clearInterval(id);
        display.dataset.done = '1';
      }
    }, step);
  };

  const animateAll = (root) => {
    root.querySelectorAll('.skill').forEach(skill => {
      const target = parseInt(skill.getAttribute('data-percent')) || 0;
      const display = skill.querySelector('.skill-percent');
      animateSkill(display, target);
    });
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateAll(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillsCard);

  // exposed helper
  window.addSkill = (name, percent = 50, note = '', tags = []) => {
    const div = document.createElement('div');
    div.className = 'skill';
    div.setAttribute('data-percent', String(percent));
    div.innerHTML = `
      <div class="skill-info">
        <div class="skill-name">${name}</div>
        <div class="skill-tags">${tags.map(t => '<span class="tag">' + t + '</span>').join('')}</div>
        <div class="skill-note">${note}</div>
      </div>
      <div class="skill-percent">0%</div>
    `;
    skillsCard.appendChild(div);
    // animate immediately jika section sudah terlihat
    const rect = skillsCard.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const display = div.querySelector('.skill-percent');
      animateSkill(display, parseInt(percent) || 0);
    }
  };
})();

