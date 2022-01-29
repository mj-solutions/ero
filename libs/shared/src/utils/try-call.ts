export function tryCall<T = void>(
  func: () => T
): [T, undefined] | [undefined, Error] {
  try {
    const res = func();
    return [res, undefined];
  } catch (e: any) {
    return [undefined, e];
  }
}
