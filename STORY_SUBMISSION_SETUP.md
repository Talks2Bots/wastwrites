# Story Formatter Setup Instructions

## Overview
This tool helps you format stories for your Jekyll site by generating properly formatted markdown files that you can copy and paste into your `_posts` directory.

## How It Works
1. **Fill out the form** with your story details
2. **Generate markdown** with proper frontmatter
3. **Copy the output** to your clipboard
4. **Create a new file** in your `_posts` directory
5. **Paste and save** the content
6. **Commit and push** to GitHub to publish

## Using the Tool

### Step 1: Access the Form
- Open `story-submission.html` in your browser
- Or visit `/story-submission.html` on your live site

### Step 2: Fill Out the Form
- **Title**: Enter your story title
- **Category**: Choose from Pure AI, Pure Human, Collaboration, or Experimental
- **Content**: Paste your complete story content

### Step 3: Generate and Copy
- Click "Generate Markdown"
- Click "Copy to Clipboard" 
- Note the suggested filename

### Step 4: Create the File
1. Navigate to your `_posts` directory
2. Create a new file with the suggested filename (e.g., `2025-01-27-my-story.md`)
3. Paste the generated markdown content
4. Save the file

### Step 5: Publish
1. Commit the new file to Git
2. Push to GitHub
3. Your story will be live on GitHub Pages within minutes

## Features

✅ **Automatic frontmatter generation** with proper layout, title, date, and category  
✅ **Filename generation** following Jekyll conventions  
✅ **One-click copy** to clipboard  
✅ **Markdown support** for formatting your content  
✅ **Category selection** matching your existing stories  
✅ **Clean, professional interface**  

## Example Output

The tool generates markdown like this:

```markdown
---
layout: post
title: "My Amazing Story"
date: 2025-01-27 10:00:00
category: pure ai
---

Your story content goes here...

---

*This concludes "My Amazing Story." Thank you for reading.*
```

## Tips

- **Use `<!--more-->`** in your content to create excerpt breaks
- **Markdown formatting** is fully supported (bold, italic, headings, etc.)
- **Categories** should match your existing story categories
- **Filenames** are automatically generated from the title and date

## Troubleshooting

**Copy button not working?**
- Some browsers require HTTPS for clipboard access
- You can always select and copy manually

**Generated filename looks wrong?**
- The tool converts your title to lowercase and replaces spaces with hyphens
- You can rename the file if needed

**Content not formatting correctly?**
- Make sure you're pasting the complete generated markdown
- Check that the frontmatter (the part between `---`) is intact

---

*This tool makes it easy to add new stories to your Jekyll site without manually formatting frontmatter.*
