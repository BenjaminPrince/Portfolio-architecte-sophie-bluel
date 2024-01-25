// Fonction pour charger et afficher les images
async function loadImages() {
    const galleryContainer = document.querySelector('.gallery-container');
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const works = await response.json();
        galleryContainer.innerHTML = '';
        works.forEach(work => {
            const imageElement = document.createElement('div');
            imageElement.className = 'gallery-item';
            imageElement.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" class="gallery-image">
                <button class="delete-btn" onclick="deleteWork(${work.id}, loadImages)">
                    <i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
                </button>
            `;
            galleryContainer.appendChild(imageElement);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mediaInput').addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            document.querySelector('.photo-upload-container .upload-content').style.display = 'none';
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = 'block';

            document.getElementById('backButton').style.display = 'block';

            document.getElementById('deleteIcon').addEventListener('click', async function() {
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                document.getElementById('backButton').style.display = 'none';

                // Supprimez la ligne suivante si vous ne souhaitez pas recharger les images après la suppression
                await loadImages();
            });
        }
    });
});


// modale.js

// Fonction pour supprimer un travail
async function deleteWork(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Projet ${workId} supprimé avec succès.`);
       
        // Rechargez la page après la suppression du projet
        location.reload();

    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
    }
}





// Fonction pour charger les catégories depuis le backend
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();

        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = ''; // Effacer les options existantes

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

// Fonction pour ouvrir la modale de gestion des travaux
function openWorkModal() {
    const workModal = document.getElementById('workModal');
    const addPhotoModal = document.getElementById('addPhotoModal');
    
    workModal.style.display = 'block';
    addPhotoModal.style.display = 'none';
    loadImages();
}

// Fonction pour ouvrir la modale d'ajout de photo
function openAddPhotoModal() {
    const workModal = document.getElementById('workModal');
    const addPhotoModal = document.getElementById('addPhotoModal');
    
    workModal.style.display = 'none';
    addPhotoModal.style.display = 'block';
    loadCategories(); // Charger les catégories lors de l'ouverture de la modale
}

// Ouvrir la modale de gestion des travaux au clic du bouton "Modifier"
document.getElementById('edit-projects').addEventListener('click', openWorkModal);

// Ouvrir la modale d'ajout de photo au clic du bouton "Ajouter une photo"
document.getElementById('addPhotoBtn').addEventListener('click', openAddPhotoModal);

document.getElementById('addPhotoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Vérification des champs du formulaire
    const titleInput = document.getElementById('titleInput').value;
    const categorySelect = document.getElementById('categorySelect').value;
    const imageFile = document.getElementById('mediaInput').files[0];

    if (!titleInput.trim() || !categorySelect || !imageFile) {
        alert('Tous les champs sont requis.'); // Affiche une alerte pour l'utilisateur
        return;
    }

    // Créer un objet FormData à partir du formulaire
    const formData = new FormData();
    formData.append('title', titleInput);
    formData.append('category', categorySelect);
    formData.append('image', imageFile);

    try {
        // Envoi des données au backend via Fetch
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Traiter la réponse
        const result = await response.json();
        alert('Projet ajouté avec succès!'); // Affiche une notification de succès
        closeModal('addPhotoModal');
        loadImages(); // Recharger les images pour afficher la nouvelle image ajoutée
        location.reload(); // Recharger la page après l'ajout réussi
    } catch (error) {
        alert('Erreur lors de l’envoi du projet.'); // Affiche une notification d'erreur
        console.error('Erreur envoi du projet:', error);
    }
});

// Fermer les modales
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Fermer la modale lorsque l'utilisateur clique sur la croix
document.querySelectorAll('.modal .close').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        closeModal(closeButton.closest('.modal').id);
    });
});

// Fermer la modale en cliquant en dehors de celle-ci
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});



// Ajouter des gestionnaires d'événements pour les boutons d'ouverture des modales
document.getElementById('edit-projects').addEventListener('click', openWorkModal);
document.getElementById('addPhotoBtn').addEventListener('click', openAddPhotoModal);