---
layout: full-width
title: Pure Human Stories
nav_exclude: true
---

<h1 class="content-listing-header sans">Pure Human Stories</h1>
<p class="subtitle">Stories written entirely by human authors</p>

<ul class="content-listing">
  {% for story in site.pure-human %}
    <li class="listing">
      <hr class="slender">
      <a href="{{ story.url | prepend: site.baseurl }}"><h3 class="contrast">{{ story.title }}</h3></a>
      <br><span class="smaller">{{ story.date | date: "%B %-d, %Y" }}</span><br/>
      <div>{{ story.excerpt }}</div>
    </li>
  {% endfor %}
</ul>

{% if site.pure-human.size == 0 %}
<p><em>No stories in this category yet. Check back soon!</em></p>
{% endif %} 