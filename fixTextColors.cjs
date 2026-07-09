const fs = require('fs');
const path = require('path');

const directory = './src';

const fixTextColors = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Fix the dark gray texts that are hard to read on a dark background
    content = content.replace(/text-\[\#4E4E4E\]/g, 'text-white/60');
    content = content.replace(/text-\[\#333333\]/g, 'text-white/60');
    content = content.replace(/border-\[\#EBE6DD\]/g, 'border-white/10');
    content = content.replace(/border-\[\#EBE6DD\]\/60/g, 'border-white/10');
    
    // Some stray Tailwind gray text classes that might have been missed
    content = content.replace(/text-gray-900(?!\/)/g, 'text-gray-100');
    content = content.replace(/text-gray-800(?!\/)/g, 'text-gray-200');
    content = content.replace(/text-gray-700(?!\/)/g, 'text-gray-300');
    content = content.replace(/text-gray-600(?!\/)/g, 'text-gray-400');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed text colors in:', filePath);
    }
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkSync(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
            fixTextColors(filePath);
        }
    }
};

walkSync(directory);
console.log('Fixed dark text colors successfully!');
