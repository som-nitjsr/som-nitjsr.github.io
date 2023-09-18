---
layout: post
comments: true
IDENTIFIER: HCI 
title:  "Sustainability In Private Cloud"
description: Private Cloud | Azure Stack HCI |HCI| Azure|Sustainability |Intel
date:   2023-09-01 11:36:37 +0530
categories: HCI
---
<img alt='AWS' src='/assets/me-Sustainability.png'>
I have had the opportunity to Design/Develop a couple of the biggest(in MW) Private Cloud Data Centers in the country. I am a big believer in Sustainable Development and try to contribute in my capacity. Today I will talk about how I got my passion in my professional life also.

**What is Sustainable Development?**

The [United Nations World Commission on Environment and Development](https://www.un.org/en/academic-impact/sustainability) defines sustainable development as “Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.”


**What is sustainability in Private Cloud?**

Sustainability in a private cloud refers to the practice of designing, implementing, and managing a private cloud infrastructure in an environmentally responsible and resource-efficient manner. Ensuring sustainability in a private cloud can help reduce the environmental impact, lower operational costs, and align with corporate social responsibility goals.
# There are already few considerations for Sustainable Data Center design.

- Use of Renewable Energy
- Cooling Efficiency
- Data Center Location
- Green certifications such as [LEED](https://www.usgbc.org/leed)


As a Cloud Solution Architect, I can contribute to our journey toward Net Zero for a better planet for our Future Generation.

We can always optimize our workload to reduce the cost and increase the efficiency.
Today I will focus on Hardware(**Servers**) as a Cloud Provider and how we can save ~ 20-30% power consumption without affecting the workload efficiency.

In CPU Processor power management technologies are defined in the ACPI specification and are divided into two categories or states:

# Power performance states (ACPI P states)
P-states provide a way to scale the frequency and voltage at which the processor runs so as to reduce the power consumption of the CPU. The number of available P-states can be different for each model of CPU, even those from the same family.
# Processor idle sleep states (ACPI C states)
C-states are states when the CPU has reduced or turned off selected functions. Different processors support different numbers of C-states in which various parts of the CPU are turned off. Generally, higher C-states turn off more parts of the CPU, which significantly reduces power consumption.
- C0: Operational State
- C1: First Idle State
- C2: Stops CPU Main internal clocks.
- C3: Stop all CPU internal Clocks.

**The basic logic behind this power saving is if there is no workload running change the CPU C-states to C1/C2 or C3 and save on power.**

As a application provider one of the main reservation is how it will impact application performance and how much latency it will add.
Thanks to [4th Generation Intel® Xeon Processor](https://ark.intel.com/content/www/us/en/ark.html#@Processors) state change latency is in **micro second** and will not have any impact on workload.

These C-states changes have been validated on Telco workload where packet drops are not acceptable. For IT workloads that run over TCP/IP, there is no issue at all.
Sustainability in a private cloud is not only beneficial for the environment but can also lead to cost savings and improved corporate reputation. It aligns with the broader trend of organizations incorporating sustainability into their business strategies and operations.

**For a Better future of the Next Generations**

{% if page.comments %} {% include disqus.html %} {% endif %}
