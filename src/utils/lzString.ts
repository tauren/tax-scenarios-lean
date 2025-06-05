import { compress, decompress } from 'lz-string';

/**
 * Compresses a string using LZ-String's UTF16 compression
 * @param data The string to compress
 * @returns The compressed string
 */
export function compressString(data: string): string {
  return compress(data);
}

/**
 * Decompresses a string using LZ-String's UTF16 decompression
 * @param compressedData The compressed string to decompress
 * @returns The decompressed string, or null if decompression fails
 */
export function decompressString(compressedData: string): string | null {
  return decompress(compressedData);
}


/**
 * Compresses and serializes an object to a string
 * @param data The object to compress
 * @returns The compressed string, or null if serialization fails
 */
export function compressObject<T>(obj: T): string {
  try {
    const jsonString = JSON.stringify(obj);
    return compress(jsonString);
  } catch (error) {
    return '';
  }
}

/**
 * Decompresses and deserializes a string back into an object
 * @param compressedData The compressed string to decompress
 * @returns The decompressed object, or null if decompression/deserialization fails
 */
export function decompressObject<T>(compressedData: string): T | null {
  try {
    const jsonString = decompress(compressedData);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return null;
  }
} 