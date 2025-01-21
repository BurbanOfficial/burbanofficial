document.addEventListener("DOMContentLoaded", function() {
    // Cibler uniquement le carousel avec l'ID 'carousel1'
    const carousel = document.getElementById('carousel1');

    if (carousel) {
        // Sélectionner les éléments spécifiques au carousel
        const images = carousel.querySelector('.carousel-images');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        
        let currentIndex = 0;
        const totalImages = images.children.length;

        // Fonction pour mettre à jour l'affichage du carousel
        function updateCarousel() {
            // Déplacer les images (transition)
            images.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Mettre à jour l'état des points de navigation (dots)
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Fonction pour afficher l'image précédente
        function showPrevious() {
            currentIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
            updateCarousel();
        }

        // Fonction pour afficher l'image suivante
        function showNext() {
            currentIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }

        // Fonction pour sauter à une image spécifique via un dot
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        // Ajouter des événements pour les boutons de navigation
        if (prevButton) {
            prevButton.addEventListener('click', showPrevious);
        }

        if (nextButton) {
            nextButton.addEventListener('click', showNext);
        }

        // Ajouter des événements pour les dots de navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Initialiser l'affichage du carousel au chargement de la page
        updateCarousel();
    }
});
