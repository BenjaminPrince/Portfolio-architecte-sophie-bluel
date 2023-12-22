async function works() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();

    const gallery = document.querySelector('.gallery'); // Sélection du conteneur de la galerie

    works.forEach(work => {
        // Créer un conteneur pour chaque œuvre
        const workDiv = document.createElement('div');
        workDiv.classList.add('work-item'); // Ajouter une classe pour le style (si nécessaire)

        // Créer une image et définir son URL
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title; // Utiliser le titre de l'œuvre comme texte alternatif

        // Ajouter l'image au conteneur de l'œuvre
        workDiv.appendChild(img);

        workDiv.setAttribute('data-category', work.categoryId.toString());

        // Créer une div pour le titre et définir son texte
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('work-title'); // Ajouter une classe pour le style (si nécessaire)
        titleDiv.textContent = work.title;

        // Ajouter la div du titre au conteneur de l'œuvre
        workDiv.appendChild(titleDiv);

        // Ajouter le conteneur de l'œuvre à la galerie
        gallery.appendChild(workDiv);
    });
}
works();
