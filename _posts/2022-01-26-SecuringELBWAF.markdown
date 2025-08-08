---
layout: post
comments: true
IDENTIFIER: ELB 
title:  "Securing ELB Behind Cloud Front "
description: AWS | ELB | WAF | CloudFront | TLS |
date:   2022-01-26 11:36:37 +0530
categories: AWS
---
I was writing a secure, scalable and highly available web app using below architecture on AWS. 
1. For Database I have decided to use RDS with Multi-AZ Deployment.
2. For compute I was using Auto Scaling EC2 Instances behind a Application  Load Balancer.
3. I have used public subnet to host my ELB and separate private subnet to host my application server and RDS database.

I was also planning to use WAF and TLS termination at my ELB. 
To improve my apps performance for my Global user I have also decide to use  Cloud Front. 
Now I can put my TLS termination and WAF at the Cloud Front also. I have decide to use WAF and TLS termination at Cloud Front for below benefits. 

1. Since WAF Rule will get executed  at Edge Location It wil reduce Load on my ELB.
2. Since TLS termination wil also take place at Edge location again it will  reduce load on my ELB.

These two operation will need a small compute, so I have decided  to use edge location for these task. Since my ELB is still accessible from internet and if someone decide to call ELB end point from internet they can skip those validation.
In this article  I will mainly talk how to secure the ELB behind CLoud Front so that ELB can be called from only Cloud Front.  
This solution io not specific to any particular situation this is more about how securing the ELB behind the Cloud Front.      
 
<img alt='AWS' src='/assets/ELBWAF.png'>

I though about a monitoring the IP cloud Front IP address and keep on  updating it at ELB  Security Group But it seems to be a more complex and i was not sure about it.

Here I am thinking about using custom header at Cloud Front 


**1. Create a Custom Header**
 Create a custom header at Cloud Front and assign some guid value.
<img alt='AWS' src='/assets/customheader.png'>

**2. Update the ELB Rule:** 
Create  a new ELB rule for custom header validation with 100 % traffic to your target Group.
Update the existing rule(without heard) to return any error code may be 403.

<img alt='AWS' src='/assets/elb.png'>

Validate your setup by sending the request to Cloud Front and ELB. While  Cloud Front should return the expected response and ELB should return the configured error code.

I wil see how i can automate this with Terraform/ CloudFormation.  



