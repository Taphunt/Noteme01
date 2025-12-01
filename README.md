# Cross-Platform Notepad App

A modern, cross-platform notepad application built with web technologies and Material Design 3.

## Features

- **Cross-Platform**: Works on web, mobile, and desktop
- **Material Design 3**: Follows the latest Material Design guidelines
- **Dark/Light/System Mode**: Automatically adapts to system theme or user preference
- **Note Management**: Create, edit, delete, and favorite notes
- **Search Functionality**: Quickly find notes by title or content
- **Auto-Save**: Automatically saves notes as you type (always enabled)
- **AI Summary**: Generates summaries of your notes (simulated)
- **Offline Support**: PWA capabilities for offline use
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Enhanced UI with fluid transitions

## Technologies Used

- HTML5
- CSS3 (with Material Design 3)
- JavaScript (ES6+)
- Font Awesome Icons
- Service Workers for offline support
- Web App Manifest for PWA installation

## Installation

1. Clone or download this repository
2. Open `index.html` in a web browser, or
3. Serve the project using any local server

### Using Node.js (if available)

```bash
npm install
npm start
```

## Deployment Options

### Web
- Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

### Mobile
- Package as a PWA (Progressive Web App)
- Use Cordova/PhoneGap to create native mobile apps

### Desktop
- Use Electron to create desktop applications
- Use PWA installation on supported platforms

## Project Structure

```
notepad-crossplatform/
├── index.html          # Main HTML file
├── styles.css          # Material Design 3 styling
├── script.js           # Application logic
├── manifest.json       # PWA manifest file
├── sw.js               # Service worker for offline support
├── package.json        # Project metadata and scripts
├── build.js            # Build script for distribution
├── electron-main.js    # Electron entry point for desktop
├── electron-package.json # Electron package configuration
├── config.xml          # Cordova configuration for mobile
└── README.md           # This file
```

## Usage

1. **Creating a Note**: Click the "+" FAB button
2. **Editing a Note**: Click on any note in the list
3. **Favoriting a Note**: Click the heart icon in the editor
4. **Searching Notes**: Use the search bar at the top
5. **Switching Views**: Use the bottom navigation to switch between "All Notes" and "Favorites"
6. **Auto-Save**: Always active, automatically saves as you type
7. **Theme Selection**: Choose between Light, Dark, or System theme
8. **AI Summary**: Click the magic wand icon to generate a summary of your note

## Packaging for Different Platforms

### Web Deployment
1. Run `node build.js` to create the distribution files
2. Upload the contents of the `dist` folder to any static hosting service

### Desktop Application (Electron)
1. Install Electron globally: `npm install -g electron`
2. Run the app: `electron .`
3. To build for distribution:
   - Install electron-builder: `npm install --save-dev electron-builder`
   - Run: `npm run dist`

### Mobile Application (Cordova)
1. Install Cordova globally: `npm install -g cordova`
2. Create a new Cordova project: `cordova create notepad-mobile com.developer.notepad Notepad`
3. Copy the contents of the `dist` folder to the `www` folder in your Cordova project
4. Add platforms: `cordova platform add android ios`
5. Build: `cordova build`

## Customization

### Theme Colors
The app uses Material Design 3 color system. Colors can be customized in `styles.css`:
- Light theme colors: `--primary`, `--on-primary`, etc.
- Dark theme colors: `--dark-primary`, `--dark-on-primary`, etc.

### Adding Features
To extend functionality:
1. Modify `script.js` for application logic
2. Update `styles.css` for UI changes
3. Add new elements to `index.html` as needed

## License

MIT License - feel free to use and modify this project as needed.