// encryption.ts  
import {SHA256}  from "./sha256";  
import {Base64}  from "./base64";  
  
export interface EncryptionParams {  
  A: number[][];  
  E: number[];  
  q: number;  
}  
  
export interface EncryptedData {  
  data: string;  
  params: EncryptionParams;  
}  
  
export class AntigeneEncryption {  
  private m: number;  
  private n: number;  
  private q: number;  
  private A: number[][];  
  private s: number[];  
  private e: number[];  
  
  constructor(m: number, n: number, q: number = 2053) {  
    this.m = m;  
    this.n = n;  
    this.q = q;  
    this.A = [];  
    this.s = [];  
    this.e = [];  
  }  
  
  private mod(x: number, q: number): number {  
    return ((x % q) + q) % q; // Simplified mod function  
  }  
  
  private getSecureRandom(max: number): number {  
    const timestamp = Date.now();
    const random = Math.sin(timestamp) * 10000;
    return this.mod(Math.floor(Math.abs(random)), max);
  }  
  
  private defineA() {  
    this.A = Array.from({ length: this.n }, () =>  
      Array.from({ length: this.m }, () => this.getSecureRandom(this.q))  
    );  
  }  
  
  private defineE() {  
    this.e = Array.from({ length: this.m }, () => this.mod(this.getSecureRandom(10), this.q));  
  }  
  
  private async generateHash(message: string): Promise<number[]> {  
    const hashHex = await SHA256.hash(message);
    const hashBytes: number[] = [];
    
    for (let i = 0; i < hashHex.length; i += 2) {
      const byte = parseInt(hashHex.substr(i, 2), 16);
      hashBytes.push(this.mod(byte, this.q));
    }
    
    return hashBytes;
  }  
  
  private async sVector(password: string) {  
    const hashValues = await this.generateHash(password);  
    this.s = hashValues.slice(0, this.n);  
  
    while (this.s.length < this.n) {  
      this.s.push(this.s[this.s.length % hashValues.length]);  
    }  
  }  
  
  private calculateB(): number[] {  
    const tempAS: number[][] = Array.from({ length: this.A.length }, () => Array(this.A[0].length).fill(0));  
  
    for (let i = 0; i < this.A.length; i++) {  
      for (let j = 0; j < this.A[0].length; j++) {  
        tempAS[i][j] = this.mod(this.s[i] * this.A[i][j], this.q);  
      }  
    }  
  
    const result = Array(this.m).fill(0);  
    for (let i = 0; i < this.m; i++) {  
      for (let j = 0; j < this.n; j++) {  
        result[i] = this.mod(result[i] + tempAS[j][i], this.q);  
      }  
    }  
  
    return result.map((val, idx) => this.mod(val + this.e[idx], this.q));  
  }  
  
  async encrypt(msg: string, password: string): Promise<EncryptedData> {  
    this.defineA();  
    this.defineE();  
    await this.sVector(password);  
  
    const ascii = Array.from(msg).map((char) => this.mod(char.charCodeAt(0), this.q));  
    const b = this.calculateB();  
    const cyphertext = ascii.map((val, idx) => this.mod(val + b[idx % b.length], this.q));  
  
    return {  
      data: Base64.encode(cyphertext),
      params: {  
        A: this.A,  
        E: this.e,  
        q: this.q,  
      },  
    };  
  }  
  
  async decrypt(encryptedData: EncryptedData, password: string): Promise<string> {  
    this.A = encryptedData.params.A;  
    this.e = encryptedData.params.E;  
    this.q = encryptedData.params.q;  
    await this.sVector(password);  
  
    const cyphertext = Base64.decode(encryptedData.data);
    const b = this.calculateB();
  
    const decrypted = cyphertext.map((val, idx) => 
      this.mod(val - b[idx % b.length], this.q)
    );
    return String.fromCharCode(...decrypted);
  }  
}  
  
export const createEncryptionService = (m: number = 128, n: number = 64, q: number = 2053) => {  
  return new AntigeneEncryption(m, n, q);  
};  
