import { compressString, decompressString, compressObject, decompressObject } from '../lzString';

describe('lzString', () => {
  describe('compressString and decompressString', () => {
    it('should compress and decompress a string', () => {
      const originalString = 'Hello, World!';
      const compressed = compressString(originalString);
      const decompressed = decompressString(compressed);
      expect(decompressed).toBe(originalString);
    });

    it('should handle empty string', () => {
      const originalString = '';
      const compressed = compressString(originalString);
      const decompressed = decompressString(compressed);
      expect(decompressed).toBe(originalString);
    });

    it('should handle long string', () => {
      const originalString = 'a'.repeat(1000);
      const compressed = compressString(originalString);
      const decompressed = decompressString(compressed);
      expect(decompressed).toBe(originalString);
    });
  });

  describe('compressObject and decompressObject', () => {
    it('should compress and decompress an object with dates', () => {
      const originalObject = {
        name: 'Test',
        value: 123,
        nested: {
          array: [1, 2, 3],
          date: new Date('2023-01-01'),
        },
      };

      const compressed = compressObject(originalObject);
      expect(compressed).toBeTruthy();

      const decompressed = decompressObject<typeof originalObject>(compressed!);
      expect(decompressed).toBeTruthy();
      expect(decompressed?.name).toBe(originalObject.name);
      expect(decompressed?.value).toBe(originalObject.value);
      expect(Array.isArray(decompressed?.nested.array)).toBe(true);
      expect(decompressed?.nested.array).toEqual([1, 2, 3]);
      expect(decompressed?.nested.date).toBeInstanceOf(Date);
      expect(decompressed?.nested.date.toISOString()).toBe(originalObject.nested.date.toISOString());
    });

    it('should handle null input', () => {
      const compressed = compressObject(null);
      expect(compressed).toBeNull();

      const decompressed = decompressObject(compressed!);
      expect(decompressed).toBeNull();
    });

    it('should handle invalid compressed data', () => {
      const decompressed = decompressObject('invalid-data');
      expect(decompressed).toBeNull();
    });

    it('should handle circular references', () => {
      const circular: any = { name: 'Test' };
      circular.self = circular;

      const compressed = compressObject(circular);
      expect(compressed).toBeTruthy();
      const decompressed = decompressObject<typeof circular>(compressed!);
      expect(decompressed?.self).toBe('[Circular]');
    });
  });
}); 