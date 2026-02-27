// Canton-Compatible Identity Generator
// All cryptographic operations run locally in the browser via Web Crypto API
// No data is transmitted to any server

export interface CantonIdentity {
  identityId: string;
  publicKey: string;
  encryptedPrivateKey: string;
  createdAt: string;
  type: "canton-compatible-identity";
}

/**
 * Generates a Canton-compatible Ed25519 keypair, derives AES key from password,
 * encrypts the private key, and computes the Identity ID (SHA-256 of public key).
 */
export async function generateCantonIdentity(password: string): Promise<CantonIdentity> {
  // 1. Generate Ed25519 keypair
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  );

  // 2. Export public key as raw bytes → base64
  const publicKeyBuffer = await window.crypto.subtle.exportKey("raw", keyPair.publicKey);
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);

  // 3. Export private key as PKCS8
  const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  // 4. Derive AES-256-GCM key from password using PBKDF2
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const aesKey = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // 5. Encrypt private key with AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedPrivateKey = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    privateKeyBuffer
  );

  // 6. Combine: salt (16) + iv (12) + ciphertext → base64
  const combined = new Uint8Array(salt.length + iv.length + encryptedPrivateKey.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(encryptedPrivateKey), 28);
  const encryptedPrivateKeyBase64 = arrayBufferToBase64(combined.buffer);

  // 7. Identity ID: SHA-256 of public key bytes → hex
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", publicKeyBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const identityId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return {
    identityId,
    publicKey: publicKeyBase64,
    encryptedPrivateKey: encryptedPrivateKeyBase64,
    createdAt: new Date().toISOString(),
    type: "canton-compatible-identity",
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Checks whether the current browser supports Ed25519 key generation.
 */
export async function checkEd25519Support(): Promise<boolean> {
  try {
    await window.crypto.subtle.generateKey(
      { name: "Ed25519" },
      false,
      ["sign", "verify"]
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Evaluates password strength: 'weak' | 'medium' | 'strong'
 */
export function evaluatePasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

/**
 * Triggers a JSON file download.
 */
export function downloadIdentityFile(identity: CantonIdentity): void {
  const json = JSON.stringify(identity, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `canton-identity-${identity.identityId.slice(0, 8)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
