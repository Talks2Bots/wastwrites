---
layout: page
title: Submit Story
permalink: /submit-story/
nav_exclude: false
---

<div class="story-submission-container">
  <h1>Submit New Story</h1>
  <p>Use this form to automatically format and publish your stories to Wast Writes.</p>
  
  <div class="instructions">
    <h3>📝 How to Use This Tool</h3>
    <ol>
      <li>Fill out the form below with your story details</li>
      <li>Click "Generate Markdown" to create the formatted file</li>
      <li>Click "🚀 Publish to GitHub" to automatically publish</li>
      <li>Your story will be live on the site within minutes!</li>
    </ol>
  </div>
  
  <form id="storyForm">
    <div class="form-group">
      <label for="title">Story Title *</label>
      <input type="text" id="title" required placeholder="Enter your story title">
      <div class="help-text">This will be the main heading of your story</div>
    </div>
    
    <div class="form-group">
      <label for="category">Category (Optional)</label>
      <select id="category">
        <option value="">No category</option>
        <option value="pure ai">Pure AI</option>
        <option value="story">Story</option>
        <option value="pure human">Pure Human</option>
        <option value="collaboration">Collaboration</option>
      </select>
      <div class="help-text">Most stories don't use categories. Leave as "No category" unless you specifically need one.</div>
    </div>
    
    <div class="form-group">
      <label for="content">Story Content *</label>
      <textarea id="content" placeholder="Paste your story here...

You can include:
- Regular text
- **Bold text**
- *Italic text*
- ## Headings
- <!--more--> (for excerpt break)

The story will be automatically formatted with proper frontmatter and <!--more--> tag." required></textarea>
      <div class="help-text">Paste your complete story content here. Markdown formatting is supported.</div>
    </div>
    
    <button type="submit">Generate Markdown</button>
    <button type="button" id="copyBtn" style="display: none;">Copy to Clipboard</button>
    <button type="button" id="publishBtn" style="display: none;">🚀 Publish to GitHub</button>
    <button type="button" id="clearBtn" style="background: #dc3545; margin-left: 10px;">Clear Stored Credentials</button>
  </form>
  
  <textarea id="output" class="output" style="display: none;"></textarea>
</div>

<style>
.story-submission-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

.form-group { 
  margin-bottom: 20px; 
}

label { 
  display: block; 
  margin-bottom: 5px; 
  font-weight: bold; 
}

input, textarea, select { 
  width: 100%; 
  padding: 10px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  font-size: 14px;
}

textarea { 
  height: 300px; 
  font-family: 'Courier New', monospace; 
  resize: vertical;
}

button { 
  background: #007cba; 
  color: white; 
  padding: 12px 24px; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 16px;
  margin-right: 10px;
}

button:hover { 
  background: #005a87; 
}

.output { 
  background: #f8f9fa; 
  border: 1px solid #dee2e6; 
  padding: 15px; 
  border-radius: 4px; 
  margin-top: 20px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  resize: vertical;
  font-size: 14px;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.instructions {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>

<script>
document.getElementById('storyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const content = document.getElementById('content').value;
    
    if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
    }
    
    // Generate filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `${dateStr}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.md`;
    
    // Generate markdown content
    let frontmatter = `---
layout: post
title: "${title}"
date: ${dateStr} 10:00:00`;
    
    if (category) {
        frontmatter += `\ncategory: ${category}`;
    }
    
    frontmatter += `\n---`;
    
    // Split content into paragraphs and add <!--more--> after first paragraph
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    let processedContent = content;
    
    if (paragraphs.length > 1) {
        // Insert <!--more--> after the first paragraph
        processedContent = paragraphs[0] + '\n\n<!--more-->\n\n' + paragraphs.slice(1).join('\n\n');
    }
    
    const markdownContent = `${frontmatter}

${processedContent}

---

*This concludes "${title}." Thank you for reading.*`;
    
    // Show output
    const outputDiv = document.getElementById('output');
    outputDiv.value = markdownContent;
    outputDiv.style.display = 'block';
    
    // Show copy and publish buttons
    document.getElementById('copyBtn').style.display = 'inline-block';
    document.getElementById('publishBtn').style.display = 'inline-block';
    
    // Show filename suggestion
    const filenameDiv = document.createElement('div');
    filenameDiv.innerHTML = `<br><strong>Suggested filename:</strong> <code>${filename}</code>`;
    filenameDiv.style.marginTop = '10px';
    filenameDiv.style.fontSize = '14px';
    outputDiv.appendChild(filenameDiv);
    
    // Store data for publishing
    window.storyData = {
        title: title,
        category: category,
        content: content,
        filename: filename,
        markdown: markdownContent
    };
});

document.getElementById('copyBtn').addEventListener('click', function() {
    const output = document.getElementById('output').value;
    navigator.clipboard.writeText(output).then(function() {
        alert('Markdown copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        alert('Could not copy to clipboard. Please select and copy manually.');
    });
});

document.getElementById('publishBtn').addEventListener('click', function() {
    if (!window.storyData) {
        alert('Please generate markdown first.');
        return;
    }
    
    const publishBtn = this;
    publishBtn.textContent = 'Publishing...';
    publishBtn.disabled = true;
    
    // Check for stored credentials
    let token = localStorage.getItem('github_token');
    let username = localStorage.getItem('github_username');
    
    // If not stored, prompt for them
    if (!token) {
        token = prompt('Enter your GitHub Personal Access Token:');
        if (!token) {
            publishBtn.textContent = '🚀 Publish to GitHub';
            publishBtn.disabled = false;
            return;
        }
        localStorage.setItem('github_token', token);
    }
    
    if (!username) {
        username = prompt('Enter your GitHub username:');
        if (!username) {
            publishBtn.textContent = '🚀 Publish to GitHub';
            publishBtn.disabled = false;
            return;
        }
        localStorage.setItem('github_username', username);
    }
    
    // Create the file using GitHub API
    const url = `https://api.github.com/repos/${username}/wastwrites/contents/_posts/${window.storyData.filename}`;
    
    // First, check if file exists to get the SHA
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (response.status === 404) {
            // File doesn't exist, create new one
            return { sha: null };
        } else if (response.ok) {
            // File exists, get its SHA
            return response.json();
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    })
    .then(fileData => {
        const payload = {
            message: `Add new story: ${window.storyData.title}`,
            content: btoa(unescape(encodeURIComponent(window.storyData.markdown)))
        };
        
        // Add SHA if file exists (for updates)
        if (fileData.sha) {
            payload.sha = fileData.sha;
        }
        
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(payload)
        });
    })
    .then(response => response.json())
    .then(data => {
        if (data.commit) {
            alert('✅ Story published successfully! It will be live on your site within a few minutes.');
            // Clear the form
            document.getElementById('storyForm').reset();
            document.getElementById('output').style.display = 'none';
            document.getElementById('copyBtn').style.display = 'none';
            document.getElementById('publishBtn').style.display = 'none';
        } else {
            alert('❌ Error publishing story: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error publishing story: ' + error.message);
    })
    .finally(() => {
        publishBtn.textContent = '🚀 Publish to GitHub';
        publishBtn.disabled = false;
    });
});

// Clear stored credentials
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your stored GitHub credentials? You\'ll need to enter them again next time.')) {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_username');
        alert('✅ Credentials cleared!');
    }
});
</script>
< ! - -   F o r c e   r e b u i l d   1 0 / 0 9 / 2 0 2 5   1 2 : 1 7 : 5 2   - - >  
 