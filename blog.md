---
layout: default
title: Blog Posts
nav_order: 3
has_children: true
permalink: /blog/
---

# Blog Posts

Strategic insights and thought leadership content for CTOs and technology leaders.

{% assign categorized_posts = site.posts | group_by_exp: "post", "post.categories[0]" | sort: "name" %}
{% for category in categorized_posts %}
## {{ category.name }}

{% assign posts = category.items | sort: "date" | reverse %}
{% for post in posts %}
### [{{ post.title }}]({{ post.url }})
*{{ post.date | date: "%B %-d, %Y" }}*

{{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 180 }}

{% endfor %}
{% endfor %}

---

*Prefer RSS? Subscribe via [`/feed.xml`](/feed.xml).*
