import { deepClone } from '../clone';

describe('deepClone', () => {
  it('should handle primitive values', () => {
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
  });

  it('should handle Date objects', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const cloned = deepClone(date);
    expect(cloned).toBeInstanceOf(Date);
    expect(cloned).not.toBe(date); // Should be a new instance
    expect(cloned.getTime()).toBe(date.getTime()); // Should have same timestamp
  });

  it('should handle arrays', () => {
    const array = [1, 'two', { three: 3 }, [4, 5]];
    const cloned = deepClone(array);
    
    expect(cloned).toEqual(array);
    expect(cloned).not.toBe(array); // Should be a new array
    expect(cloned[2]).not.toBe(array[2]); // Nested objects should be new instances
    expect(cloned[3]).not.toBe(array[3]); // Nested arrays should be new instances
  });

  it('should handle objects', () => {
    const obj = {
      string: 'value',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      date: new Date('2024-01-01T00:00:00Z'),
      nested: { key: 'value' },
    };
    const cloned = deepClone(obj);
    expect(cloned).not.toBe(obj); // Should be a new object
    expect(cloned.string).toBe(obj.string);
    expect(cloned.number).toBe(obj.number);
    expect(cloned.boolean).toBe(obj.boolean);
    expect(cloned.null).toBeNull();
    expect(cloned.array).toEqual(obj.array);
    expect(cloned.date).toBeInstanceOf(Date);
    expect(cloned.date).not.toBe(obj.date);
    expect(cloned.date.getTime()).toBe(obj.date.getTime());
    expect(cloned.nested).toEqual(obj.nested);
  });

  it('should handle circular references', () => {
    const obj: any = { name: 'parent' };
    obj.self = obj;
    
    const cloned = deepClone(obj);
    
    expect(cloned).toEqual(obj);
    expect(cloned.self).toBe(cloned); // Circular reference should be maintained
  });

  it('should handle complex nested structures', () => {
    const complex = {
      dates: [new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z')],
      nested: {
        array: [
          { date: new Date('2024-01-01T00:00:00Z') },
          { date: new Date('2024-01-01T00:00:00Z') },
        ],
      },
    };
    const cloned = deepClone(complex);
    expect(cloned).not.toBe(complex);
    expect(cloned.dates).toHaveLength(2);
    for (let i = 0; i < cloned.dates.length; i++) {
      expect(cloned.dates[i]).toBeInstanceOf(Date);
      expect(cloned.dates[i]).not.toBe(complex.dates[i]);
      expect(cloned.dates[i].getTime()).toBe(complex.dates[i].getTime());
    }
    expect(cloned.nested.array).toHaveLength(2);
    for (let i = 0; i < cloned.nested.array.length; i++) {
      expect(cloned.nested.array[i].date).toBeInstanceOf(Date);
      expect(cloned.nested.array[i].date).not.toBe(complex.nested.array[i].date);
      expect(cloned.nested.array[i].date.getTime()).toBe(complex.nested.array[i].date.getTime());
    }
  });

  it('should handle empty objects and arrays', () => {
    const empty = {
      obj: {},
      arr: []
    };
    
    const cloned = deepClone(empty);
    
    expect(cloned).toEqual(empty);
    expect(cloned.obj).not.toBe(empty.obj);
    expect(cloned.arr).not.toBe(empty.arr);
  });

  it('should preserve object prototype chain', () => {
    class TestClass {
      constructor(public value: number) {}
    }
    
    const obj = new TestClass(42);
    const cloned = deepClone(obj);
    
    expect(cloned).toBeInstanceOf(TestClass);
    expect(cloned.value).toBe(42);
  });

  it('should handle multiple circular references', () => {
    const obj1: any = { name: 'obj1' };
    const obj2: any = { name: 'obj2' };
    obj1.ref = obj2;
    obj2.ref = obj1;
    
    const cloned = deepClone(obj1);
    
    expect(cloned).toEqual(obj1);
    expect(cloned.ref).toBe(cloned.ref.ref.ref); // Circular reference should be maintained
  });

  it('should handle objects with getters and setters', () => {
    const obj = {
      _value: 42,
      get value() { return this._value; },
      set value(v) { this._value = v; }
    };
    
    const cloned = deepClone(obj);
    
    expect(cloned.value).toBe(42);
    cloned.value = 100;
    expect(cloned.value).toBe(100);
  });

  it('should handle objects with Symbol properties', () => {
    const sym = Symbol('test');
    const obj = {
      [sym]: 'value',
      regular: 'property'
    };
    
    const cloned = deepClone(obj);
    
    expect(cloned[sym]).toBe('value');
    expect(cloned.regular).toBe('property');
  });

  it('should handle objects with non-enumerable properties', () => {
    const obj = Object.defineProperty({}, 'hidden', {
      value: 'secret',
      enumerable: false
    });
    
    const cloned = deepClone(obj);
    
    expect(Object.getOwnPropertyDescriptor(cloned, 'hidden')?.value).toBe('secret');
  });
}); 