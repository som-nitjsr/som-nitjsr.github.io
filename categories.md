---
layout: default
title: Categories
nav_order: 4
permalink: /categories/
---

# Categories

Browse posts by category.

{% assign categories = site.categories | sort %}
{% if categories.size == 0 %}
No categories found.
{% else %}

## All categories

{% for cat in categories %}
{% assign name = cat[0] %}
{% assign posts = cat[1] %}
- [{{ name }}](#{{ name | slugify }}) ({{ posts | size }})
{% endfor %}

---

{% for cat in categories %}
{% assign name = cat[0] %}
{% assign posts = cat[1] | sort: "date" | reverse %}
## {{ name }}
{: #{{ name | slugify }} }

{% for post in posts %}
- **[{{ post.title }}]({{ post.url }})** - {{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 140 }}
{% endfor %}

{% endfor %}
{% endif %}

