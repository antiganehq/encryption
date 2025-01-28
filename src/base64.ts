export class Base64 {
    private static readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
    /**
     * Convert array of numbers to Base64 string
     */
    public static encode(data: number[]): string {
      const binary = data.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
      const padding = binary.length % 6 === 0 ? 0 : 6 - (binary.length % 6);
      const paddedBinary = binary + '0'.repeat(padding);
      
      let result = '';
      for (let i = 0; i < paddedBinary.length; i += 6) {
        const chunk = paddedBinary.slice(i, i + 6);
        const index = parseInt(chunk, 2);
        result += this.chars[index];
      }
  
      // Add padding characters if needed
      const paddingChars = (4 - (result.length % 4)) % 4;
      result += '='.repeat(paddingChars);
  
      return result;
    }
  
    /**
     * Convert Base64 string back to array of numbers
     */
    public static decode(base64: string): number[] {
      // Remove padding characters
      const cleanStr = base64.replace(/=/g, '');
      
      // Convert to binary string
      let binary = '';
      for (let i = 0; i < cleanStr.length; i++) {
        const index = this.chars.indexOf(cleanStr[i]);
        if (index === -1) continue;
        binary += index.toString(2).padStart(6, '0');
      }
  
      // Convert binary string to number array
      const result: number[] = [];
      for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.slice(i, i + 8);
        if (byte.length === 8) {
          result.push(parseInt(byte, 2));
        }
      }
  
      return result;
    }
  }