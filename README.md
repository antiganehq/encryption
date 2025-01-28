# Antigene Encryption

A TypeScript implementation of Lattice-based Cryptography for secure message encryption and decryption.

## Installation

Install @antigene/encryption with npm

```bash
  npm install @antigene/encryption
```

## Usage

#### 1. Import Package

```typescript
import { createEncryptionService } from "@antigane/encryption";
```

#### 2. Create Instance Encryption

```typescript
const encryptionService = createEncryptionService();
```

- m : total field Matrics (default. 128)
- n : total column Matrics (default. 64)
- q : Mod for math operation (default. 2053)

#### 3. Encryption

```typescript
const encryptedData = await encryptionService.encrypt(
  "Hello, World!",
  "password"
);
console.log("Encrypted Data:", encryptedData.data);
```

#### 4. Decryption

```typescript
const decryptedMessage = await encryptionService.decrypt(
  encryptedData,
  "password"
);
console.log("Decrypted Message:", decryptedMessage);
```

## Example

```typescript
import { createEncryptionService } from "@antigane/encryption";

async function main() {
  const encryptionService = createEncryptionService();

  // Enkripsi pesan
  const encryptedData = await encryptionService.encrypt(
    "Hello, World!",
    "password"
  );
  console.log("Encrypted Data:", encryptedData.data);

  // Dekripsi pesan
  const decryptedMessage = await encryptionService.decrypt(
    encryptedData,
    "password"
  );
  console.log("Decrypted Message:", decryptedMessage);
}

main();
```

![Logo](https://avatars.githubusercontent.com/u/194663842?s=200&v=4)

## Authors

- [@ranaufalmuha](https://www.github.com/ranaufalmuha)
