/**
 * Runtime environment variable injection script
 * Replaces placeholders in HTML with actual environment variables
 * This runs when the container starts, before nginx serves files
 */

const fs = require('fs');
const path = require('path');

const htmlPath = '/usr/share/nginx/html/index.html';
const envVars = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};

console.log('🔧 Injecting environment variables...');
console.log('GEMINI_API_KEY present:', !!envVars.GEMINI_API_KEY);
console.log('HTML path:', htmlPath);

if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Remove any existing window.__ENV__ definitions
  html = html.replace(/<script>\s*window\.__ENV__\s*=\s*\{[^}]*\};\s*<\/script>/g, '');
  html = html.replace(/window\.__ENV__\s*=\s*\{[^}]*\};?/g, '');
  
  // Inject env vars as a script tag before closing head
  const envScript = `
  <script>
    window.__ENV__ = ${JSON.stringify(envVars)};
  </script>
  `;
  
  // Insert before closing </head> tag
  html = html.replace('</head>', `${envScript}</head>`);
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Environment variables injected successfully');
  console.log('✅ GEMINI_API_KEY:', envVars.GEMINI_API_KEY ? 'Set (' + envVars.GEMINI_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
} else {
  console.error('❌ index.html not found at:', htmlPath);
  console.error('Available files:', fs.readdirSync('/usr/share/nginx/html'));
  process.exit(1);
}
