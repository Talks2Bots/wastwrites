---
layout: page
title: Submit Story
permalink: /submit-story/
nav_exclude: false
---

<div class="story-submission-container">
  <h1>Submit or Update Story</h1>
  <p>Use this form to automatically format and publish new stories or update existing ones on Wast Writes.</p>
  
  <div class="instructions">
    <h3>📝 How to Use This Tool</h3>
    <ol>
      <li>Choose whether you're creating a new story or updating an existing one</li>
      <li>Fill out the form below with your story details</li>
      <li>Click "Generate Markdown" to create the formatted file</li>
      <li>Click "🚀 Publish to GitHub" to automatically publish</li>
      <li>Your story will be live on the site within minutes!</li>
    </ol>
  </div>
  
  <form id="storyForm">
    <div class="form-group">
      <label>Story Type *</label>
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" name="storyType" value="new" id="storyTypeNew" checked>
          <span>New Story</span>
        </label>
        <label class="radio-label">
          <input type="radio" name="storyType" value="update" id="storyTypeUpdate">
          <span>Update Existing Story</span>
        </label>
      </div>
      <div class="help-text">Select "New Story" to create a new post, or "Update Existing Story" to modify a story that's already published.</div>
    </div>
    
    <div class="form-group" id="existingStoryGroup" style="display: none;">
      <label for="existingStory">Select Story to Update *</label>
      <select id="existingStory">
        <option value="">Loading stories...</option>
      </select>
      <div class="help-text">Choose which story you want to update. The original filename and date will be preserved.</div>
      <button type="button" id="refreshStoriesBtn" style="margin-top: 10px; background: #6c757d;">🔄 Refresh Story List</button>
    </div>
    
    <div class="form-group">
      <label for="title">Story Title *</label>
      <input type="text" id="title" required placeholder="Enter your story title">
      <div class="help-text">This will be the main heading of your story. You can change the title when updating a story.</div>
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

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.radio-label input[type="radio"] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.radio-label span {
  user-select: none;
}
</style>

<script>
// Global variable to store existing stories
let existingStories = [];

// Function to fetch existing stories from GitHub
async function fetchExistingStories() {
    const token = localStorage.getItem('github_token');
    const username = localStorage.getItem('github_username');
    
    if (!token || !username) {
        return [];
    }
    
    try {
        const url = `https://api.github.com/repos/${username}/wastwrites/contents/_posts`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const files = await response.json();
        // Filter for .md files and fetch their titles
        const stories = await Promise.all(
            files
                .filter(file => file.name.endsWith('.md') && file.type === 'file')
                .map(async (file) => {
                    try {
                        // Fetch the file content to extract title - use Contents API with full path
                        const fileUrl = `https://api.github.com/repos/${username}/wastwrites/contents/_posts/${file.name}`;
                        const fileResponse = await fetch(fileUrl, {
                            headers: {
                                'Authorization': `token ${token}`,
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        });
                        
                        if (!fileResponse.ok) {
                            throw new Error(`HTTP ${fileResponse.status}`);
                        }
                        
                        const fileData = await fileResponse.json();
                        const content = atob(fileData.content.replace(/\s/g, ''));
                        const titleMatch = content.match(/title:\s*["'](.+?)["']/);
                        const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
                        const title = titleMatch ? titleMatch[1] : file.name.replace(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/, '$1').replace(/-/g, ' ');
                        const date = dateMatch ? dateMatch[1] : file.name.substring(0, 10);
                        
                        return {
                            filename: file.name,
                            title: title,
                            date: date,
                            sha: file.sha
                        };
                    } catch (e) {
                        // Fallback if we can't parse the file - use filename-based title
                        const dateMatch = file.name.match(/^(\d{4}-\d{2}-\d{2})-/);
                        const date = dateMatch ? dateMatch[1] : file.name.substring(0, 10);
                        const slugTitle = file.name.replace(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/, '$1').replace(/-/g, ' ');
                        return {
                            filename: file.name,
                            title: slugTitle,
                            date: date,
                            sha: file.sha
                        };
                    }
                })
        );
        
        // Sort by date (newest first)
        return stories.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
}

// Function to populate the dropdown with existing stories
async function populateStoryDropdown() {
    const dropdown = document.getElementById('existingStory');
    dropdown.innerHTML = '<option value="">Loading stories...</option>';
    dropdown.disabled = true;
    
    const token = localStorage.getItem('github_token');
    const username = localStorage.getItem('github_username');
    
    if (!token || !username) {
        dropdown.innerHTML = '<option value="">Please enter GitHub credentials first (click Publish button)</option>';
        return;
    }
    
    existingStories = await fetchExistingStories();
    
    if (existingStories.length === 0) {
        dropdown.innerHTML = '<option value="">No stories found or unable to load</option>';
        dropdown.disabled = true;
        return;
    }
    
    dropdown.innerHTML = '<option value="">-- Select a story to update --</option>';
    existingStories.forEach(story => {
        const option = document.createElement('option');
        option.value = story.filename;
        option.textContent = `${story.date} - ${story.title}`;
        option.dataset.sha = story.sha;
        option.dataset.date = story.date;
        dropdown.appendChild(option);
    });
    
    dropdown.disabled = false;
}

// Toggle between new and update modes
document.getElementById('storyTypeNew').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('existingStoryGroup').style.display = 'none';
        document.getElementById('existingStory').required = false;
    }
});

document.getElementById('storyTypeUpdate').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('existingStoryGroup').style.display = 'block';
        document.getElementById('existingStory').required = true;
        // Try to populate if we have credentials
        populateStoryDropdown();
    }
});

// Refresh button for story list
document.getElementById('refreshStoriesBtn').addEventListener('click', function() {
    this.textContent = 'Refreshing...';
    this.disabled = true;
    populateStoryDropdown().then(() => {
        this.textContent = '🔄 Refresh Story List';
        this.disabled = false;
    });
});

// When an existing story is selected, optionally pre-fill the form
document.getElementById('existingStory').addEventListener('change', function() {
    if (this.value && existingStories.length > 0) {
        const selectedStory = existingStories.find(s => s.filename === this.value);
        if (selectedStory && !document.getElementById('title').value) {
            // Optionally pre-fill title, but let user edit it
            document.getElementById('title').value = selectedStory.title;
        }
    }
});

document.getElementById('storyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const storyType = document.querySelector('input[name="storyType"]:checked').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const content = document.getElementById('content').value;
    const existingStorySelect = document.getElementById('existingStory');
    
    if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
    }
    
    if (storyType === 'update' && !existingStorySelect.value) {
        alert('Please select which story you want to update.');
        return;
    }
    
    let filename;
    let dateStr;
    
    if (storyType === 'update' && existingStorySelect.value) {
        // Use the original filename when updating
        filename = existingStorySelect.value;
        // Extract date from filename (format: YYYY-MM-DD-title.md)
        const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
        dateStr = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    } else {
        // Generate new filename
        const now = new Date();
        dateStr = now.toISOString().split('T')[0];
        filename = `${dateStr}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.md`;
    }
    
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
    
    if (paragraphs.length > 1 && !content.includes('<!--more-->')) {
        // Insert <!--more--> after the first paragraph if not already present
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
    
    // Clear any previous filename divs
    const existingFilenameDivs = outputDiv.parentElement.querySelectorAll('.filename-info');
    existingFilenameDivs.forEach(div => div.remove());
    
    // Show copy and publish buttons
    document.getElementById('copyBtn').style.display = 'inline-block';
    document.getElementById('publishBtn').style.display = 'inline-block';
    
    // Show filename info
    const filenameDiv = document.createElement('div');
    filenameDiv.className = 'filename-info';
    filenameDiv.innerHTML = `<br><strong>Filename:</strong> <code>${filename}</code>${storyType === 'update' ? ' <em>(preserving original date)</em>' : ''}`;
    filenameDiv.style.marginTop = '10px';
    filenameDiv.style.fontSize = '14px';
    outputDiv.parentElement.insertBefore(filenameDiv, outputDiv.nextSibling);
    
    // Store data for publishing
    window.storyData = {
        title: title,
        category: category,
        content: content,
        filename: filename,
        markdown: markdownContent,
        isUpdate: storyType === 'update',
        existingSha: storyType === 'update' && existingStorySelect.selectedOptions[0]?.dataset?.sha || null
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
    
    // Determine if this is an update and get SHA
    let fileSha = null;
    if (window.storyData.isUpdate && window.storyData.existingSha) {
        // We already have the SHA from the dropdown
        fileSha = window.storyData.existingSha;
    }
    
    // If we don't have SHA yet, try to fetch it
    const getFileData = fileSha ? Promise.resolve({ sha: fileSha }) : fetch(url, {
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
    });
    
    getFileData
    .then(fileData => {
        const commitMessage = window.storyData.isUpdate 
            ? `Update story: ${window.storyData.title}`
            : `Add new story: ${window.storyData.title}`;
        
        const payload = {
            message: commitMessage,
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
< ! - -   F o r c e   r e b u i l d   1 0 / 0 9 / 2 0 2 5   1 2 : 1 7 : 5 2   - - > 
 
 