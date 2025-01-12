Antigene Encryption
A TypeScript implementation of Lattice-based Cryptography for secure message encryption and decryption.
Features

Lattice-based encryption algorithm
Password-based encryption
Secure random number generation
Base64 encoded output
Customizable parameters for security levels
TypeScript support with full type definitions

Installation
bashCopynpm install antigene-encryption
Usage
typescriptCopyimport { createEncryptionService } from 'antigene-encryption';

// Basic Example
async function example() {
// Create an encryption service instance
const encryptionService = createEncryptionService();

// Encrypt a message
const message = "Hello, World!";
const password = "mySecurePassword";

const encrypted = await encryptionService.encrypt(message, password);
console.log('Encrypted:', encrypted);

// Decrypt the message
const decrypted = await encryptionService.decrypt(encrypted, password);
console.log('Decrypted:', decrypted); // "Hello, World!"
}

// Custom Parameters Example
const m = 256; // Matrix width
const n = 128; // Matrix height
const q = 4093; // Modulus
const customEncryption = createEncryptionService(m, n, q);
API Reference
createEncryptionService(m?: number, n?: number, q?: number)
Creates a new instance of the encryption service with optional parameters:

m: Matrix width (default: 128)
n: Matrix height (default: 64)
q: Modulus (default: 2053)

encrypt(msg: string, password: string): Promise<EncryptedData>
Encrypts a message using the provided password.
decrypt(encryptedData: EncryptedData, password: string): Promise<string>
Decrypts an encrypted message using the provided password.
Types
typescriptCopyinterface EncryptionParams {
A: number[][];
E: number[];
q: number;
}

interface EncryptedData {
data: string;
params: EncryptionParams;
}
Security Considerations

Based on Learning With Errors (LWE) problem
Use strong passwords
Default parameters balance security and performance
Increase matrix dimensions (m, n) for higher security

Requirements

Node.js version 12+
Web Crypto API support
Buffer support

License
MIT
Contributing
Contributions welcome! Please submit Pull Requests.
