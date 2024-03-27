async function digest(buff) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', buff)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function digestFile(file) {
  return digest(await file.arrayBuffer())
}

export async function digestArray(array) {
  return digest(new TextEncoder().encode(array.join('\n')))
}
