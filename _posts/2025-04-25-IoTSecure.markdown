---
layout: post
comments: true
IDENTIFIER: IoT
title: "Secure Boot for IoT SoCs: Root of Trust, Chain of Trust, and Anti-Rollback"
description: "Secure boot explained for IoT SoCs: Boot ROM root of trust, signature verification, chain of trust, anti-rollback, and secure OTA updates aligned with EU RED."
date:   2025-04-25 11:36:37 +0530
categories: IoT
image: /assets/SecureBoot.png
featured: true
featured_section: Security & Innovation
featured_rank: 2
---
<img alt="Secure boot chain of trust and verification flow in an IoT SoC" src="/assets/SecureBoot.png">

Secure OTA (Over-the-Air) updates are only as strong as the device’s boot integrity. One of the key expectations in the [EU RED Cybersecurity Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R030) is that **software update mechanisms must be secure and verifiable**.

This post explains **secure boot for IoT SoCs** and how it forms the foundation for trustworthy firmware updates.

**Secure boot** is a hardware-rooted security mechanism that ensures a device boots using only **trusted, vendor-signed** firmware and software.

## Key takeaways
- Malware or unauthorized code from executing during boot.
- Rollback attacks by enforcing firmware version integrity (anti-rollback).
- “Bypass” of update security controls by ensuring only verified firmware can run.

## Secure boot architecture in an IoT SoC
### Root of trust (RoT)
Immutable code stored in ROM (Read-Only Memory) inside the chipset.

**Purpose**: Verify the authenticity of the next boot stage.

**Common implementations**:

- Hardcoded bootloader hash or public key
- ROM-based signature validation logic

### Boot ROM
The first code executed on power-on.

Performs cryptographic validation (typically RSA/ECDSA) of:
- The first-stage bootloader
- Using digital signatures and a public key embedded in ROM (or OTP/eFuses, depending on the SoC)

### Chain of trust
Each boot stage cryptographically verifies the next stage:

- Boot ROM → 1st stage bootloader → 2nd stage bootloader → OS kernel → trusted app/OS

If any step fails verification, the device typically:
- Halts boot, and/or
- Enters a recovery / DFU mode (platform-specific)

### Cryptographic elements
- Asymmetric crypto (RSA, ECDSA): for verifying signatures
- Symmetric crypto (AES, HMAC): for encrypting or authenticating firmware
- Hashing (SHA-256/512): to ensure data integrity

### Anti-rollback protection
Anti-rollback prevents firmware **downgrade** attacks (reinstalling an older, vulnerable image).

Common mechanisms:
- Monotonic counter / version fuses (eFuses or OTP memory)
- Signed firmware metadata including a version number that must monotonically increase

### Key storage and signing
- **Public key**: burned into ROM or stored in OTP/eFuses (device trust anchor)
- **Private key**: held by the firmware signing authority (never on the device)

### Secure firmware update (OTA) support
Secure boot is what makes OTA updates *verifiable*:
- Only signed updates are accepted
- Version checks prevent downgrades

Some platforms support encrypted firmware as well

## Secure boot flow summary

1. **Power on**

   ↓
2. **Boot ROM (RoT)**
   - Verifies 1st stage bootloader signature

   ↓
3. **1st stage bootloader**
   - Verifies 2nd stage bootloader

   ↓
4. **2nd stage bootloader / kernel**
   - Verifies OS or trusted apps

   ↓
5. **System Ready**

## Example in practice (typical IoT SoC)
For an IoT SoC (e.g., Nordic, NXP, STMicroelectronics, Qualcomm):
- Boot ROM is fixed in silicon.
- Trust anchor stored in ROM / OTP / eFuses (platform-specific).
- Bootloader may use X.509 certificates to represent a chain of trust.
- Anti-rollback via signed version metadata and/or fuse-based version checks.

## Benefits
- Ensures system starts in a known-good state
- Protects against bootloader or firmware tampering
- Forms the foundation for Trusted Execution Environments (TEE) and Secure Firmware Updates

## Challenges
- Complex key management
- Device bricking if Secure Boot keys or policies are misconfigured
- Performance overhead during boot (mitigated with hardware acceleration)

## Validating chipset security (PSA Certified)

Chipset security can be validated via Platform Security Architecture (PSA) certification: [PSA Certified](https://www.psacertified.org/).

There are three PSA Certified security levels:
- **Level 1**: This is the foundational level, focusing on security best practices. It involves a questionnaire-based assessment to ensure compliance with baseline security requirements. It is ideal for demonstrating basic security measures
- **Level 2**: This level provides protection against scalable software attacks. It includes lab-based evaluations and vulnerability analysis to ensure the robustness of the device's security features
- **Level 3**: The highest level, designed for devices requiring substantial assurance against both software and hardware attacks. It involves rigorous testing, including penetration tests and side-channel analysis, to verify the device's resilience

## FAQ
### Is secure boot required for EU RED compliance?
EU RED is a regulation (not a single “checklist”), but secure boot is commonly treated as a foundational control because it enforces **trusted firmware execution** and supports **verifiable updates**.

### Does secure boot automatically make OTA updates secure?
Not by itself. Secure boot ensures only trusted code runs at boot. For secure OTA, you also need **signed update packages**, **anti-rollback**, and a robust update/recovery strategy.

### Which PSA level should I target for EU RED?
It depends on your product risk profile and threat model. For higher assurance devices, **Level 3** is often used as a stronger benchmark.


