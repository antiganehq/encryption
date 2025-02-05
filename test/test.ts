// test/encryption_test.ts
import { createEncryptionService } from '../src/index';

async function runTests() {
    const encryptionService = createEncryptionService();
    const message = "Pesan rahasia saya";
    const password = "password123";

    try {
        if (encryptionService.isLockOpen()) {
            console.log('OpenLock is active.');
        } else {
            console.error('OpenLock not activate.');
        }
        // Contoh enkripsi
        console.log('Encrypting message:', message);
        const encrypted = await encryptionService.encrypt(message, password);
        console.log('Encrypted data:', encrypted.data);

        // Contoh dekripsi
        console.log('\nDecrypting message...');
        const decrypted = await encryptionService.decrypt(encrypted, password);
        console.log('Decrypted message:', decrypted);

        // Verifikasi hasil
        if (decrypted === message) {
            console.log('Test passed: Decrypted message matches the original.');
        } else {
            console.error('Test failed: Decrypted message does not match the original.');
        }

        // Contoh penggunaan OpenLock
        console.log('\nTesting OpenLock feature...');
        await encryptionService.openLock(0.1, password);
        if (encryptionService.isLockOpen()) {
            console.log('OpenLock is active.');
        } else {
            console.error('OpenLock failed to activate.');
        }

        // Enkripsi tanpa password setelah lock terbuka
        const dcc = await encryptionService.decrypt(encrypted);
        console.log('Decrypted message with OpenLock:', dcc);

    } catch (error) {
        console.error('Error during testing', error);
    }
}

// Jalankan pengujian
runTests().catch(console.error);
