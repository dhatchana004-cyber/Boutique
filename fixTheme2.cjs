const fs = require('fs');
const path = require('path');

const directory = './src';

const fixMistakes = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Fix the accidentally inverted backgrounds
    // We want to replace bg-[#FFFFFF] when it's used as a solid block background (not /5 or /10 opacity)
    content = content.replace(/bg-\[\#FFFFFF\](?!(\/5|\/10|\/20))/g, 'bg-[#111111]');
    
    // Fix text colors that were made black
    content = content.replace(/text-\[\#000000\](?!\/)/g, 'text-[#FFFFFF]');
    content = content.replace(/text-\[\#000000\]\/60/g, 'text-[#FFFFFF]/60');
    content = content.replace(/text-\[\#000000\]\/30/g, 'text-[#FFFFFF]/30');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed:', filePath);
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
            fixMistakes(filePath);
        }
    }
};

walkSync(directory);
console.log('Fixed inverted backgrounds and text successfully!');
