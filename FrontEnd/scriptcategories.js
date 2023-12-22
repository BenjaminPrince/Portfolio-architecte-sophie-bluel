// Gestion des catégories de filtrage
async function loadCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterWorks(category);
        });
    });
}

// Filtrer les travaux par catégorie
function filterWorks(category) {
    const works = document.querySelectorAll('.work-item');
    works.forEach(work => {
        if (category === 'all' || work.getAttribute('data-category') === category) {
            work.style.display = 'block';
        } else {
            work.style.display = 'none';
        }
    });
}

// Sélectionner tous les boutons de filtre
const filterButtons = document.querySelectorAll('.filter-btn');

// Ajouter un écouteur d'événements à chaque bouton
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Supprimer la classe 'active' de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Ajouter la classe 'active' au bouton cliqué
        this.classList.add('active');
    });
});

loadCategories();