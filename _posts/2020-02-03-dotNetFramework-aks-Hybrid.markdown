---
layout: post
comments: true
PAGE_URL: https://som-nitjsr.github.io/ 
PAGE_IDENTIFIER: aks_1 
title:  "Migrating Legacy .Net Framework To Aks"
date:   2020-02-03 13:36:37 +0530
categories: Aks
---
I got Oppertunity to Migrate a existing  Legacy app to host in AKS.
It has mainlly two Part 
1. Couple of SPA  in  Angular
2. around 10 Services written in .Net Framework 4.6 

It is a part of Applied Cloud Stories initiative [https://aka.ms/applied-cloud-stories](https://aka.ms/applied-cloud-stories)

**Current Challenges**  
1. Developer were building locally and deploying mannully
2. Lots of config issues while moving from Dev to Prod
3. Typical works locally but not in production problem
4. No Guarantee of build in prodction is what signed off by SQE team
5. Can not revert the changes to previous build
6. Lots of time wasted in supporting the live enviroment
7. Lots of database change issue due to manuall deployment
8. No version control for Database script   

<img src='/assets/existingsytem_aks.png' >

**Few Expection from  new solution**
1. Can not modify the code  
2. will need to use .net Frmaework only api
3. Provide a fully automated and Gated CI/CD
4. will need to Support different environment dev, qa,demo and live
5. Support auto scalling
6. Minimized the cost
7. Increase the operation efficieny 

I wanted to use the Kubernets for compute and use couple of azure pass services like Azure Sql Database, ACR etc.
One of first challenge was to find the k8s environment which support the hybrid scenario and AKS was at Rescue.
We have to use the windows node for .net framework images, but we wanted to use linux node for angular app and new .net core api.

<img src='/assets/newsytem_aks.png'>

###  **New Architecture uisng Azure Devops and AKS**

Going forward I am going to describe the challenges faced and how we overcome those challenges.

### Deploy Hybrid Aks Cluster

[Windows Server container on AKS](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli)

### **Update .net Framework image at runtime**
 Since  there was around 10 services written in .Net Framework one of the major challenges was how to use the same image in different environment(dev,qa,demo,live) and use the appsetings and connectionString based on aksnamespace and environment.
 I was sure about using the environment varaibale in aks deployment still not sure how to use environment variable in .Net Framework apis.
### Thanks to **Anthony Chu** for [ASP.NET Web.config Transforms in Docker Containers](https://anthonychu.ca/post/aspnet-web-config-transforms-docker-containers/)

 With the help of this I was able to change the appSettings and web.config based on environment.
 Still I was facing one  challege: Updated the connection string for edmx file. I can tried different conbination but could not suceed due to " in connection string.
This is how I have solved it. 

`public partial class MyEntities : DbContext
    {
        static string ConnStr = $"metadata=res://*/Entities.MyEntityModel.csdl|res://*/Entities.MyEntityModel.ssdl|res://*/Entities.MyEntityModel.msl;provider=System.Data.SqlClient;provider connection string=\"{ConfigurationManager.ConnectionStrings["MyEntities"].ConnectionString}\"";
        public EsolvitEntities()
             : base(ConnStr)
        {
        }
    }
`

I was changing the  DbContext string at runtime and was able to achive the change of edmx  connection string at runtime in conatiner.
### Azure File Share for AKS Volume 
While hosting on single VM we were using local storage for images and docs and we were able to share these path across the services. Now we need to use the same code in AKS also.
Again Azure File share was at rescue.
1. Create Azure Storage account
2. Create File Share
3. Note the storage account credential 
3. Create a secret in AKS and assign the Storage credential
4. Mount the file share as Volume in aks

sample AKS deployment file

`apiVersion: apps/v1
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
`
**Pros Of using Azure File Share**
1. One best thing was I was easily able to migrate the existing files from local VM to Azure File share
2. No code change required  for uisng azure File share.(even local file path as you can see in example deployment code) 
2. It is supper easy and cost effective
4. Of Course it provide other in build feature like HA and DR.     

### Angular Docker Container runtime variables
 coming soon  

**Continued.....**
{% if page.comments %} {% include disqus.html %} {% endif %}

