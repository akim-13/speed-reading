fetch('../shared/html/navbar.html')
.then(response => response.text())
.then(html => {
    document.getElementById('navbar-container').innerHTML = html;
})
.then(() => {
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('sidebarHeader');
    const title = document.getElementById('sidebarTitle');

    toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');

    if (isOpen) {
        header.classList.add('active');
        title.textContent = 'Меню игр';
        toggleBtn.textContent = '✕';
    } else {
        header.classList.remove('active');
        title.textContent = '';
        toggleBtn.textContent = '☰';
    }
    });
})
.catch(err => console.error('Error loading navbar:', err));