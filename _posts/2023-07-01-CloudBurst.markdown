---
layout: post
comments: true
IDENTIFIER: HCI 
title:  "Cloud Bursting with the Rise of Private Cloud"
description: Private Cloud | Azure Stack HCI |HCI| Azure
date:   2023-07-01 11:36:37 +0530
categories: HCI
---
With the rise of Private Cloud there is again the discussion how to utilize/ optimize the Capex in enterprise private cloud. Private Cloud is need of the house based on different requirment specially the data locality and full control over the cloud. Though almost all the Private Cloud Provider support the scale you can start from two node cluster and scale based on your need. But this scale is not going to as instantaneously as in Public Cloud. Off course it require the hardware and that may take some time may be a month. Even though you can plan your capacity but bottom line is it is going to take some time to scale your private cluster. This is one scenario and there are many more apps which only need to scale once in a year e.g. results.
So what is Cloud Burst and how it is going to help?
Cloud Bursting is a process which will help your workload to run from private and public cloud on demand basis.
Next step is to identify which workload can be run on public cloud. If your all the work load can be run on public cloud then it means you dont need a private cloud in first place and use the public cloud itself.
I think identifying the work load is most important part in cloud bursting solution design.
Let say a workload has three component compute, database and supporting services. I think we can move the compute to public cloud and use still access the database and supporting service from on- premise using cloud express.
One the question is Latency that can be solved using caching and this where application design comes in to the picture.     
 
<img alt='AWS' src='/assets/demo.png'>

### Let see how the flow works and what are the component used.
1. User put xyz.com url in browser
2. That request will go to a recursive DNS
3. DNS will resolve to a Traffic Manager (DNS based Load balancer).
4. In Traffic Manager By default On-Premise end point will be enabled and pointing to the public IP of on-premise Load balancer.
5. After the DNS resolution user browser will receive the public IP of On-Premise Load balancer and will start sending the request to the on-premise Load balancer.

This is the typical flow and it is how request will served to the end user.
Now let say the CPU uses for the on-premise work load is more than 80% or any other Trigger condition.

6. It will call a [Azure Functions](https://azure.microsoft.com/en-us/products/functions/)
7. Azure function will enable the cloud endpoint in [Traffic Manager](https://azure.microsoft.com/en-us/products/traffic-manager/) and apply the weight to the endpoint. Now both the end point are enabled.

We can write more intelligent function e.g. if there is more utilization on-premise then it will keep adding the weight of cloud end point.

8. Different User put xyz.com url in browser
9. That request will go to a recursive DNS
10. DNS will resolve to a [Traffic Manager](https://azure.microsoft.com/en-us/products/traffic-manager/)  (DNS based Load balancer).
In Traffic Manager since both the endpoint are enabled based on weight let say it returned the Cloud Load balancer Public IP .
11. After the DNS resolution user browser will receive the public IP of Cloud Load balancer and will start sending the request to the cloud Load balancer.
12. Cloud App is also hosted in scale set will send the response
13. Cloud App will call the On-premise supporting service via express route
14. Cloud App will call the On-premise database via express route

IN case my on-prese utilization goes down it will trigger the [Azure Functions](https://azure.microsoft.com/en-us/products/functions/) again which in turn will disable the cloud endpoint and going forward all the request will be served by the On-Premise Load balancer only.

### Enable/Disable Traffic Manager End point

```c#
var tm= armClient.GetTrafficManagerEndpointResource(new ResourceIdentifier("/subscriptions/.."))
tm = await tm.GetAsync();
tm.Data.EndpointStatus=TrafficManagerEndpointStatus.Enabled;
tm.Update(tm.Data);
```
### Update the Scaleset

```c#
ArmClient armClient = new ArmClient(new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = "" } ))
// Now we get a ResourceGroupResource collection for that subscription
var scalset=armClient.GetAutoscaleSettingResource(new ResourceIdentifier("/subscriptions/.."));
scalset=await scalset.GetAsync();
scalset.Data.Profiles[0].Capacity.Minimum=1;
scalset.Data.Profiles[0].Capacity.Default=1;
AutoscaleSettingPatch patch = new AutoscaleSettingPatch()
            {AutoscaleSettingName=scalset.Data.AutoscaleSettingName,
            IsEnabled=scalset.Data.IsEnabled,
            Notifications=scalset.Data.Notifications,
        TargetResourceId=scalset.Data.TargetResourceId,
        TargetResourceLocation=scalset.Data.TargetResourceLocation,
                  Profiles =   {    scalset.Data.Profiles[0] }
    };
scalset.Update (patch);
```


{% if page.comments %} {% include disqus.html %} {% endif %}
