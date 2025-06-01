import LZString from 'lz-string';

/**
 * Compresses a string using LZ-String's UTF16 compression
 * @param data The string to compress
 * @returns The compressed string
 */
export function compressString(data: string): string {
  return LZString.compressToUTF16(data);
}

/**
 * Decompresses a string using LZ-String's UTF16 decompression
 * @param compressedData The compressed string to decompress
 * @returns The decompressed string, or null if decompression fails
 */
export function decompressString(compressedData: string): string | null {
  return LZString.decompressFromUTF16(compressedData);
}

/**
 * Custom JSON stringifier that handles Date objects and prevents circular references
 */
function customStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}

/**
 * Custom JSON parser that handles Date objects
 */
function customParse(json: string): any {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      return new Date(value);
    }
    return value;
  });
}

/**
 * Compresses and serializes an object to a string
 * @param data The object to compress
 * @returns The compressed string, or null if serialization fails
 */
export function compressObject<T>(data: T): string | null {
  try {
    if (data === null) return null;
    const jsonString = customStringify(data);
    return compressString(jsonString);
  } catch (error) {
    console.error('Error compressing object:', error);
    return null;
  }
}

/**
 * Decompresses and deserializes a string back into an object
 * @param compressedData The compressed string to decompress
 * @returns The decompressed object, or null if decompression/deserialization fails
 */
export function decompressObject<T>(compressedData: string): T | null {
  try {
    if (!compressedData) return null;
    const jsonString = decompressString(compressedData);
    if (!jsonString) return null;
    return customParse(jsonString) as T;
  } catch (error) {
    console.error('Error decompressing object:', error);
    return null;
  }
} 