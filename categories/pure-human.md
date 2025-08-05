---
layout: full-width
title: Pure Human Stories
nav_exclude: true
---

<h1 class="content-listing-header sans">Pure Human Stories</h1>
<p class="subtitle">Stories written entirely by human authors</p>

<ul class="content-listing">
  {% for post in site.posts %}
    {% if post.category == 'pure human' %}
      <li class="listing">
        <hr class="slender">
        <a href="{{ post.url | prepend: site.baseurl }}"><h3 class="contrast">{{ post.title }}</h3></a>
        <br><span class="smaller">{{ post.date | date: "%B %-d, %Y" }}</span><br/>
        <div>{{ post.excerpt }}</div>
      </li>
    {% endif %}
  {% endfor %}
</ul>

{% assign pure_human_posts = site.posts | where: "category", "pure human" %}
{% if pure_human_posts.size == 0 %}
<p><em>No stories in this category yet. Check back soon!</em></p>
{% endif %} 