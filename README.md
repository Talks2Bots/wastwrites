# Wast Writes

A beautiful collection of short stories, powered by Jekyll and styled with the elegant Tufte aesthetic.

## About This Site

**Wast Writes** is a curated digital library featuring original short stories. The site uses the [Tufte-Jekyll theme](https://github.com/clayh53/tufte-jekyll), which provides an elegant, typography-focused design inspired by Edward Tufte's approach to information design.

## Adding New Stories

To add a new short story to your collection:

1. Create a new file in the `_posts` directory
2. Name it using the format: `YYYY-MM-DD-story-title.md`
3. Start with the following header (called "front matter"):

```yaml
---
layout: post
title: "Your Story Title"
date: YYYY-MM-DD HH:MM:SS
categories: fiction [genre]
---
```

4. Write your story using Markdown formatting
5. Use special Tufte-Jekyll features to enhance the reading experience:

### Special Formatting Features

- **New thoughts**: Start sections with `{% newthought 'Your opening words' %}`
- **Sidenotes**: Add footnote-style notes with `{% sidenote 'unique-id' 'Your note text' %}`
- **Margin notes**: Add unnumbered notes with `{% marginnote 'unique-id' 'Your note text' %}`
- **Epigraphs**: Add quotes at the beginning with `{% epigraph 'Quote text' 'Author' 'Source' %}`

### Example Story Structure

```markdown
---
layout: post
title: "The Garden of Forgotten Words"
date: 2025-01-27 15:30:00
categories: fiction literary
---

{% newthought 'The garden appeared' %} on a Tuesday morning, where the empty lot had been the day before.<!--more--> Margaret noticed it first, pausing on her daily walk to peer through the wrought-iron fence that definitely hadn't been there yesterday.

{% sidenote 'tuesday-note' 'Tuesdays had always been significant in Margaret's life, though she could never explain why.' %}

[Continue your story here...]
```

## Publishing Changes

This site is automatically deployed to GitHub Pages. Simply:

1. Commit your new story files to the repository
2. Push to the main branch
3. GitHub Actions will automatically build and publish your site

Your site will be available at: `https://talks2bots.github.io/wastwrites`

## Site Configuration

The main site settings are in `_config.yml`. You can customize:

- Site title and description
- Author information
- Base URL settings
- Theme options

## Local Development

If you want to preview your site locally before publishing:

1. Install Ruby and Jekyll
2. Run `bundle install` to install dependencies
3. Run `bundle exec jekyll serve` to start a local server
4. Visit `http://localhost:4000` to preview your site

## Support

For questions about using Jekyll or the Tufte theme features, refer to:
- [Jekyll documentation](https://jekyllrb.com/docs/)
- [Tufte-Jekyll theme documentation](https://github.com/clayh53/tufte-jekyll)

## License

This site template is based on the Tufte-Jekyll theme, which is released under the MIT License.
