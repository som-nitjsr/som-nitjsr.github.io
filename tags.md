---
layout: default
title: Tags
nav_order: 5
permalink: /tags/
---

# Tags

Browse posts by tag.

{% assign tags = site.tags | sort %}
{% if tags.size == 0 %}
No tags found yet. (Add `tags: [tag1, tag2]` in a post’s front matter to populate this page.)
{% else %}

## All tags

{% for tag in tags %}
{% assign name = tag[0] %}
{% assign posts = tag[1] %}
- [{{ name }}](#{{ name | slugify }}) ({{ posts | size }})
{% endfor %}

---

{% for tag in tags %}
{% assign name = tag[0] %}
{% assign posts = tag[1] | sort: "date" | reverse %}
## {{ name }}
{: #{{ name | slugify }} }

{% for post in posts %}
- **[{{ post.title }}]({{ post.url }})** - {{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 140 }}
{% endfor %}

{% endfor %}
{% endif %}

