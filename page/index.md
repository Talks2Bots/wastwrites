---
layout: page
title: stories
nav_exclude: true
---

<div class="stories-page">
  <h2>All Stories</h2>
  <p>Browse all the stories in the collection:</p>
  
  <ul class="content-listing">
    {% for post in site.posts %}
      <li class="listing">
        <hr class="slender">
        <a href="{{ post.url | prepend: site.baseurl }}"><h3 class="contrast">{{ post.title }}</h3></a>
        <br><span class="smaller">{{ post.date | date: "%B %-d, %Y" }}</span><br/>
        <div>{{ post.excerpt }}</div>
      </li>
    {% endfor %}
  </ul>
</div>

