/**
 * Deep clones an object while preserving Date objects, handling circular references,
 * maintaining prototype chains, and copying Symbol and non-enumerable properties
 * @param obj The object to clone
 * @param cache Optional cache to handle circular references
 * @returns A deep clone of the object
 */
export function deepClone<T>(obj: T, cache = new WeakMap()): T {
  // Handle primitive values
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  // Handle circular references
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const result = obj.map(item => deepClone(item, cache));
    cache.set(obj, result);
    return result as unknown as T;
  }

  // Handle objects
  const result = Object.create(Object.getPrototypeOf(obj));
  cache.set(obj, result);

  // Copy all properties (enumerable and non-enumerable)
  const allProps = [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj)
  ];

  for (const key of allProps) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor) {
      if (descriptor.value) {
        descriptor.value = deepClone(descriptor.value, cache);
      }
      Object.defineProperty(result, key, descriptor);
    }
  }

  return result;
} 