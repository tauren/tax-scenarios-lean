/**
 * Deep clones an object while preserving Date objects, handling circular references,
 * maintaining prototype chains, and copying Symbol and non-enumerable properties
 * @param obj The object to clone
 * @param cache Optional cache to handle circular references
 * @returns A deep clone of the object
 */
export function deepClone<T>(value: T, cache = new WeakMap()): T {
  // Handle primitive values
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (cache.has(value)) {
    return cache.get(value);
  }

  // Handle Date objects
  if (value instanceof Date) {
    const date = new Date(value.getTime());
    cache.set(value, date);
    return date as T;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const result = [] as unknown as T;
    cache.set(value, result);
    (result as unknown as Array<unknown>).push(...(value as Array<unknown>).map(item => deepClone(item, cache)));
    return result;
  }

  // Handle objects
  const result = Object.create(Object.getPrototypeOf(value));
  cache.set(value, result);

  // Copy all properties including Symbols and non-enumerable
  const allProps = [
    ...Object.getOwnPropertyNames(value),
    ...Object.getOwnPropertySymbols(value)
  ];

  for (const prop of allProps) {
    const descriptor = Object.getOwnPropertyDescriptor(value, prop);
    if (descriptor) {
      if (descriptor.get || descriptor.set) {
        // Copy getters and setters
        Object.defineProperty(result, prop, descriptor);
      } else {
        // Copy regular properties
        Object.defineProperty(result, prop, {
          ...descriptor,
          value: deepClone(descriptor.value, cache)
        });
      }
    }
  }

  return result;
} 