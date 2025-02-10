// script-customer-area.js

// 1. Initialisation de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDb4AOtRT7jGENnLZ2KNwpczaG2Z77G2rc",
  authDomain: "burban-fidelity.firebaseapp.com",
  projectId: "burban-fidelity",
  storageBucket: "burban-fidelity.firebasestorage.app",
  messagingSenderId: "830299174800",
  appId: "1:830299174800:web:f50a4ec419e108f7f16515",
  measurementId: "G-E4QD4PYLM5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 2. Références aux éléments DOM
const authSection = document.getElementById('auth-section');
const clientSection = document.getElementById('client-section');
const userFirstnameDisplay = document.getElementById('user-firstname-display');
const favCount = document.getElementById('fav-count');
const notificationEl = document.getElementById('notification');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const passwordForm = document.getElementById('password-form');
const logoutBtn = document.getElementById('logout-btn');

// Fonction pour afficher une notification personnalisée
function showNotification(title, message, duration = 4000) {
  notificationEl.innerHTML = `<h4>${title}</h4><p>${message}</p>`;
  notificationEl.style.display = 'block';
  setTimeout(() => {
    notificationEl.style.display = 'none';
  }, duration);
}

// 3. Inscription
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Récupération des valeurs
  const firstname   = document.getElementById('reg-firstname').value.trim();
  const lastname    = document.getElementById('reg-lastname').value.trim();
  const email       = document.getElementById('reg-email').value.trim();
  const password    = document.getElementById('reg-password').value;
  const country     = document.getElementById('reg-country').value;
  const phone       = document.getElementById('reg-phone').value.trim();
  const birthday    = document.getElementById('reg-birthday').value;
  const newsletter  = document.getElementById('reg-newsletter').checked;

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // Envoyer l'email de vérification
      cred.user.sendEmailVerification().then(() => {
        showNotification("Confirmation email sent", "Please check your inbox and verify your email to access your account.");
      });
      // Stocker les données complémentaires dans Firestore, en créant les champs favorites et points
      return db.collection('users').doc(cred.user.uid).set({
        firstname,
        lastname,
        email,
        phone: phone ? (country + phone) : "",
        birthday: birthday || "",
        newsletter,
        favorites: [],  // Création du tableau favoris vide
        points: 200       // Initialisation des points de fidélité à 0
      });
    })
    .then(() => {
      registerForm.reset();
      // L'utilisateur ne pourra pas accéder à son compte tant que l'email n'est pas vérifié.
      auth.signOut();
    })
    .catch(err => {
      console.error(err);
      showNotification("Erreur", err.message, 6000);
    });
});

// 4. Connexion
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      if (!cred.user.emailVerified) {
        showNotification("Email not verified", "Please verify your email before logging in.");
        auth.signOut();
      }
    })
    .catch(err => {
      console.error(err);
      showNotification("Erreur", err.message, 6000);
    });
});

// 5. Réinitialisation du mot de passe
document.getElementById('forgot-password').addEventListener('click', (e) => {
  e.preventDefault();
  const email = prompt("Please enter your email address to reset your password:");
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        showNotification("Password reset", "An email has been sent to you to reset your password.");
      })
      .catch(err => {
        console.error(err);
        showNotification("Erreur", err.message, 6000);
      });
  }
});

// 6. Gestion de l'état de l'utilisateur
auth.onAuthStateChanged(user => {
  if (user) {
    if (!user.emailVerified) {
      showNotification("Email not verified", "Please verify your email to access your account.");
      auth.signOut();
      return;
    }
    // Afficher l'espace client
    authSection.style.display = 'none';
    clientSection.style.display = 'block';
    loadUserProfile(user);
    loadUserFavorites(user);
    loadUserAdvantages(user); // Mise à jour de la barre de progression et des coins
  } else {
    authSection.style.display = 'block';
    clientSection.style.display = 'none';
  }
});

// 7. Chargement des données utilisateur
function loadUserProfile(user) {
  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('profile-firstname').value = data.firstname;
        document.getElementById('profile-lastname').value  = data.lastname;
        document.getElementById('profile-email').value     = data.email;
        document.getElementById('profile-birthday').value  = data.birthday;
        userFirstnameDisplay.textContent = data.firstname;
      }
    })
    .catch(err => console.error(err));
}

// 8. Mise à jour du Profil
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const newFirstname = document.getElementById('profile-firstname').value.trim();
  const newLastname  = document.getElementById('profile-lastname').value.trim();
  const newEmail     = document.getElementById('profile-email').value.trim();

  try {
    // Mettre à jour le prénom et le nom immédiatement
    await db.collection('users').doc(user.uid).update({
      firstname: newFirstname,
      lastname: newLastname,
      email: newEmail
    });

    // Vérifier si l'email a changé
    if (newEmail !== user.email) {
      // Envoyer un email de confirmation
      await user.verifyBeforeUpdateEmail(newEmail);
      showNotification("Verification Email Sent", "Please check your new email and confirm the change.");

      // Écouter les changements d'authentification pour mettre à jour Firestore après vérification
      const unsubscribe = auth.onAuthStateChanged(async (updatedUser) => {
        if (updatedUser && updatedUser.email === newEmail) {
          await db.collection('users').doc(updatedUser.uid).update({
            email: newEmail
          });
          showNotification("Profile updated", "Your email has been updated in the database.");
          unsubscribe(); // Arrêter l'écoute une fois la mise à jour terminée
        }
      });
    } else {
      showNotification("Profile updated", "Your profile has been successfully updated.");
    }

    // Mise à jour de l'affichage
    userFirstnameDisplay.textContent = newFirstname;
  } 
  catch (err) {
    console.error(err);
    showNotification("Erreur", err.message, 6000);
  }
});


// 9. Mise à jour du mot de passe
passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (newPassword !== confirmPassword) {
    showNotification("Error", "The passwords do not match.", 6000);
    return;
  }
  const user = auth.currentUser;
  if (user) {
    user.updatePassword(newPassword)
      .then(() => {
        showNotification("Password updated", "Your password has been successfully updated.");
        passwordForm.reset();
      })
      .catch(err => {
        console.error(err);
        showNotification("Error", err.message, 6000);
      });
  }
});

// 10. Chargement et affichage des favoris
function loadUserFavorites(user) {
  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const favorites = data.favorites || [];
        favCount.textContent = favorites.length;
        const favList = document.getElementById('favorites-list');
        favList.innerHTML = "";
        if (favorites.length === 0) {
          favList.innerHTML = "<li class='list-group-item'>Aucun article favori</li>";
        } else {
          favorites.forEach(article => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = article;
            favList.appendChild(li);
          });
        }
      }
    })
    .catch(err => console.error(err));
}

// 11. Déconnexion
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Fonction pour ajouter un favori à l'utilisateur connecté
function addFavorite(article) {
  const user = auth.currentUser;
  if (!user) {
    showNotification("Erreur", "Vous devez être connecté pour ajouter un favori.", 6000);
    return;
  }
  db.collection('users').doc(user.uid).update({
    favorites: firebase.firestore.FieldValue.arrayUnion(article)
  })
  .then(() => {
    showNotification("Favori ajouté", "L'article a été ajouté à vos favoris.");
    loadUserFavorites(user); // Recharge la liste après mise à jour
  })
  .catch(err => {
    console.error(err);
    showNotification("Erreur", err.message, 6000);
  });
}

/// 12. Chargement et affichage des avantages (points de fidélité)
function loadUserAdvantages(user) {
  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const points = data.points || 0;
        // Calcul du pourcentage de progression en fonction d'un maximum de 2500 points
        let percent = (points / 2800) * 100;
        if (percent > 100) percent = 100;
        document.getElementById('points-progress').style.width = percent + '%';
        // Affichage du nombre de coins
        const coinsDisplay = document.getElementById('coins-display');
        if (coinsDisplay) {
          coinsDisplay.textContent = points + " Coins";
        }
      }
    })
    .catch(err => console.error(err));
}
