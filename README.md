# 🏦 API Bancaire — ICT304

API REST Express.js pour le système de transaction bancaire (dépôt / retrait).

---

## ⚙️ Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
#    → Ouvrir MySQL et exécuter le fichier :
mysql -u root -p < database.sql

# 3. Configurer les variables d'environnement
#    → Éditer le fichier .env avec vos propres valeurs

# 4. Démarrer le serveur
node app.js
```

---

## 📡 Endpoints disponibles

### Authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter, obtenir un JWT | Non |

### Transactions

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/transactions/depot` | Effectuer un dépôt | JWT |
| POST | `/api/transactions/retrait` | Effectuer un retrait | JWT |

---

## 🧪 Exemples de requêtes (avec curl)

### 1. Créer un compte
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","email":"jean@email.com","mot_de_passe":"1234"}'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean@email.com","mot_de_passe":"1234"}'
```
→ Récupérer le `token` dans la réponse.

### 3. Effectuer un dépôt
```bash
curl -X POST http://localhost:3000/api/transactions/depot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{"compte_id":1,"montant":50000,"description":"Dépôt espèces"}'
```

### 4. Effectuer un retrait
```bash
curl -X POST http://localhost:3000/api/transactions/retrait \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{"compte_id":1,"montant":10000,"description":"Retrait guichet"}'
```

---

## 📁 Structure du projet

```
banking-api/
├── app.js                          # Point d'entrée
├── database.sql                    # Script création BDD MySQL
├── .env                            # Variables d'environnement
├── package.json
└── src/
    ├── config/
    │   └── db.js                   # Pool de connexion MySQL
    ├── middleware/
    │   └── auth.js                 # Vérification JWT
    ├── controllers/
    │   ├── authController.js       # register + login
    │   └── transactionController.js # depot + retrait
    └── routes/
        ├── auth.routes.js
        └── transaction.routes.js
```
