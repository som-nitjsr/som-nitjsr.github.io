---
layout: post
comments: true
IDENTIFIER: AppEngine 
title:  "Deploying .Net 6.0 App in GCP App Engine"
description: GCP | AppEngine | .Net6.0 |DotNetCore | Docker 
date:   2022-03-08 20:36:37 +0530
categories: GCP
---
GCP provide App Engine as Pass Service for Hosting many framework. It support Standard and Flex Mode.
As of writing this Blog App Engine only Support till .Net Core 3.1 In Flex Mode.

I followed Below steps to host .net 6.0 app in GCP App engine.

**1. Setup the Environment**

Make sure the xxx@cloudbuild.gserviceaccount.com build account has storage access and App engine deployer 
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
 
 **2. Create Web App**

 Next, create a new skeleton ASP.NET Core web app with a target framework of netcoreapp3.1:
 ```bash
dotnet new mvc -o WebApplication1 -f net6.0
cd WebApplication1
dotnet build
```
correct the build issue if any.

 **3. Publish the Web App to App Engine**

 Since we are using the custom runtime we need to create out own docker file. 
 First add the app.yaml file 
 ```bash
cat <<EOT >> app.yaml
env: flex
runtime: custom
EOT
```
Create a docker file.

 ```yaml
cat <<EOT >> Dockerfile
#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"
COPY . "WebApplication1/"
WORKDIR "/src/WebApplication1"
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
EOT
```
 Publish the app to App Engine
 ```bash
gcloud app deploy --version v0
```

Will add some troubleshooting steps also......
{% if page.comments %} {% include disqus.html %} {% endif %}
