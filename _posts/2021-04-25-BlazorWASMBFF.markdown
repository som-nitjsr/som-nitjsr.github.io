---
layout: post
comments: true
IDENTIFIER: BFF 
title:  "Blazer WASM Backend for Frontend BFF"
description: Blazer | BFF | Identity Server | YARP | OAuth 2.1 | OpenId Connect| Security |
date:   2021-04-25 13:36:37 +0530
categories: BFF
---
[IETF](https://tools.ietf.org/html/draft-parecki-oauth-browser-based-apps-02#section-6.2) 
has already recommended Backend for Frontend Security(BFF) for SPA.
I am big fan of BFF and have implemented for angular SPA.
BFF has two main point.
1. Don't Use Implicit Flow (Already Deprecated in OAuth 2.1)
2. Don't store access or id token on browser.   
I am trying to implement the same in  Blazer WASM.
By default WASM template still store security token in browser side. 
This is what I have done. 
<img alt='BFF' src='/assets/BlazorWASMBFF.png'>

It has 3 component.

**1. WASM :**
 This is blazer WASM and runs in browser. It will call the api from and will include the cookie in every call to server.
 
**2. Host:** This is simple aspnet core app that host the WASM.
It will also work as Reverse Proxy and will include the user access token in every call going to api. I have also hosted the Identity Server(Authority) in the same app.  

**Note:** You can always use a separate Identity Server instance if you have.  
**3. API:** This is aspnet core web api and require JWT bearer token  to access the Secure end point.

[Blazer WASM BFF Source code](https://github.com/som-nitjsr/BlazorWASMBFF)
Special Thanks To
[Identity Server](https://github.com/IdentityServer/IdentityServer4)
 [YARP](https://github.com/microsoft/reverse-proxy)

{% if page.comments %} {% include disqus.html %} {% endif %}
