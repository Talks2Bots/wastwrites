---
layout: full-width
title: Pure AI Stories
nav_exclude: true
---

<h1 class="content-listing-header sans">Pure AI Stories</h1>
<p class="subtitle">Stories generated entirely by artificial intelligence</p>

<ul class="content-listing">
  {% for post in site.posts %}
    {% if post.category == 'pure ai' %}
      <li class="listing">
        <hr class="slender">
        <a href="{{ post.url | prepend: site.baseurl }}"><h3 class="contrast">{{ post.title }}</h3></a>
        <br><span class="smaller">{{ post.date | date: "%B %-d, %Y" }}</span><br/>
        <div>{{ post.excerpt }}</div>
      </li>
    {% endif %}
  {% endfor %}
</ul>

{% assign pure_ai_posts = site.posts | where: "category", "pure ai" %}
{% if pure_ai_posts.size == 0 %}
<p><em>No stories in this category yet. Check back soon!</em></p>
{% endif %} 