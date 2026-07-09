const fs = require('fs');
const path = require('path');

const directory = './src';

const replaceColors = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Dark Mode Backgrounds
    content = content.replace(/bg-gray-50\b/g, 'bg-[#111111]');
    content = content.replace(/bg-gray-100\b/g, 'bg-[#1A1A1A]');
    content = content.replace(/bg-gray-200\b/g, 'bg-[#222222]');
    content = content.replace(/bg-slate-50\b/g, 'bg-[#111111]');
    content = content.replace(/bg-zinc-50\b/g, 'bg-[#111111]');
    content = content.replace(/border-gray-100\b/g, 'border-[#333333]');
    content = content.replace(/border-gray-200\b/g, 'border-[#444444]');
    
    // Text colors (invert dark to light)
    content = content.replace(/text-gray-900\b/g, 'text-gray-100');
    content = content.replace(/text-gray-800\b/g, 'text-gray-200');
    content = content.replace(/text-gray-700\b/g, 'text-gray-300');
    content = content.replace(/text-gray-600\b/g, 'text-gray-400');
    content = content.replace(/text-black\b/g, 'text-white');

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
console.log('Fixed remaining light backgrounds successfully!');
