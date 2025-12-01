#!/usr/bin/env node

// Simple build script for cross-platform deployment
const fs = require('fs');
const path = require('path');

console.log('Notepad App Build Script');
console.log('========================');

// Create distribution directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('Created dist directory');
}

// Files to copy to distribution
const filesToCopy = [
    'index.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'sw.js'
];

// Copy files
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file}`);
    }
});

console.log('\nBuild completed successfully!');
console.log('Distribution files are in the "dist" folder.');

console.log('\nDeployment Options:');
console.log('1. Web: Upload the contents of the "dist" folder to any static hosting service');
console.log('2. Mobile: Use Cordova/PhoneGap to package as a native app');
console.log('3. Desktop: Use Electron to create a desktop application');