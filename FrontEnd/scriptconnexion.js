// Vérification de la connexion et gestion des éléments d'édition et de la barre de connexion
function checkLoginState() {
    const token = localStorage.getItem('token');
    const editModeBanner = document.getElementById('edit-mode-banner');
    const editProjects = document.getElementById('edit-projects');
    const filterButtons = document.querySelector('.filter-buttons');
    const loginButton = document.querySelector('nav ul li a[href="connexion.html"]');

    if (token) {
        // L'utilisateur est connecté
        if (editModeBanner) {
            editModeBanner.style.display = 'flex';
        }
        if (editProjects) {
            editProjects.style.display = 'flex';
        }
        if (filterButtons) {
            filterButtons.style.display = 'none'; // Cache les boutons de filtre
        }

        // Change le lien de connexion en "Déconnexion"
        if (loginButton) {
            loginButton.textContent = 'Déconnexion';
            loginButton.href = '#';
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.reload(); // Rafraîchit la page pour mettre à jour l'état de connexion
            });
        }
    } else if (loginButton) {
        // L'utilisateur n'est pas connecté
        loginButton.textContent = 'Login';
        loginButton.href = 'connexion.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginState(); // Appelle la fonction au chargement pour vérifier l'état de connexion

    // Logique de connexion
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        const errorMessage = document.querySelector('.error-message');
    
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
    
            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html'; // Redirige vers la page d'accueil après la connexion
                } else {
                    throw new Error('Erreur dans l’identifiant ou le mot de passe');
                }
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block'; // Affiche un message d'erreur en cas d'échec de connexion
            }
        });
    }
});
