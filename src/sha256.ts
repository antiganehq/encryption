// SHA256 implementation
export class SHA256 {
  private static readonly K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  private static rightRotate(n: number, d: number): number {
    return (n >>> d) | (n << (32 - d));
  }

  public static async hash(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const blocks: number[][] = [];
    let currentBlock: number[] = [];
    
    // Convert to blocks of numbers
    for (let i = 0; i < data.length; i++) {
      currentBlock.push(data[i]);
      if (currentBlock.length === 64) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    }

    // Add padding block
    const lastBlock = currentBlock;
    const messageLengthBits = data.length * 8;
    lastBlock.push(0x80); // Add 1 bit followed by zeros

    // Add zeros until block has room for length
    while ((lastBlock.length + 8) % 64 !== 0) {
      lastBlock.push(0);
    }

    // Add message length as 64-bit big-endian integer
    for (let i = 7; i >= 0; i--) {
      lastBlock.push((messageLengthBits >>> (i * 8)) & 0xff);
    }

    blocks.push(lastBlock);

    // Initialize hash values
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    // Process each block
    for (const block of blocks) {
      const w = new Array(64);

      // Copy block into first 16 words
      for (let i = 0; i < 16; i++) {
        w[i] = (block[i * 4] << 24) | (block[i * 4 + 1] << 16) |
               (block[i * 4 + 2] << 8) | block[i * 4 + 3];
      }

      // Extend first 16 words into remaining 48 words
      for (let i = 16; i < 64; i++) {
        const s0 = this.rightRotate(w[i - 15], 7) ^
                   this.rightRotate(w[i - 15], 18) ^
                   (w[i - 15] >>> 3);
        const s1 = this.rightRotate(w[i - 2], 17) ^
                   this.rightRotate(w[i - 2], 19) ^
                   (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];

      // Compression function
      for (let i = 0; i < 64; i++) {
        const S1 = this.rightRotate(e, 6) ^
                   this.rightRotate(e, 11) ^
                   this.rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + this.K[i] + w[i]) >>> 0;
        const S0 = this.rightRotate(a, 2) ^
                   this.rightRotate(a, 13) ^
                   this.rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      // Update hash values
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
      h5 = (h5 + f) >>> 0;
      h6 = (h6 + g) >>> 0;
      h7 = (h7 + h) >>> 0;
    }

    // Convert hash values to hex string
    return [h0, h1, h2, h3, h4, h5, h6, h7]
      .map(h => h.toString(16).padStart(8, '0'))
      .join('');
  }
}
