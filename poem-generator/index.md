---
layout: page
title: Poem Advent
permalink: /poem-generator/
nav_exclude: false
---

<div class="poem-generator-container">
  <h1>Poem Advent</h1>
  <p class="subtitle">Generate a unique poem with the click of a button</p>
  
  <div class="instructions">
    <p><strong>How it works:</strong> Click the button below to generate a poem. The generator uses AI to create original poetry based on a curated prompt.</p>
    <p><strong>Setup:</strong> On first use, you'll need to provide:</p>
    <ul>
      <li>Your OpenRouter API key</li>
      <li>The model identifier (e.g., <code>nvidia/nemotron-nano-12b-2-vl</code>)</li>
    </ul>
    <p><em>To find the exact model identifier, check the model details in your <a href="https://openrouter.ai/models" target="_blank">OpenRouter dashboard</a>. The format is typically <code>provider/model-name</code> (e.g., <code>nvidia/nemotron-nano-12b-2-vl</code>).</em></p>
    <p><em>Your credentials will be stored securely in your browser's localStorage.</em></p>
  </div>
  
  <div class="generator-controls">
    <button id="generateBtn" class="generate-button">Generate Poem</button>
    <button id="copyBtn" class="copy-button" style="display: none;">Copy Poem</button>
    <button id="clearCredentialsBtn" class="clear-button">Clear API Credentials</button>
  </div>
  
  <div id="loadingIndicator" class="loading-indicator" style="display: none;">
    <p>Generating your poem...</p>
  </div>
  
  <div id="errorMessage" class="error-message" style="display: none;"></div>
  
  <div id="poemOutput" class="poem-output" style="display: none;">
    <h2>Your Generated Poem</h2>
    <div id="poemContent" class="poem-content"></div>
  </div>
</div>

<style>
.poem-generator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  line-height: 1.6;
}

.poem-generator-container h1 {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.poem-generator-container .subtitle {
  font-size: 1.4rem;
  font-style: italic;
  color: #666;
  margin-bottom: 2rem;
}

.instructions {
  background: #f8f9fa;
  border-left: 4px solid #007cba;
  padding: 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.instructions p {
  margin-bottom: 0.75rem;
}

.instructions p:last-child {
  margin-bottom: 0;
}

.generator-controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.generate-button,
.copy-button,
.clear-button {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border: 1px solid #333;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.generate-button:hover,
.copy-button:hover {
  background: #333;
  color: #fff;
}

.clear-button {
  background: #fff;
  color: #666;
  border-color: #ccc;
}

.clear-button:hover {
  background: #f8f9fa;
  border-color: #999;
}

.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: #666;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #c33;
  border-radius: 4px;
}

.poem-output {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.poem-output h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
}

.poem-content {
  font-size: 1.2rem;
  line-height: 1.8;
  white-space: pre-wrap;
  padding: 1.5rem;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: 'ET Book', 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
}

@media (max-width: 600px) {
  .poem-generator-container {
    padding: 1rem 0.5rem;
  }
  
  .poem-generator-container h1 {
    font-size: 2rem;
  }
  
  .generator-controls {
    flex-direction: column;
  }
  
  .generate-button,
  .copy-button,
  .clear-button {
    width: 100%;
  }
}
</style>

<script>
// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Get stored credentials
function getStoredCredentials() {
  return {
    apiKey: localStorage.getItem('openrouter_api_key'),
    model: localStorage.getItem('openrouter_model')
  };
}

// Store credentials
function storeCredentials(apiKey, model) {
  localStorage.setItem('openrouter_api_key', apiKey);
  localStorage.setItem('openrouter_model', model);
}

// Clear credentials
function clearCredentials() {
  localStorage.removeItem('openrouter_api_key');
  localStorage.removeItem('openrouter_model');
}

// Prompt for credentials if not stored
function ensureCredentials() {
  const credentials = getStoredCredentials();
  
  if (!credentials.apiKey || !credentials.model) {
    const apiKey = prompt('Enter your OpenRouter API key:');
    if (!apiKey) {
      return null;
    }
    
    const model = prompt('Enter the OpenRouter model identifier (e.g., nvidia/nemotron-nano-12b-2-vl):\n\nFind it at: https://openrouter.ai/models');
    if (!model) {
      return null;
    }
    
    storeCredentials(apiKey, model);
    return { apiKey, model };
  }
  
  return credentials;
}

// Generate poem using OpenRouter API
async function generatePoem() {
  const credentials = ensureCredentials();
  
  if (!credentials) {
    showError('API credentials are required to generate poems.');
    return;
  }
  
  // Show loading indicator
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorMessage = document.getElementById('errorMessage');
  const poemOutput = document.getElementById('poemOutput');
  const generateBtn = document.getElementById('generateBtn');
  
  loadingIndicator.style.display = 'block';
  errorMessage.style.display = 'none';
  poemOutput.style.display = 'none';
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Wast Writes Poem Advent'
      },
      body: JSON.stringify({
        model: credentials.model,
        messages: [
          {
            role: 'user',
            content: 'Write an original poem. Be creative and expressive.'
          }
        ],
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      
      // Provide helpful guidance for common errors
      if (response.status === 400 || response.status === 404) {
        if (errorMessage.toLowerCase().includes('model') || errorMessage.toLowerCase().includes('not found')) {
          errorMessage += '\n\nTip: Make sure you entered the correct model identifier (e.g., nvidia/nemotron-nano-12b-2-vl). Check https://openrouter.ai/models for the exact identifier.';
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const poem = data.choices[0].message.content;
      displayPoem(poem);
    } else {
      throw new Error('No poem generated. Please check your OpenRouter configuration.');
    }
  } catch (error) {
    showError(`Error generating poem: ${error.message}`);
  } finally {
    loadingIndicator.style.display = 'none';
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Poem';
  }
}

// Display the generated poem
function displayPoem(poem) {
  const poemContent = document.getElementById('poemContent');
  const poemOutput = document.getElementById('poemOutput');
  const copyBtn = document.getElementById('copyBtn');
  
  poemContent.textContent = poem;
  poemOutput.style.display = 'block';
  copyBtn.style.display = 'inline-block';
  
  // Scroll to poem
  poemOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Copy poem to clipboard
function copyPoem() {
  const poemContent = document.getElementById('poemContent');
  const poemText = poemContent.textContent;
  
  navigator.clipboard.writeText(poemText).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
    alert('Could not copy to clipboard. Please select and copy manually.');
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('generateBtn').addEventListener('click', generatePoem);
  document.getElementById('copyBtn').addEventListener('click', copyPoem);
  document.getElementById('clearCredentialsBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your stored OpenRouter API credentials? You\'ll need to enter them again next time.')) {
      clearCredentials();
      alert('✅ Credentials cleared!');
    }
  });
});
</script>

