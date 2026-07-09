const fs = require('fs');
const path = require('path');

const directory = './src';

const fixTheme = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. Fix ReturnGiftsPage white gradient overlay
    if (filePath.endsWith('ReturnGiftsPage.jsx')) {
        content = content.replace(/from-\[\#FFFFFF\] via-\[\#FFFFFF\]\/40 to-\[\#FFFFFF\]\/80/g, 'from-[#000000] via-[#000000]/60 to-[#000000]/80');
    }

    // 2. Upgrade bright yellow gold to premium metallic gold
    content = content.replace(/#FFD700/gi, '#D4AF37');

    // 3. Fix the 'brown' color (#5C1D24) which is hard to read on black
    // If it's a background, we make it premium gold with black text
    content = content.replace(/bg-\[\#5C1D24\] text-white/gi, 'bg-[#D4AF37] text-[#000000]');
    content = content.replace(/bg-\[\#5C1D24\]/gi, 'bg-[#D4AF37]');
    
    // If it's text, we make it premium gold
    content = content.replace(/text-\[\#5C1D24\]/gi, 'text-[#D4AF37]');
    
    // If it's a border, we make it premium gold
    content = content.replace(/border-\[\#5C1D24\]/gi, 'border-[#D4AF37]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed theme in:', filePath);
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
            fixTheme(filePath);
        }
    }
};

walkSync(directory);
console.log('Fixed premium gold and gradients successfully!');
