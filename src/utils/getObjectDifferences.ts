/* eslint-disable @typescript-eslint/no-explicit-any */
export function getObjectDifferences<T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> {
  const differences: Partial<T> = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (isObject(val1) && isObject(val2)) {
        const nestedDiff = getObjectDifferences(val1, val2);
        if (Object.keys(nestedDiff).length > 0) {
          (differences as any)[key] = nestedDiff;
        }
      } 
      else if (Array.isArray(val1) && Array.isArray(val2)) {
        const arrDiff = getArrayDifferences(val1, val2);
        if (arrDiff.length > 0) {
          (differences as any)[key] = arrDiff;
        }
      } 
      else if (val1 !== val2) {
        differences[key] = val2;
      }
    }
  }

  return differences;
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getArrayDifferences(arr1: any[], arr2: any[]): any[] {
  const differences: any[] = [];

  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    if (isObject(item1) && isObject(item2)) {
      const diff = getObjectDifferences(item1, item2);
      if (Object.keys(diff).length > 0) {
        differences.push(item2);
      }
    } 
    else if (Array.isArray(item1) && Array.isArray(item2)) {
      const nestedArrDiff = getArrayDifferences(item1, item2);
      if (nestedArrDiff.length > 0) {
        differences.push(item2);
      }
    } 
    else if (item1 !== item2) {
      differences.push(item2);
    }
  }

  return differences;
}
