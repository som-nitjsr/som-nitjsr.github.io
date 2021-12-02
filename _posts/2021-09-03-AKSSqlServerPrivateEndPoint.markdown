---
layout: post
comments: true
IDENTIFIER: AKSSQL 
title:  "AKS Sql Server Private End Point using terraform"
description: AKS | terraform | Private Endpoint | Azure Sql | Security 
date:   2021-09-03 13:36:37 +0530
categories: AKS
---
Here I got a opertunity to work with Hybrid AKS Cluster and Azure Sql Server.
I have follwed all the security best pracsises 

In this article I will talk about how I have achived the Private endpoint connectivity between Sql Server and AKS cluster uisng Terraform.
I has mainly three componnent 
1. AKS Cluster with windows and Linux worker Load
2. Azure Sql Server.   
3. Azure Application Gateway Ingress Controller

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
