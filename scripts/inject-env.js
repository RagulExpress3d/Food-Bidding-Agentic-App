/**
 * Runtime environment variable injection script
 * Replaces placeholders in HTML with actual environment variables
 * This runs when the container starts, before nginx serves files
 */

const fs = require('fs');
const path = require('path');

const htmlPath = '/usr/share/nginx/html/index.html';

// Read GEMINI_API_KEY from Cloud Run environment variables
// Supports both GEMINI_API_KEY (standard) and VITE_GEMINI_API_KEY (for compatibility)
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const envVars = {
  GEMINI_API_KEY: apiKey,
};

console.log('🔧 Injecting environment variables...');
console.log('GEMINI_API_KEY env var present:', !!process.env.GEMINI_API_KEY);
console.log('VITE_GEMINI_API_KEY env var present:', !!process.env.VITE_GEMINI_API_KEY);
console.log('Using API key from:', process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : (process.env.VITE_GEMINI_API_KEY ? 'VITE_GEMINI_API_KEY' : 'NONE'));
console.log('HTML path:', htmlPath);

if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  console.log('✅ Found index.html, size:', html.length, 'bytes');
  
  // Remove any existing window.__ENV__ definitions (more aggressive)
  html = html.replace(/<script[^>]*>\s*window\.__ENV__\s*=\s*\{[^}]*\};\s*<\/script>/gi, '');
  html = html.replace(/window\.__ENV__\s*=\s*\{[^}]*\};?/g, '');
  html = html.replace(/window\.__ENV__\s*=\s*window\.__ENV__\s*\|\|\s*\{\};?/g, '');
  
  // Inject env vars as a script tag - try multiple insertion points
  const envScript = `<script>window.__ENV__ = ${JSON.stringify(envVars)};</script>`;
  
  // CRITICAL: Inject BEFORE any module scripts so window.__ENV__ is available when React loads
  // Try to insert right after <head> tag, before any scripts
  if (html.includes('<head>')) {
    // Find the first script tag or </head>
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)(<\/head>|<\/script>)/i);
    if (headMatch && html.indexOf('<script') > html.indexOf('<head>')) {
      // Insert right after <head> tag, before any scripts
      html = html.replace(/<head[^>]*>/, `$&${envScript}\n`);
      console.log('✅ Injected immediately after <head> (before scripts)');
    } else {
      // Fallback: insert before </head>
      html = html.replace('</head>', `${envScript}\n</head>`);
      console.log('✅ Injected before </head>');
    }
  } else if (html.includes('</body>')) {
    html = html.replace('</body>', `${envScript}\n</body>`);
    console.log('✅ Injected before </body>');
  } else {
    // Last resort: prepend to body
    html = html.replace('<body', `${envScript}\n<body`);
    console.log('✅ Injected at start of body');
  }
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Environment variables injected successfully');
  console.log('✅ HTML updated, new size:', html.length, 'bytes');
  
  // Verify injection worked
  const verifyHtml = fs.readFileSync(htmlPath, 'utf8');
  if (verifyHtml.includes('window.__ENV__')) {
    console.log('✅ Verified: window.__ENV__ found in HTML');
  } else {
    console.error('❌ ERROR: window.__ENV__ NOT found in HTML after injection!');
  }
  
  if (envVars.GEMINI_API_KEY) {
    console.log('✅ GEMINI_API_KEY: Set');
    console.log('✅ Source:', process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'VITE_GEMINI_API_KEY');
  } else {
    console.error('❌ GEMINI_API_KEY: NOT SET');
    console.error('❌ GEMINI_API_KEY env var:', process.env.GEMINI_API_KEY ? 'present' : 'missing');
    console.error('❌ VITE_GEMINI_API_KEY env var:', process.env.VITE_GEMINI_API_KEY ? 'present' : 'missing');
    console.error('❌ This will cause API key errors!');
  }
} else {
  console.error('❌ index.html not found at:', htmlPath);
  try {
    const dir = '/usr/share/nginx/html';
    console.error('Checking directory:', dir);
    if (fs.existsSync(dir)) {
      console.error('Available files:', fs.readdirSync(dir));
    } else {
      console.error('Directory does not exist:', dir);
    }
  } catch (e) {
    console.error('Cannot list directory:', e.message);
  }
  process.exit(1);
}
