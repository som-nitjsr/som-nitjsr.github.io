---
layout: post
comments: true
IDENTIFIER: ELB
title: "Secure an ALB Behind CloudFront: WAF + TLS at the Edge (Prevent Origin Bypass)"
description: "How to secure an AWS Application Load Balancer (ALB) behind CloudFront so users can’t bypass WAF/TLS at the edge—using a custom header check and listener rules."
date:   2022-01-26 11:36:37 +0530
categories: AWS
image: /assets/ELBWAF.png
featured: true
featured_section: Security & Innovation
featured_rank: 3

tags: [AWS, CloudFront, ALB, WAF, Security]
---
When you put **AWS WAF** and **TLS termination** on **CloudFront**, you get protection and performance at the edge. But there’s a common gap: users can still call your **ALB (origin)** directly and bypass those edge controls unless you explicitly block “origin bypass”.

This post shows one simple pattern to secure an **Application Load Balancer (ALB) behind CloudFront** so the ALB only serves requests that came through CloudFront.

## Reference architecture
I was building a secure, scalable, and highly available web app using this AWS setup:
- **Database**: Amazon RDS (Multi-AZ)
- **Compute**: Auto Scaling EC2 instances behind an **Application Load Balancer (ALB)**
- **Networking**: public subnets for the ALB, private subnets for app servers and the RDS database

I initially planned to use WAF and TLS termination at the ALB. But to improve performance for global users, I decided to place **CloudFront** in front—then move **WAF** and **TLS termination** to CloudFront for:

- **Lower ALB load**: WAF rules run at edge locations
- **Lower TLS overhead**: TLS handshakes terminate at the edge

## The problem: origin bypass
Even with CloudFront in front, your ALB is still internet-reachable. If someone calls the ALB DNS name directly, they can bypass the WAF/TLS configuration you placed on CloudFront.

The goal is simple: **the ALB should only accept requests forwarded by CloudFront**.
 
<img alt="AWS architecture: CloudFront in front of ALB with WAF and TLS termination at the edge" src="/assets/ELBWAF.png">

I considered monitoring CloudFront IP ranges and updating the ALB security group, but that felt operationally complex.

Instead, here’s a pragmatic approach: **have CloudFront add a secret custom header**, and configure the **ALB listener** to only forward requests that contain that header.

## Solution: CloudFront custom header + ALB listener rule

### 1) Create a custom header in CloudFront
In your CloudFront origin request settings, add a custom header with a hard-to-guess value (treat it like a secret).

<img alt="CloudFront origin configuration showing a custom header for origin authentication" src="/assets/customheader.png">

### 2) Add an ALB listener rule to validate the header
- Create a new ALB listener rule that checks for the custom header and forwards **100%** traffic to your target group.
- Update the default / existing rule (without the header) to return an error like **403 Forbidden**.

<img alt="ALB listener rules validating CloudFront custom header before forwarding to target group" src="/assets/elb.png">

### 3) Validate
- Request via **CloudFront** → should return your expected app response
- Request the **ALB** directly → should return **403** (or your configured error response)

## Hardening notes (recommended)
- **Rotate the secret header value** periodically (and whenever you suspect leakage).
- **Keep WAF at CloudFront** for edge protection, but consider also having basic protections at the ALB if your risk warrants it.
- If feasible in your environment, prefer network-based restriction too (e.g., limiting inbound origin access to CloudFront origin-facing IP ranges / managed prefix lists), and use the header check as defense-in-depth.

## FAQ
### Is a custom header enough to stop origin bypass?
It’s a strong and widely used control. For higher assurance, combine it with network restrictions (security group rules) and monitoring/alerting on direct ALB hits.

### What error code should the ALB return for direct requests?
Common choices are **403** (forbidden) or **404** (not found). 403 is clearer for operators; 404 can reduce signal to attackers.

### Can I automate this with Terraform or CloudFormation?
Yes—CloudFront origin custom headers and ALB listener rules are both automatable. (I’ll add an infra-as-code version in a follow-up.)



