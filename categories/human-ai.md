---
layout: full-width
title: Human/AI Stories
nav_exclude: true
---

<h1 class="content-listing-header sans">Human/AI Stories</h1>
<p class="subtitle">Stories created through human-AI collaboration</p>

<ul class="content-listing">
  {% for post in site.posts %}
    {% if post.category == 'human/ai' %}
      <li class="listing">
        <hr class="slender">
        <a href="{{ post.url | prepend: site.baseurl }}"><h3 class="contrast">{{ post.title }}</h3></a>
        <br><span class="smaller">{{ post.date | date: "%B %-d, %Y" }}</span><br/>
        <div>{{ post.excerpt }}</div>
      </li>
    {% endif %}
  {% endfor %}
</ul>

{% assign human_ai_posts = site.posts | where: "category", "human/ai" %}
{% if human_ai_posts.size == 0 %}
<p><em>No stories in this category yet. Check back soon!</em></p>
{% endif %} 