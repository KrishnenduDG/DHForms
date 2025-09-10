export const removeIdxElementFromArray = (arr: Array<any>, idx: Number): Array<any> =>
  arr.filter((_, i) => i !== idx)

export const uint8ToBase64 = (arr: Uint8Array) => btoa(String.fromCharCode(...arr))
