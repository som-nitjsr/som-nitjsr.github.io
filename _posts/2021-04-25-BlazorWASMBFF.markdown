---
layout: post
title:  "Blazer WASM Backend for Frontend BFF"
date:   2021-04-25 13:36:37 +0530
categories: BFF
---
[IETF](https://tools.ietf.org/html/draft-parecki-oauth-browser-based-apps-02#section-6.2) 
has already recommended Backend for Frontend Security(BFF) for SPA.
I am big fan of BFF and have implemnted for angular SPA.
BFF has two main point.
1. Don't Use Implicit Flow (Alredy Depricated in Oauth 2.1)
2. Don't store access or id token on browser.   
I am trying to implemnt the same in  Blazor WASM.
By defaut WASM template still store security token on browser side. 
This is what i have done. 
<img alt='BFF' src='/assets/BlazorWASMBFF.png'>


[Blazer WASM BFF Source code](https://github.com/som-nitjsr/BlazorWASMBFF)
Special Thanks To
[Identity Server](https://github.com/IdentityServer/IdentityServer4)
 [YARP](https://github.com/microsoft/reverse-proxy)

