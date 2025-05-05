---
layout: post
comments: true
IDENTIFIER: IoT 
title:  "Secure Boot in  IoT  Soc"
description: Secure Boot | Immutable Boot |Red| IoT| Security|SoC
date:   2025-04-20 11:36:37 +0530
categories: IoT
---
<img alt='Secure Boot' src='/assets/SecureBoot.png'>

One of the mandet from [EU RED Cybersecurity Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R030)
is 
## Software update mechanisms: OTA (Over-the-Air) updates must be secure and verifiable.
Let see what is Secure Boot and how it will help us in achiving the same.

Secure Boot is a hardware-rooted security mechanism that ensures a device boots using only trusted firmware and software.

**It prevents:**
- Malware or unauthorized code from executing during boot.
- Rollback attacks by verifying firmware version integrity.

## **🧠 Secure Boot Architecture in a Chipset**
1. **Root of Trust (RoT) Definition:** Immutable code stored in ROM (Read-Only Memory) inside the chipset.

**Purpose:** Verifies the authenticity of the next boot stage.

**Implemented As:**

- Hardcoded bootloader hash or public key
- ROM-based signature validation logic

**2. Boot ROM**
The first code executed on power-on.

Performs cryptographic validation (typically RSA/ECDSA) of:
- The first-stage bootloader
- Using digital signatures and a public key embedded in ROM

**3. Chain of Trust**
- Each boot stage cryptographically verifies the next:
- Boot ROM → 1st Stage Bootloader → 2nd Stage Bootloader → OS Kernel → Trusted App/OS
- If any step fails verification:
  - Boot halts
  - Optionally enters recovery mode

**4. Cryptographic Elements**
- Asymmetric crypto (RSA, ECDSA): for verifying signatures
- Symmetric crypto (AES, HMAC): for encrypting or authenticating firmware
- Hashing (SHA-256/512): to ensure data integrity

**5. Anti-Rollback Protection**
- Uses a monotonic counter or version fuse (eFuses or OTP memory)
- Prevents firmware downgrade attacks

**6. Key Storage**
- Public key: burned into ROM or eFuses
- Private key: securely held by the firmware signing authority (not on-chip)

**7. Firmware Update Support**
- Only signed updates are accepted
- Version check prevents downgrading

Some platforms support encrypted firmware as well

## **🔄 Secure Boot Flow Summary**

1. **Power On**

   ↓
2. **Boot ROM (RoT)**
   - Verifies 1st Bootloader Signature

   ↓
3. **1st Bootloader**
   - Verifies 2nd Bootloader

   ↓
4. **2nd Bootloader / Kernel**
   - Verifies OS or Trusted Apps

   ↓
5. **System Ready**

## **🔧 Example in Practice**
For an IoT SoC (e.g.,NRF, NXP, STMicro, Qualcomm):
- Boot ROM is fixed in silicon.
- Secure Key Storage in eFuses or OTP memory.
- Bootloader uses X.509 certificates for chain-of-trust.
- Anti-rollback via version field in firmware and fuse-based version checks.

## **✅ Benefits**
- Ensures system starts in a known-good state
- Protects against bootloader or firmware tampering
- Forms the foundation for Trusted Execution Environments (TEE) and Secure Firmware Updates

## **⚠️ Challenges**
- Complex key management
- Device bricking if Secure Boot keys or policies are misconfigured
- Performance overhead during boot (mitigated with hardware acceleration)
## **🔒 Chipset Verification** 

Chipset secucity level can be validated at Platform Security Architecture [PSA](https://www.psacertified.org/)
There are 3 Level of security
- **Level 1**: This is the foundational level, focusing on security best practices. It involves a questionnaire-based assessment to ensure compliance with baseline security requirements. It is ideal for demonstrating basic security measures
- **Level 2**: This level provides protection against scalable software attacks. It includes lab-based evaluations and vulnerability analysis to ensure the robustness of the device's security features
- **Level 3**: The highest level, designed for devices requiring substantial assurance against both software and hardware attacks. It involves rigorous testing, including penetration tests and side-channel analysis, to verify the device's resilience

# For RED compliance, Level 3 is recommended.	


{% if page.comments %} {% include disqus.html %} {% endif %}
