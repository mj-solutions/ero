export async function asyncCall<T>(
  asyncFunc: () => Promise<T>
): Promise<[Error | null, T | null]> {
  try {
    const result = await asyncFunc();
    return [null, result];
  } catch (e: any) {
    return [e, null];
  }
}
