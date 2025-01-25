function openPhoto(src) {
    const overlay = document.getElementById('overlay');
    const overlayPhoto = document.getElementById('overlay-photo');
    overlayPhoto.src = src;
    overlay.style.display = 'flex';
}

function closePhoto() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

// Animation pour les menus déroulants
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const arrow = content.previousElementSibling.querySelector('.arrow');

    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    arrow.classList.toggle('open');
}

let selectedSize = "";

    function selectSize(element) {
        const sizeOptions = document.querySelectorAll('.size-option');
        sizeOptions.forEach(option => option.classList.remove('selected'));
        element.classList.add('selected');

        // Cacher le message d'erreur si une taille est sélectionnée
        document.getElementById('errorMessage').style.display = 'none';

        addToCartBtn.style.display = 'inline-block';
        addToCartBtn.setAttribute('data-link', element.getAttribute('data-link'));
    }

    function addToCart() {
        const selectedSize = document.querySelector('.size-option.selected');
        if (selectedSize) {
            const paymentLink = selectedSize.getAttribute('data-link');
            window.open(paymentLink, '_blank');
        } else {
            document.getElementById('errorMessage').style.display = 'block';
        }
    }

    // Rendre le bouton de paiement visible dès le départ (sinon le mettre dans la section selectSize : addToCartBtn.style.display = 'inline-block';)
    document.getElementById('addToCartBtn').style.display = 'inline-block';

    // Fonction pour les tailles indisponibles
    function indisponible() {
        alert("This product is currently unavailable.");
    }

    // Fonction pour mettre à jour l'affichage de la barre de prix en temps réel
    function updatePriceDisplay(value) {
        document.getElementById("price-value").innerText = value + "€";
    }

    // Fonction pour filtrer les produits en fonction des filtres sélectionnés
    function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll(".filter-category input:checked")).map(checkbox => checkbox.value);
    const selectedColors = Array.from(document.querySelectorAll(".filter-color input:checked")).map(checkbox => checkbox.value);
    const maxPrice = parseFloat(document.getElementById("price-range").value);

    const products = document.querySelectorAll(".product-card");
    let visibleCount = 0;

    products.forEach(product => {
        const category = product.getAttribute("data-category");
        const colors = product.getAttribute("data-color").split(" "); // Divise les couleurs en liste
        const price = parseFloat(product.getAttribute("data-price"));

        // Vérifie si le produit correspond aux filtres de catégorie
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(category);

        // Vérifie si le produit correspond à au moins une des couleurs sélectionnées
        const matchColor = selectedColors.length === 0 || selectedColors.some(color => colors.includes(color));

        // Vérifie si le produit est dans la limite de prix
        const matchPrice = price <= maxPrice;

        // Affiche le produit seulement s'il correspond à tous les filtres
        if (matchCategory && matchColor && matchPrice) {
            product.style.display = "block";
            visibleCount++;
        } else {
            product.style.display = "none";
        }
    });

    // Message d'alerte si aucun produit n'est visible
    if (visibleCount === 0) {
        alert("Aucun produit ne correspond aux filtres sélectionnés.");
    }
}

    // Fonction pour réinitialiser tous les filtres
    function resetFilters() {
        // Réinitialise les cases à cocher
        document.querySelectorAll(".filter-checkbox").forEach(checkbox => checkbox.checked = false);

        // Réinitialise la barre de prix à sa valeur maximale
        const priceRange = document.getElementById("price-range");
        priceRange.value = priceRange.max;
        updatePriceDisplay(priceRange.value);

        // Relance le filtrage pour afficher tous les produits
        filterProducts();
    }

    function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;

    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  }

  function toggleFilterMenu() {
    const filterPanel = document.querySelector('.filter-panel');
    filterPanel.classList.toggle('active');
}

function updatePriceDisplay(value) {
    document.getElementById("price-value").innerText = value + '€';
}

function toggleFilterMenu() {
    const filterToggleButton = document.getElementById("filter-toggle-button");
    const filterPanel = document.getElementById("filter-panel");

    // Basculer entre ouvert et fermé
    if (filterPanel.classList.contains("active")) {
        filterPanel.classList.remove("active");
        filterToggleButton.textContent = "Filters"; // Texte lorsque fermé
    } else {
        filterPanel.classList.add("active");
        filterToggleButton.textContent = "Close Filters"; // Texte lorsque ouvert
    }
}

    function openSizeGuideProduit1() {
        window.open('https://drive.google.com/file/d/1ASewdOGzIbSo6-WVxrrR6-RKkoqxb4L-/view?usp=sharing', '_blank');
    }

    function openSizeGuideProduit2() {
        window.open('https://drive.google.com/file/d/1rRCmdNWZyFbp311Yg43dBe3_iHsCDmwl/view?usp=sharing', '_blank');
    }

    function openSizeGuideProduit3() {
        window.open('https://f1151672-10ea-4ccb-a39b-d728ac0d70ec.filesusr.com/ugd/703728_a6053be8b0e04c84bfd3c39cf3e2d17e.pdf', '_blank');
    }

    function openSizeGuideProduit5() {
        window.open('https://drive.google.com/file/d/1a9aX411v5tZ5yjnYtZet3c4e44Mr9Uwd/view?usp=sharing', '_blank');
    }

    function openSizeGuideProduit6() {
        window.open('https://drive.google.com/file/d/1Q6TtYJMhPrSLlrLe0w6-InbCdSuntDbR/view?usp=sharing', '_blank');
    }

    const images = document.querySelector('.carousel-images');
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Move the carousel to the selected image
        images.style.transform = `translateX(-${index * 100}%)`;

        // Update active dot
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
    });

    function closeWindow() {
        window.close(); // Ferme la fenêtre actuelle
      }