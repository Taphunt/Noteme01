// Notepad Application Logic

// DOM Elements
const mainScreen = document.getElementById('main-screen');
const editorScreen = document.getElementById('editor-screen');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');
const addNoteBtn = document.getElementById('add-note-btn');
const backButton = document.getElementById('back-btn');
const saveButton = document.getElementById('save-btn');
const favoriteButton = document.getElementById('favorite-btn');
const deleteButton = document.getElementById('delete-btn');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const allNotesTab = document.getElementById('all-notes-tab');
const favoritesTab = document.getElementById('favorites-tab');
const aiSummaryBtn = document.getElementById('ai-summary-btn');
const aiSummaryContainer = document.getElementById('ai-summary-container');
const aiSummaryContent = document.getElementById('ai-summary-content');
const aiSummaryLoading = document.getElementById('ai-summary-loading');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleEditor = document.getElementById('theme-toggle-editor');

// State
let notes = [];
let currentNoteId = null;
let currentView = 'all'; // 'all' or 'favorites'
let isFavoriteMode = false;
let autoSaveTimer = null;
let currentTheme = 'system';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderNotes();
    setupEventListeners();
    loadPreferences();
});

// Load notes from localStorage
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    } else {
        // Add sample notes for demonstration
        notes = [
            {
                id: Date.now().toString(),
                title: 'Welcome to Notepad',
                content: 'This is your first note. You can edit or delete it.\n\nFeatures:\n- Auto-saving (always on)\n- Dark mode with system detection\n- AI summaries\n- Favorites',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                favorite: false
            }
        ];
        saveNotes();
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load user preferences
function loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    
    applyTheme();
    updateThemeToggle();
}

// Save user preferences
function savePreferences() {
    localStorage.setItem('theme', currentTheme);
}

// Render notes based on current view
function renderNotes() {
    notesContainer.innerHTML = '';
    
    // Filter notes based on current view and search
    let filteredNotes = notes;
    
    if (currentView === 'favorites') {
        filteredNotes = notes.filter(note => note.favorite);
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort notes by updated date (newest first)
    filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = '<p class="empty-message">No notes found</p>';
        return;
    }
    
    filteredNotes.forEach(note => {
        const noteElement = createNoteCard(note);
        notesContainer.appendChild(noteElement);
    });
}

// Create a note card element
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.id = note.id;
    
    const header = document.createElement('div');
    header.className = 'note-card-header';
    
    const title = document.createElement('div');
    title.className = 'note-card-title';
    title.textContent = note.title || 'Untitled';
    
    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fas fa-heart note-card-favorite';
    favoriteIcon.style.display = note.favorite ? 'block' : 'none';
    
    header.appendChild(title);
    header.appendChild(favoriteIcon);
    
    const content = document.createElement('div');
    content.className = 'note-card-content';
    content.textContent = note.content || 'No content';
    
    const footer = document.createElement('div');
    footer.className = 'note-card-footer';
    
    const date = document.createElement('span');
    const noteDate = new Date(note.updatedAt);
    date.textContent = noteDate.toLocaleDateString();
    
    footer.appendChild(date);
    
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);
    
    // Add click event to open note in editor
    card.addEventListener('click', () => openNoteEditor(note.id));
    
    return card;
}

// Set up event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', renderNotes);
    
    // Add note button
    addNoteBtn.addEventListener('click', () => openNoteEditor());
    
    // Back button
    backButton.addEventListener('click', () => {
        saveNoteIfChanged();
        mainScreen.classList.remove('hidden');
        editorScreen.classList.add('hidden');
        renderNotes();
    });
    
    // Save button
    saveButton.addEventListener('click', saveNote);
    
    // Favorite button
    favoriteButton.addEventListener('click', toggleFavorite);
    
    // Delete button
    deleteButton.addEventListener('click', deleteNote);
    
    // AI Summary button
    aiSummaryBtn.addEventListener('click', generateAISummary);
    
    // Tab navigation
    allNotesTab.addEventListener('click', () => {
        currentView = 'all';
        allNotesTab.classList.add('active');
        favoritesTab.classList.remove('active');
        renderNotes();
    });
    
    favoritesTab.addEventListener('click', () => {
        currentView = 'favorites';
        favoritesTab.classList.add('active');
        allNotesTab.classList.remove('active');
        renderNotes();
    });
    

    
    // Theme toggle with Font Awesome icon
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Editor theme toggle
    if (themeToggleEditor) {
        themeToggleEditor.addEventListener('click', () => {
            toggleTheme();
        });
    }
    
    // Auto save functionality (always active)
    noteTitle.addEventListener('input', scheduleAutoSave);
    noteContent.addEventListener('input', scheduleAutoSave);
    
    // Theme toggle (using system preference)
    applyTheme();
    updateThemeToggle();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        applyTheme();
        updateThemeToggle();
    });
}

// Apply theme based on user selection or system preference
function applyTheme() {
    let isDarkMode;
    
    if (currentTheme === 'system') {
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
        isDarkMode = currentTheme === 'dark';
    }
    
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Update favorite button icon based on theme
    if (currentNoteId) {
        const note = notes.find(n => n.id === currentNoteId);
        if (note) {
            updateFavoriteButton(note.favorite);
        }
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    // Determine the new theme based on current state
    if (currentTheme === 'dark') {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }
    
    // Save preferences and apply theme
    savePreferences();
    applyTheme();
    updateThemeToggle();
}

// Update theme toggle switch based on current theme
function updateThemeToggle() {
    // Update both theme toggle buttons
    let iconHtml, isDarkMode;
    
    if (currentTheme === 'system') {
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
        isDarkMode = currentTheme === 'dark';
    }
    
    // Set icon based on theme
    if (isDarkMode) {
        iconHtml = '<i class="fas fa-sun"></i>';
        themeToggle.classList.add('dark-mode');
        if (themeToggleEditor) themeToggleEditor.classList.add('dark-mode');
    } else {
        iconHtml = '<i class="fas fa-moon"></i>';
        themeToggle.classList.remove('dark-mode');
        if (themeToggleEditor) themeToggleEditor.classList.remove('dark-mode');
    }
    
    // Update both toggle buttons
    themeToggle.innerHTML = iconHtml;
    if (themeToggleEditor) themeToggleEditor.innerHTML = iconHtml;
}

// Schedule auto save
function scheduleAutoSave() {
    // Clear existing timer
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }
    
    // Set new timer (1 second delay for smoother experience)
    autoSaveTimer = setTimeout(saveNote, 1000);
}

// Save note if content has changed
function saveNoteIfChanged() {
    // Clear any pending auto-save
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
    }
    
    // Save immediately if there are unsaved changes
    saveNote();
}

// Open note editor (create new or edit existing)
function openNoteEditor(noteId = null) {
    mainScreen.classList.add('hidden');
    editorScreen.classList.remove('hidden');
    
    if (noteId) {
        // Edit existing note
        currentNoteId = noteId;
        const note = notes.find(n => n.id === noteId);
        if (note) {
            noteTitle.value = note.title || '';
            noteContent.value = note.content || '';
            updateFavoriteButton(note.favorite);
        }
    } else {
        // Create new note
        currentNoteId = null;
        noteTitle.value = '';
        noteContent.value = '';
        updateFavoriteButton(false);
    }
    
    // Hide AI summary container when opening editor
    aiSummaryContainer.classList.add('hidden');
    
    // Focus title field
    noteTitle.focus();
}

// Save note
function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    // Don't save if both title and content are empty and it's a new note
    if (!title && !content && !currentNoteId) {
        return;
    }
    
    const now = new Date().toISOString();
    
    if (currentNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex !== -1) {
            // Only update if content has changed
            if (notes[noteIndex].title !== title || notes[noteIndex].content !== content) {
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
                notes[noteIndex].updatedAt = now;
                saveNotes();
            }
        }
    } else {
        // Create new note
        const newNote = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: now,
            updatedAt: now,
            favorite: false
        };
        notes.unshift(newNote);
        currentNoteId = newNote.id;
        saveNotes();
    }
}

// Toggle favorite status
function toggleFavorite() {
    if (!currentNoteId) return;
    
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        note.favorite = !note.favorite;
        note.updatedAt = new Date().toISOString();
        saveNotes();
        updateFavoriteButton(note.favorite);
        
        // Update the note card in the main view if it's visible
        if (!editorScreen.classList.contains('hidden')) {
            renderNotes();
        }
    }
}

// Update favorite button appearance
function updateFavoriteButton(isFavorite) {
    if (isFavorite) {
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteButton.style.color = '#FFB4AB';
    } else {
        favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
        favoriteButton.style.color = '';
    }
}

// Delete note
function deleteNote() {
    if (!currentNoteId) {
        // If creating a new note, just go back
        mainScreen.classList.remove('hidden');
        editorScreen.classList.add('hidden');
        return;
    }
    
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== currentNoteId);
        saveNotes();
        mainScreen.classList.remove('hidden');
        editorScreen.classList.add('hidden');
        renderNotes();
    }
}

// Generate AI summary
function generateAISummary() {
    const content = noteContent.value.trim();
    
    if (!content) {
        alert('Please enter some content to summarize.');
        return;
    }
    
    // Show loading indicator
    aiSummaryContainer.classList.remove('hidden');
    aiSummaryContent.classList.add('hidden');
    aiSummaryLoading.classList.remove('hidden');
    
    // Simulate AI processing delay
    setTimeout(() => {
        // Generate a simple summary (in a real app, this would call an AI API)
        const summary = generateSimpleSummary(content);
        
        // Display the summary
        aiSummaryContent.innerHTML = summary;
        aiSummaryContent.classList.remove('hidden');
        aiSummaryLoading.classList.add('hidden');
    }, 1500);
}

// Generate a simple summary (placeholder for actual AI functionality)
function generateSimpleSummary(content) {
    // Split content into sentences
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
        return "No content to summarize.";
    }
    
    // For a simple summary, we'll take the first few sentences
    const summarySentences = sentences.slice(0, Math.min(3, sentences.length));
    
    // Create bullet points for key points
    const keyPoints = summarySentences.map(sentence => 
        `<li>${sentence.trim()}</li>`
    ).join('');
    
    return `
        <p><strong>Summary:</strong> This note contains ${sentences.length} sentences.</p>
        <p><strong>Key Points:</strong></p>
        <ul>${keyPoints}</ul>
        <p><em>Note: This is a simulated summary. In a production app, this would connect to an AI service.</em></p>
    `;
}