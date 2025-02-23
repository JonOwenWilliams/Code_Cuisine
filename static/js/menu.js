function showMenu(menuId) {
    document.querySelectorAll('.menu-section').forEach(section => {
        section.classList.remove('active')
    });
    document.getElementById(menuId).classList.add('active')
}