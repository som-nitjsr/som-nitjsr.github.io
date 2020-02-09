---
layout: post
comments: true
PAGE_URL: https://som-nitjsr.github.io/ 
PAGE_IDENTIFIER: aks_1 
title:  "Migrating Legacy .Net Framework To AKS"
date:   2020-02-03 13:36:37 +0530
categories: Aks
---
I got Opportunity to Migrate a existing  Legacy app to host in AKS.
It has mainly two Part 
1. Couple of SPA  in  Angular
2. around 10 Services written in .Net Framework 4.6 

It is a part of Applied Cloud Stories initiative [https://aka.ms/applied-cloud-stories](https://aka.ms/applied-cloud-stories)

**Current Challenges**  
1. Developer were building locally and deploying manually
2. Lots of config issues while moving from Dev to Prod
3. Typical works locally but not in production problem
4. No Guarantee of build in production is what signed off by SQE team
5. Can not revert the changes to previous build
6. Lots of time wasted in supporting the live environment
7. Lots of database change issue due to manual deployment
8. No version control for Database script   

<img src='/assets/existingsytem_aks.png' >

**Few Expectation from  new solution**
1. Can not modify the code  
2. will need to use .net Framework only api
3. Provide a fully automated and Gated CI/CD
4. will need to Support different environment dev, qa, demo and live
5. Support auto scaling
6. Minimized the cost
7. Increase the operation efficiency 

I wanted to use the Kubernets for compute and use couple of azure pass services like Azure Sql Database, ACR etc.
One of first challenge was to find the k8s environment which support the hybrid scenario and AKS was at Rescue.
We have to use the windows node for .net framework images, but we wanted to use Linux node for angular app and new .net core api.

<img src='/assets/newsytem_aks.png'>

###  **New Architecture using Azure Devops and AKS**

Going forward I am going to describe the challenges faced and how we overcome those challenges.

### Deploy Hybrid AKS Cluster

[Windows Server container on AKS](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli)

### **Update .net Framework image at runtime**
 Since  there was around 10 services written in .Net Framework one of the major challenges was how to use the same image in different environment(dev,qa,demo,live) and use the appSetings and connectionString based on aks namespace and environment.
 I was sure about using the environment variable in aks deployment still not sure how to use environment variable in .Net Framework apis.
### Thanks to **Anthony Chu** for [ASP.NET Web.config Transforms in Docker Containers](https://anthonychu.ca/post/aspnet-web-config-transforms-docker-containers/)

 With the help of this I was able to change the appSettings and web.config based on environment.
 Still I was facing one  challenge: Updated the connection string for edmx file. I  tried different combination but could not succeed due to " in connection string.
This is how I have solved it. 

```c#
public partial class MyEntities : DbContext
    {
        static string ConnStr = $"metadata=res://*/Entities.MyEntityModel.csdl|res://*/Entities.MyEntityModel.ssdl|res://*/Entities.MyEntityModel.msl;provider=System.Data.SqlClient;provider connection string=\"{ConfigurationManager.ConnectionStrings["MyEntities"].ConnectionString}\"";
        public MyEntities()
             : base(ConnStr)
        {
        }
    }
```

I was changing the  DbContext string at runtime and was able to achieve the change of edmx  connection string at runtime in container.
### Azure File Share for AKS Volume 
While hosting on single VM we were using local storage for images and docs and we were able to share these path across the services. Now we need to use the same code in AKS also.
Again Azure File share was at rescue.
1. Create Azure Storage account
2. Create File Share
3. Note the storage account credential 
3. Create a secret in AKS and assign the Storage credential
4. Mount the file share as Volume in aks

sample AKS deployment file

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mypodapi-#{namespace}#
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mypodapi-#{namespace}#
  template:
    metadata:
      labels:
        app: mypodapi-#{namespace}#
    spec:
      nodeSelector:
        "beta.kubernetes.io/os": windows
      containers:
      - name: mypodapi-#{namespace}#
        image: acr.azurecr.io/image:#{Build.BuildId}#
        resources:
          limits:
            cpu: "0.15"
            memory: 500M
          requests:
            cpu: "0.05"
            memory: 300M
        env:
        - name: APPSETTING_imageurl
          value: "https://sampleurl.com"
       
        volumeMounts:
          
          - name: resumes
            mountPath: "C:\\inetpub\\wwwroot\\MyFolder\\Resumes"
          - name: images
            mountPath: "C:\\inetpub\\wwwroot\\MyFolder\\Images"
          - name: videos
            mountPath: "C:\\inetpub\\wwwroot\\MyFolder\\Videos"
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: registrysecret
      volumes:
        - name: resumes
          azureFile:
            secretName: azure-secret
            shareName: myshare
            readOnly: false
        - name: images
          azureFile:
            secretName: azure-secret
            shareName: myshare
            readOnly: false
        - name: videos
          azureFile:
            secretName: azure-secret
            shareName: myshare
            readOnly: false
```

**Pros Of using Azure File Share**
1. One of best thing,  I was easily able to migrate the existing files from local VM to Azure File share
2. No code change required  for using azure File share.(even local file path hardcoded in code (not the best practise) as you can see in example deployment code) 
2. It is super easy to configure/use  and cost effective
4. Of Course it provide other in built feature like HA and DR.     

### Angular Docker Container runtime variables
We were also facing the same issue of updating the Linux container at runtime as we need to deploy the same image in different environment. This is how we have solved it.  
1. **Create a setting class**
``` Javascript
export class Settings {
  
    emailVaild: string;
    valdiateUser: string;
}
```
2. **Create a service class**

``` JavaScript
import { Settings } from './settings';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    public settings: Settings;

    constructor() {
        this.settings = new Settings();
    }
}
``` 

3. **Create a Http service to read settings from assets folder**

```JavaScript

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Settings } from './settings';

@Injectable({ providedIn: 'root' })
export class SettingsHttpService {

    constructor(private http: HttpClient, private settingsService: SettingsService) {
    }

    initializeApp(): Promise<any> {

        return new Promise(
            (resolve) => {
                this.http.get('assets/settings.json')
                    .toPromise()
                    .then(response => {
                            this.settingsService.settings = response as Settings;
                            resolve();
                          
                        }
                    )
            }
        );
    }    
}

```

4. **Create a template setting file in asset folder**
```json
{
 "emailVaild": "https://identityapi-dev.abc.com/api/ValidateEmail?",
  "valdiateUser":"https://profileapi-dev.abc.com/api/ValidateUser",
  }
```
5. **create a setting template file**

```json
{
    "emailVaild": "${Identity_URL}/api/ValidateEmail?",
     "valdiateUser":"${Profile_URL}/api/ValidateUser",
}

```

6. **Passing the environment variable to container**

```Yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myimage-#{namespace}#
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myimage-#{namespace}#
  template:
    metadata:
      labels:
        app: myimage-#{namespace}#
    spec:
      nodeSelector:
        "beta.kubernetes.io/os": linux
      containers:
      - name: myimage-#{namespace}#
        image: arc.azurecr.io/myimage:#{Build.BuildId}#
        
        resources:
          limits:
            cpu: "0.05"
            memory: 200M
          requests:
            cpu: "0.025"
            memory: 100M
        env:
        - name: Identity_URL
          value: "https://identity#{host}#.com"
        - name: Profile_URL
          value: "https://emailapi#{host}#.com"

        
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: registrysecret
```
**Inject  environment variable in  Angular Image using envsubst**
```Yaml
# Step 1: Build the app in image 'builder'
FROM node:10.16-alpine AS builder

WORKDIR /usr/src/app
COPY . .
RUN npm ci && npm run build

# Step 2: Use build output from 'builder'
FROM nginx:stable-alpine
LABEL version="1.0"

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/mysource/  .
CMD ["/bin/sh",  "-c",  "envsubst </usr/share/nginx/html/assets/settings.template.json> /usr/share/nginx/html/assets/settings.json && exec nginx -g 'daemon off;'"]

```
**Version control for Database**
One of the challenge was to deploy the database script in different database without any discrepancy and manual intervention.
Again Sql DACPAC was at rescue.
1. Created a Sql DACPAC project
2. Completed a Azure Pipe line in Azure Devops
3. Created Release for different environment. 

Will add more detail for each steps.
{% if page.comments %} {% include disqus.html %} {% endif %}

