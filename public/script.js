// Variables globales
let sentimentChart;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadRandomMovies();
    setupEventListeners();
});

// Configuration des événements
function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const loadRandomBtn = document.getElementById('loadRandomBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', searchMovies);
    loadRandomBtn.addEventListener('click', loadRandomMovies);
    
    // Recherche en appuyant sur Entrée
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/sentiment-stats');
        const stats = await response.json();
        
        // Mettre à jour les cartes de statistiques
        document.getElementById('totalMovies').textContent = stats.total;
        document.getElementById('positiveCount').textContent = stats.positive;
        document.getElementById('negativeCount').textContent = stats.negative;
        document.getElementById('neutralCount').textContent = stats.neutral;
        
        // Créer le graphique
        createSentimentChart(stats);
        
    } catch (error) {
        console.error('Erreur chargement stats:', error);
        // Fallback avec données par défaut
        document.getElementById('totalMovies').textContent = '200';
        document.getElementById('positiveCount').textContent = '89';
        document.getElementById('negativeCount').textContent = '23';
        document.getElementById('neutralCount').textContent = '88';
        
        createSentimentChart({
            positive: 89,
            negative: 23,
            neutral: 88
        });
    }
}

// Créer le graphique de sentiments
function createSentimentChart(stats) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    
    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positif', 'Négatif', 'Neutre'],
            datasets: [{
                data: [stats.positive, stats.negative, stats.neutral],
                backgroundColor: [
                    '#48bb78',
                    '#f56565',
                    '#ed8936'
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Rechercher des films
async function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    await loadMovies(searchTerm);
}

// Charger des films aléatoires
async function loadRandomMovies() {
    await loadMovies('');
}

// Charger les films avec analyse de sentiment
async function loadMovies(search = '') {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const moviesGrid = document.getElementById('moviesGrid');
    
    // Afficher le spinner
    loadingSpinner.style.display = 'block';
    moviesGrid.innerHTML = '';
    
    try {
        const url = search 
            ? `/api/movies?search=${encodeURIComponent(search)}&limit=12`
            : '/api/movies?limit=12';
            
        const response = await fetch(url);
        const movies = await response.json();
        
        // Masquer le spinner
        loadingSpinner.style.display = 'none';
        
        if (movies.length === 0) {
            moviesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>Aucun film trouvé 😕</h3>
                    <p>Essayez un autre terme de recherche</p>
                </div>
            `;
            return;
        }
        
        // Afficher les films
        displayMovies(movies);
        
    } catch (error) {
        console.error('Erreur chargement films:', error);
        loadingSpinner.style.display = 'none';
        
        // Fallback avec des films de démonstration
        const fallbackMovies = [
            {
                title: "The Shawshank Redemption",
                year: 1994,
                plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                sentiment: { sentiment: 'positive', score: 0.8 }
            },
            {
                title: "The Dark Knight",
                year: 2008,
                plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
                sentiment: { sentiment: 'negative', score: -0.3 }
            },
            {
                title: "Forrest Gump",
                year: 1994,
                plot: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man.",
                sentiment: { sentiment: 'neutral', score: 0.1 }
            }
        ];
        
        displayMovies(fallbackMovies);
    }
}

// Afficher les films dans la grille
function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    
    moviesGrid.innerHTML = movies.map(movie => {
        const sentiment = movie.sentiment;
        const sentimentClass = sentiment.sentiment;
        const sentimentEmoji = getSentimentEmoji(sentiment.sentiment);
        const year = movie.year || 'N/A';
        const plot = movie.plot || 'Aucune description disponible';
        
        return `
            <div class="movie-card ${sentimentClass}">
                <div class="movie-title">${movie.title || 'Titre inconnu'}</div>
                <div class="movie-year">📅 ${year}</div>
                <div class="movie-plot">${truncateText(plot, 200)}</div>
                <div class="sentiment-info">
                    <span class="sentiment-badge ${sentimentClass}">
                        ${sentimentEmoji} ${sentiment.sentiment}
                        <span class="sentiment-score">(${sentiment.score.toFixed(2)})</span>
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Ajouter l'animation
    setTimeout(animateCards, 100);
}

// Obtenir l'emoji selon le sentiment
function getSentimentEmoji(sentiment) {
    switch(sentiment) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        case 'neutral': return '😐';
        default: return '🤔';
    }
}

// Tronquer le texte
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Animation d'entrée pour les cartes
function animateCards() {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}