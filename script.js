// Variables globales
let sentimentChart;

// Données de films simulées pour la démo
const movieDatabase = [
    // Films d'action
    {
        title: "The Dark Knight",
        year: 2008,
        plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his life.",
        genres: ["Action", "Crime", "Drama"],
        sentiment: { sentiment: 'negative', score: -0.4 }
    },
    {
        title: "Mad Max: Fury Road",
        year: 2015,
        plot: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
        genres: ["Action", "Adventure", "Sci-Fi"],
        sentiment: { sentiment: 'positive', score: 0.7 }
    },
    {
        title: "John Wick",
        year: 2014,
        plot: "An ex-hit-man comes out of retirement to track down the gangsters that took everything from him. With New York City as his bullet-riddled playground, JOHN WICK embarks on a merciless rampage.",
        genres: ["Action", "Crime", "Thriller"],
        sentiment: { sentiment: 'negative', score: -0.5 }
    },
    // Comédies
    {
        title: "The Grand Budapest Hotel",
        year: 2014,
        plot: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
        genres: ["Comedy", "Drama"],
        sentiment: { sentiment: 'positive', score: 0.8 }
    },
    {
        title: "Superbad",
        year: 2007,
        plot: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
        genres: ["Comedy"],
        sentiment: { sentiment: 'positive', score: 0.6 }
    },
    {
        title: "The Hangover",
        year: 2009,
        plot: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend.",
        genres: ["Comedy"],
        sentiment: { sentiment: 'neutral', score: 0.2 }
    },
    // Drames
    {
        title: "The Shawshank Redemption",
        year: 1994,
        plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genres: ["Drama"],
        sentiment: { sentiment: 'positive', score: 0.9 }
    },
    {
        title: "Forrest Gump",
        year: 1994,
        plot: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        genres: ["Drama", "Romance"],
        sentiment: { sentiment: 'positive', score: 0.7 }
    },
    {
        title: "Schindler's List",
        year: 1993,
        plot: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        genres: ["Biography", "Drama", "History"],
        sentiment: { sentiment: 'negative', score: -0.6 }
    },
    // Horreur
    {
        title: "Get Out",
        year: 2017,
        plot: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
        genres: ["Horror", "Mystery", "Thriller"],
        sentiment: { sentiment: 'negative', score: -0.7 }
    },
    {
        title: "A Quiet Place",
        year: 2018,
        plot: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
        genres: ["Drama", "Horror", "Sci-Fi"],
        sentiment: { sentiment: 'negative', score: -0.5 }
    },
    {
        title: "Hereditary",
        year: 2018,
        plot: "A grieving family is haunted by tragedy and disturbing secrets.",
        genres: ["Drama", "Horror", "Mystery"],
        sentiment: { sentiment: 'negative', score: -0.8 }
    },
    {
        title: "The Babadook",
        year: 2014,
        plot: "A single mother and her son fall into a deep well of paranoia when a disturbing storybook called 'Mister Babadook' manifests in their home.",
        genres: ["Drama", "Horror", "Thriller"],
        sentiment: { sentiment: 'negative', score: -0.75 }
    },
    {
        title: "Midsommar",
        year: 2019,
        plot: "A couple travels to Sweden to visit a rural hometown's fabled mid-summer festival, but what begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition.",
        genres: ["Drama", "Horror", "Mystery"],
        sentiment: { sentiment: 'negative', score: -0.85 }
    },
    {
        title: "The Witch",
        year: 2015,
        plot: "In 1630s New England, panic and despair envelop a farmer's family when their youngest son vanishes and the family suspects supernatural forces.",
        genres: ["Horror", "Mystery", "Thriller"],
        sentiment: { sentiment: 'negative', score: -0.9 }
    },
    {
        title: "It Follows",
        year: 2014,
        plot: "A young woman is followed by an unknown supernatural force after a sexual encounter, forcing her into a haunting cycle of paranoia and fear.",
        genres: ["Horror", "Mystery", "Thriller"],
        sentiment: { sentiment: 'negative', score: -0.65 }
    }

];

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
        // Essayer d'abord l'API réelle
        const response = await fetch('/api/sentiment-stats');
        if (response.ok) {
            const stats = await response.json();
            updateStatsDisplay(stats);
            createSentimentChart(stats);
            return;
        }
    } catch (error) {
        console.log('API non disponible, utilisation des données simulées');
    }
    
    // Fallback : calculer les stats depuis les données simulées
    const stats = calculateStatsFromDatabase();
    updateStatsDisplay(stats);
    createSentimentChart(stats);
}

// Calculer les statistiques depuis la base de données simulée
function calculateStatsFromDatabase() {
    let positive = 0, negative = 0, neutral = 0;
    
    movieDatabase.forEach(movie => {
        if (movie.sentiment.sentiment === 'positive') positive++;
        else if (movie.sentiment.sentiment === 'negative') negative++;
        else neutral++;
    });
    
    return {
        total: movieDatabase.length,
        positive,
        negative,
        neutral
    };
}

// Mettre à jour l'affichage des statistiques
function updateStatsDisplay(stats) {
    document.getElementById('totalMovies').textContent = stats.total;
    document.getElementById('positiveCount').textContent = stats.positive;
    document.getElementById('negativeCount').textContent = stats.negative;
    document.getElementById('neutralCount').textContent = stats.neutral;
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
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!searchTerm) {
        loadRandomMovies();
        return;
    }
    
    // Essayer d'abord l'API réelle
    try {
        const response = await fetch(`/api/movies?search=${encodeURIComponent(searchTerm)}&limit=12`);
        if (response.ok) {
            const movies = await response.json();
            if (movies.length > 0) {
                displayMoviesWithLoading(movies);
                return;
            }
        }
    } catch (error) {
        console.log('API non disponible, utilisation de la recherche simulée');
    }
    
    // Fallback : recherche dans les données simulées
    const filteredMovies = movieDatabase.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) ||
               movie.plot.toLowerCase().includes(searchTerm) ||
               movie.genres.some(genre => genre.toLowerCase().includes(searchTerm));
    });
    
    displayMoviesWithLoading(filteredMovies, searchTerm);
}

// Charger des films aléatoires
async function loadRandomMovies() {
    // Essayer d'abord l'API réelle
    try {
        const response = await fetch('/api/movies?limit=12');
        if (response.ok) {
            const movies = await response.json();
            if (movies.length > 0) {
                displayMoviesWithLoading(movies);
                return;
            }
        }
    } catch (error) {
        console.log('API non disponible, utilisation des données simulées');
    }
    
    // Fallback : sélection aléatoire depuis les données simulées
    const shuffled = [...movieDatabase].sort(() => Math.random() - 0.5);
    const randomMovies = shuffled.slice(0, 8);
    displayMoviesWithLoading(randomMovies);
}

// Afficher les films avec animation de chargement
function displayMoviesWithLoading(movies, searchTerm = '') {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const moviesGrid = document.getElementById('moviesGrid');
    
    // Afficher le spinner
    loadingSpinner.style.display = 'block';
    moviesGrid.innerHTML = '';
    
    // Simuler un délai de chargement pour l'effet
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        
        if (movies.length === 0) {
            moviesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>Aucun film trouvé pour "${searchTerm}" 😕</h3>
                    <p>Essayez "action", "comedy", "drama" ou "horror"</p>
                </div>
            `;
            return;
        }
        
        displayMovies(movies);
    }, 800);
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
