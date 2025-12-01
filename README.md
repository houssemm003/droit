# Assistant Juridique - ChatBot

Un chatbot juridique moderne avec interface utilisateur élégante, intégrant l'API Gemini pour fournir des réponses structurées sur le droit.

## 🎨 Caractéristiques

- **Design moderne** avec thème juridique (palette bleu foncé et or)
- **Interface responsive** pour mobile et desktop
- **Formatage avancé** des réponses (titres, listes, paragraphes)
- **Intégration Gemini API** pour des réponses intelligentes
- **Indicateur de frappe** en temps réel
- **Expérience utilisateur fluide**

## 📁 Structure du projet

```
chat/
├── index.html    # Structure HTML du chatbot
├── styles.css    # Styles avec thème juridique
├── script.js     # Logique du chat et intégration Gemini
└── README.md     # Documentation
```

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/chat.git
cd chat
```

2. Configurez votre clé API Gemini dans `script.js` :
```javascript
const API_KEY = "VOTRE_CLE_API_ICI";
```

3. Ouvrez `index.html` dans votre navigateur.

## ⚙️ Configuration

### Clé API Gemini

1. Obtenez une clé API depuis [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Remplacez `VOTRE_CLE_API_ICI` dans `script.js` par votre clé

### Modèle

Par défaut, le projet utilise `gemini-2.5-flash`. Vous pouvez changer le modèle dans `script.js` :

```javascript
const MODEL = "gemini-2.5-flash"; // ou "gemini-pro", etc.
```

## 📝 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Posez votre question juridique dans le champ de saisie
3. Appuyez sur Entrée ou cliquez sur le bouton d'envoi
4. Recevez une réponse formatée et structurée

## 🎨 Personnalisation

### Couleurs

Les couleurs peuvent être modifiées dans `styles.css` via les variables CSS :

```css
:root {
    --primary-dark: #1a2332;
    --primary-blue: #2c3e50;
    --accent-gold: #d4af37;
    /* ... */
}
```

### Formatage

Le formatage markdown est automatiquement converti en HTML. Les réponses supportent :
- Titres (`#`, `##`, `###`)
- Gras (`**texte**`)
- Italique (`*texte*`)
- Listes numérotées (`1. item`)
- Listes à puces (`- item`)

## ⚠️ Avertissement

Les réponses sont fournies à titre informatif et ne constituent pas un conseil juridique personnalisé. Pour des questions spécifiques, consultez un professionnel du droit.

## 📄 Licence

Ce projet est sous licence MIT.

## 👤 Auteur

Votre nom

---

**Note** : N'oubliez pas de ne jamais commiter votre clé API dans le dépôt public. Utilisez un fichier `.env` ou des variables d'environnement pour la production.

