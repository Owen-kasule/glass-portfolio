// 1) Projects + Filters
const grid = document.getElementById('projects-grid');
const filters = document.querySelectorAll('#filter-tags button');
let allProjects = [];

if (grid) {
  fetch('/api/projects')
    .then(r=>r.json())
    .then(data => {
      allProjects = data;
      renderProjects(data);
    });

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      const filtered = tag === 'all'
        ? allProjects
        : allProjects.filter(p => p.tags?.includes(tag));
      renderProjects(filtered);
    });
  });
}

function renderProjects(list) {
  grid.innerHTML = '';
  list.forEach(p => {
    const a = document.createElement('a');
    a.href = p.repo || '#';
    a.target = '_blank';
    a.className = 'project-card glass';
    a.innerHTML = `<img src="${p.image}" alt="${p.title}">`;
    grid.appendChild(a);
  });
}

// 2) Contact Form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name:    form.name.value,
      email:   form.email.value,
      message: form.message.value
    };
    fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(r=>r.json())
    .then(j=> {
      document.getElementById('form-response').textContent = j.message;
      form.reset();
    })
    .catch(_=> document.getElementById('form-response').textContent = 'Something went wrong.');
  });
}
