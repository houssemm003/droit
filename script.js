// Configuration - Clé API Gemini
const API_KEY = "AIzaSyCk7X-ivl1I7axQKeRbx8CjismHLMDjRSs";
const MODEL = "gemini-2.5-flash";

// Éléments DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // Envoyer avec Enter (sans Shift)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Bouton d'envoi
    sendButton.addEventListener('click', sendMessage);
    
    // Initialiser l'heure du message de bienvenue
    const welcomeTime = document.querySelector('.message-time');
    if (welcomeTime) {
        welcomeTime.textContent = getCurrentTime();
    }
});

// Fonction pour obtenir l'heure actuelle
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Fonction pour convertir le markdown basique en HTML
function formatMessage(content) {
    if (!content) return '';
    
    // Diviser en lignes pour traitement
    const lines = content.split('\n');
    const processedBlocks = [];
    let currentParagraph = [];
    let inList = false;
    let listType = null;
    let listItems = [];
    
    function flushParagraph() {
        if (currentParagraph.length > 0) {
            const paraText = currentParagraph.join(' ').trim();
            if (paraText) {
                processedBlocks.push(`<p>${paraText}</p>`);
            }
            currentParagraph = [];
        }
    }
    
    function flushList() {
        if (listItems.length > 0) {
            const listTag = listType === 'ol' ? 'ol' : 'ul';
            processedBlocks.push(`<${listTag}>${listItems.join('')}</${listTag}>`);
            listItems = [];
        }
        inList = false;
        listType = null;
    }
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Titres
        if (line.match(/^###\s+(.+)$/)) {
            flushParagraph();
            flushList();
            processedBlocks.push(`<h3>${line.replace(/^###\s+/, '')}</h3>`);
            continue;
        }
        if (line.match(/^##\s+(.+)$/)) {
            flushParagraph();
            flushList();
            processedBlocks.push(`<h2>${line.replace(/^##\s+/, '')}</h2>`);
            continue;
        }
        if (line.match(/^#\s+(.+)$/)) {
            flushParagraph();
            flushList();
            processedBlocks.push(`<h1>${line.replace(/^#\s+/, '')}</h1>`);
            continue;
        }
        
        // Listes numérotées
        const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (numberedMatch) {
            flushParagraph();
            if (!inList || listType !== 'ol') {
                flushList();
                inList = true;
                listType = 'ol';
            }
            listItems.push(`<li>${numberedMatch[2]}</li>`);
            continue;
        }
        
        // Listes à puces
        const bulletMatch = line.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
            flushParagraph();
            if (!inList || listType !== 'ul') {
                flushList();
                inList = true;
                listType = 'ul';
            }
            listItems.push(`<li>${bulletMatch[1]}</li>`);
            continue;
        }
        
        // Ligne vide - séparateur de paragraphe
        if (!line) {
            flushParagraph();
            flushList();
            continue;
        }
        
        // Ligne normale - ajouter au paragraphe courant
        flushList();
        currentParagraph.push(line);
    }
    
    // Flush ce qui reste
    flushParagraph();
    flushList();
    
    // Joindre tous les blocs
    let html = processedBlocks.join('');
    
    // Convertir le gras **texte** ou __texte__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Convertir l'italique *texte* (mais pas si c'est déjà du gras)
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>');
    
    return html;
}

// Fonction pour ajouter un message à l'interface
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (isUser) {
        avatar.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        avatar.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
        `;
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Pour les messages utilisateur, texte simple
    // Pour les messages bot, formatage HTML
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    if (isUser) {
        messageText.textContent = content;
    } else {
        messageText.innerHTML = formatMessage(content);
    }
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Fonction pour afficher l'indicateur de frappe
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
        </svg>
    `;
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Fonction pour supprimer l'indicateur de frappe
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Fonction pour faire défiler vers le bas
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour envoyer un message
async function sendMessage() {
    const text = userInput.value.trim();
    
    if (!text) return;
    
    // Désactiver l'input et le bouton
    userInput.disabled = true;
    sendButton.disabled = true;
    
    // Ajouter le message de l'utilisateur
    addMessage(text, true);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Afficher l'indicateur de frappe
    showTypingIndicator();
    
    // Appeler Gemini
    await askGemini(text);
}

// Fonction pour interroger l'API Gemini
async function askGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // Ajouter des instructions pour un formatage amélioré
    const enhancedPrompt = `Tu es un assistant juridique expert. Réponds de manière claire, structurée et professionnelle. Utilise le formatage markdown pour organiser tes réponses :
- Utilise ## pour les titres principaux et ### pour les sous-titres
- Utilise **texte** pour mettre en gras les points importants
- Utilise des listes à puces (-) ou numérotées (1.) pour organiser l'information
- Structure tes réponses avec des paragraphes clairs

Question : ${prompt}`;

    const body = {
        contents: [
            {
                parts: [{ text: enhancedPrompt }]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log("API Response:", data);

        // Supprimer l'indicateur de frappe
        removeTypingIndicator();

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const botReply = data.candidates[0].content.parts[0].text;
            addMessage(botReply, false);
        } else {
            // Gestion des erreurs de l'API
            let errorMessage = "❌ Aucun texte retourné.";
            if (data.error) {
                errorMessage = `❌ Erreur: ${data.error.message || 'Erreur inconnue'}`;
            }
            addMessage(errorMessage, false);
        }

    } catch (error) {
        console.error(error);
        removeTypingIndicator();
        addMessage("❌ Erreur lors de la requête. Vérifiez votre connexion internet.", false);
    } finally {
        // Réactiver l'input et le bouton
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}
