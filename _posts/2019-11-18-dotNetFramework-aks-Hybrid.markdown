---
layout: post
title:  "Migrating Legacy .Net Framework To Aks"
date:   2019-11-18 13:36:37 +0530
categories: Aks
---
I got Oppertunity to Migrate a existing  Legacy app to host in AKS.
It has mainlly two Part 
1. Couple of SPA  in  Angular
2. around 10 Services written in .Net Framework 4.6 

**Current Challenges**  
1. Developer were building locally and deploying mannully
2. Lots of config issues while moving from Dev to Prod
3. Typical works locally but not in production problem
4. No Guarantee of build in prodction is what signed of by SQE team
5. Can not revert the changes to previous build
6. Lots of time wasted in supporting the live enviroment
7. Lots of database change issue due to manuall deployment
8. No version control for Database script   

<img src='/assets/existingsytem_aks.png' >

**Few constraints**
1. Can not move services to .Net Core
2. will need to use .net Frmaework only api
3. Provide a fully automated and Gated CI/CD


