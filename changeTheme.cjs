const fs = require('fs');
const path = require('path');

const directory = './src';

const replaceColors = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Dark Mode Background
    content = content.replace(/#FDFBF7/gi, '#000000');
    content = content.replace(/bg-white/g, 'bg-[#000000]');
    
    // Text and borders (invert dark to light)
    content = content.replace(/#1A1A1A/gi, '#FFFFFF');
    content = content.replace(/text-gray-900/g, 'text-gray-100');
    content = content.replace(/text-gray-800/g, 'text-gray-200');
    content = content.replace(/text-black/g, 'text-white');
    
    // Accent Colors to Vibrant Gold
    content = content.replace(/#C5A880/gi, '#FFD700');
    content = content.replace(/#8C7C70/gi, '#D4AF37');
    content = content.replace(/#2B3FE7/gi, '#FFD700'); // blue to gold
    content = content.replace(/bg-blue-600/g, 'bg-[#D4AF37]');
    content = content.replace(/text-blue-600/g, 'text-[#FFD700]');

    // Specific text update if needed
    content = content.replace(/VEDHIKA & CO\./g, 'VEDHIKA BRAND');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated:', filePath);
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
            replaceColors(filePath);
        }
    }
};

walkSync(directory);
console.log('Theme changed to Black & Gold successfully!');
