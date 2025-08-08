---
layout: post
comments: true
URL: https://som-nitjsr.github.io/Azure/2020/12/24/AppleLoginWithAzureB2C.html
IDENTIFIER: OpenId_1 
title:  "Set up Apple sign-up and sign-in with OpenID Connect using Azure Active Directory B2C"
description: Apple Sign In| Azure|AD B2C| OpenId Connect| 
date:   2020-12-24 13:36:37 +0530
categories: Azure
---

I love Azure Ad B2C and have done couple of integration with multiple IDP like Microsoft, Google etc. But this time I wanted to try Apple Sign In.
I have followed [Authenticating Users with Sign in with Apple](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple)
**Current Challenges**  
 The main challenge was passing the email id and name from apple to Azure AD B2C.

The issue is apple provide the User info in custom payload 
```Json
{
 "user":
  {
  "fisrtanme":"fisrtname",
  "lastname":"lastname"
  }
}
```
At the end of this doc. you shall be able to configure the azure B2C App while give token with 3 claims email id, first name and last name.

**Pre Req**  
1. Register for Apple  Developer subscription at https://developer.apple.com
2. Have a account in azure Portal https://portal.azure.com/

This whole setup has below parts
1. Register a App in Apple
2. Create the service Id application  in the Apple Developer portal
3. Configure the OpenID connect In Azure AD B2C
4. Configure a sign In User flow.

**Register a App in Apple**

On the Register an App ID page, provide a app description and a bundle ID, and select **Sign in with Apple from the capabilities list**. Then click Continue and . 

**Create the service Id application**

Create a Service Id in Apple Developer account as Below 
make sure to select Sign in With Apple.
in Return Url put https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/oauth2/authresp

<img alt='Apple' src='/assets/applelogin.png'>

**Creating the client secret**

after creating the key On the Download Your Key page, download the key. It will download as a .p8 (PKCS#8) file - you'll use this to sign your client secret JWT. 
Apple does not use client id and secrets like other IDPs.it uses signed jwt token.
The JWT structure is 
```Json
{
  "alg": "ES256",
  "kid": "KId",
}.{
  "sub": "com.yourcompany.app1",
  "nbf": 1660203207,
  "exp": 16289607,
  "iss": "AppleTeamID",
  "aud": "https://appleid.apple.com"
}.[Signature]
```
I have used c# code to generate this jwt token 
```c#
  string audience = "https://appleid.apple.com";


            IList<Claim> claims = new List<Claim> {
        new Claim ("sub", "com.sat.serviceid")
    };

            CngKey cngKey = CngKey.Import(Convert.FromBase64String("MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg3sgkvrEC1"), CngKeyBlobFormat.Pkcs8PrivateBlob);

            SigningCredentials signingCred = new SigningCredentials(
                new ECDsaSecurityKey(new ECDsaCng(cngKey)),
                SecurityAlgorithms.EcdsaSha256
            );

            JwtSecurityToken token = new JwtSecurityToken(
                "appleTEAMID",
                audience,
                claims,
                DateTime.Now,
                DateTime.Now.AddDays(180),
                signingCred
            );
            token.Header.Add("kid", "Kid"); // Get it from downlaoded secret file name 
            token.Header.Remove("typ");

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            string jwt = tokenHandler.WriteToken(token);
```
We need this token while registering the OpenId connect in Azure B2C
### Apple does not accept more than 6 month token. 
**We Need to renew this token every 6 month** 

### I have not added more details in above steps as there are common for apple app registration.


**Configure the OpenID connect In Azure AD B2C**

Host the apple Metadata endpoint as below with URL ending /.well-known/openid-configuration
I have hosted it in blob storage you can host it any where.
Note this endpoint shall be anonymous.

```json
{
    "issuer": "https://appleid.apple.com",
    "authorization_endpoint": "https://appleid.apple.com/auth/authorize",
    "token_endpoint": "https://appleid.apple.com/auth/token",
    "jwks_uri": "https://appleid.apple.com/auth/keys"
}
```
Configure the OpenId connect as below in Azure AD B2C Identity Providers.
Choose OpenID Connect as the identity provider type and use these configuration values:

Metadata url: URL to the metadata endpoint you created
Client id: The Apple Service ID (e.g. com.mycompany.app1)
Client secret: The signed JWT you created
Scope: openid name email
Response type: code
Response mode: form_post
<img alt='Apple' src='/assets/openidconfig.png'>

**Configure a sign In User flow**

For the sign up from User only ask first name and last name in User Attributes.
<img alt='Apple' src='/assets/user attribute.png'>

In Claim Attributes select the 3 attributes.
<img alt='Apple' src='/assets/claim attributes.png'>

In user signup only ask for First Name and Last Name.
<img alt='Apple' src='/assets/user flow.png'>

### Note: While login in apple for the first time user has to allow the email id.


