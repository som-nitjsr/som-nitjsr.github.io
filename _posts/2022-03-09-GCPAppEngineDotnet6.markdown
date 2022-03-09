---
layout: post
comments: true
IDENTIFIER: ELB 
title:  "Deploying .Net 6.0 App in GCP App Engine"
description: GCP | AppEngine | .Net6.0 |DotNetCore | Docker 
date:   2022-03-09 20:36:37 +0530
categories: GCP
---
GCP provide App Engine as Pass Service for Hosting many framework. It support Stnadard and Flex Mode.
As of writing this Blog App Engine Support .Net Core 3.1 In Flex Mode.
I was also planning to use WAF and TLS termination at my ELB. 
I followed Below steps to host .net 6.0 app in GCP App engine.
**1. Setup the Environment**
Open the Cloud Shell In GCP or Install the Gcloud SDK locally. I have performed all the steps in Cloud Shell. 
 Set up the default project 
 ```bash
 gcloud config set project <PROJECT_ID>
 ```
 By default .net 6.0 SDK is not install in Cloud Shell use below command to install Install the .Net 6.0

 ```bash
wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
 ```
  ```bash
sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-6.0
 ```
 **2. Create Web App **
 Next, create a new skeleton ASP.NET Core web app with a target framework of netcoreapp3.1:
 ```bash
dotnet new mvc -o WebApplication1 -f net6.0
cd WebApplication1
```
{% if page.comments %} {% include disqus.html %} {% endif %}
