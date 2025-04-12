// cache-buster.js
// This script updates version numbers in key files to force cache busting

const fs = require('fs');
const path = require('path');

// Generate a unique timestamp for this build
const timestamp = new Date().getTime();
console.log(`Generating cache-busting timestamp: ${timestamp}`);

// Function to update file content with the new timestamp
function updateFile(filePath, replacements) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ pattern, replacement }) => {
      // Replace the pattern with the replacement (including the timestamp)
      content = content.replace(pattern, replacement.replace('{{TIMESTAMP}}', timestamp));
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath} with new cache-busting timestamp`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Files to update
const filesToUpdate = [
  {
    path: path.join(__dirname, 'index.html'),
    replacements: [
      {
        // Update Google fonts link
        pattern: /(https:\/\/fonts.googleapis.com\/css2.*?)(&v=\d+|")/g,
        replacement: '$1&v={{TIMESTAMP}}"'
      },
      {
        // Update custom-styles.css link
        pattern: /(\/custom-styles.css\?v=)(\d+)/g,
        replacement: '$1{{TIMESTAMP}}'
      }
    ]
  },
  {
    path: path.join(__dirname, 'src', 'components', 'Layout.tsx'),
    replacements: [
      {
        // Update the linkElement.href line to use our fixed timestamp for consistency
        pattern: /linkElement\.href = `\/custom-styles\.css\?v=\d+`;/g,
        replacement: 'linkElement.href = `/custom-styles.css?v={{TIMESTAMP}}`;'
      }
    ]
  },
  {
    path: path.join(__dirname, 'public', 'custom-styles.css'),
    replacements: [
      {
        // Add a version comment at the top of the file
        pattern: /\/\* Wine Rater Custom Styles.*/,
        replacement: '/* Wine Rater Custom Styles - Version {{TIMESTAMP}} */'
      }
    ]
  },
  {
    path: path.join(__dirname, 'public', 'language.html'),
    replacements: [
      {
        // Update the version attribute
        pattern: /<meta name="version" content=".*?">/g,
        replacement: '<meta name="version" content="{{TIMESTAMP}}">'
      }
    ]
  },
  {
    path: path.join(__dirname, 'public', 'cache-clear.html'),
    replacements: [
      {
        // Update the version attribute
        pattern: /<span id="buildTime">.*?<\/span>/g,
        replacement: '<span id="buildTime">{{TIMESTAMP}}</span>'
      }
    ]
  }
];

// Apply updates to all files
filesToUpdate.forEach(file => {
  updateFile(file.path, file.replacements);
});

console.log('Cache-busting complete!');