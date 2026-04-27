import JSEncrypt from 'jsencrypt'

// 公钥和私钥
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEwYTyTSfC0ppGLp8MobDNMIt+nM
wHAtTrr5quVaxooNqrqZgY8OxUaxxJ380neyau6cugcHMd7WtUnahkGj0mnBZw/0
pppj8oAI91UvszWfpnMRaouYu1Tz5+eZY+UufRHJhUeUwgOhFk/Skjb6J7glPxJt
dyTAoo/cGLf8D8BVAgMBAAE=
-----END PUBLIC KEY-----`

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgEwYTyTSfC0ppGLp8MobDNMIt+nMwHAtTrr5quVaxooNqrqZgY8O
xUaxxJ380neyau6cugcHMd7WtUnahkGj0mnBZw/0pppj8oAI91UvszWfpnMRaouY
u1Tz5+eZY+UufRHJhUeUwgOhFk/Skjb6J7glPxJtdyTAoo/cGLf8D8BVAgMBAAEC
gYAx3exfsSB3aEa2G6EUkU2CLsB3kxq5aLejiGIaE7bwWax8xIRG/+MARRcYgcpb
bqzs2gB/ApQH+KStVWuOMJF+zbLSbjggQUAaK1EVV2S6t38R4Iayq5C6At42y3El
XgxXFJi9IzbCJIfsRaYYeFk3i6VbtzpwZDbN0BURCnwMAQJBAIzaRNW++wAeD+Sv
qknVXsuuW6sn64AQFNfoNfOUZc/qejTVU6mbqvRp40VQSHbpXPfMjEOauZdOlvuB
oT3XXcECQQCKTYOP87hSQW1It1ff3qMir/VzIcZZvVBZRf8URkcIog8xydwNXWQr
xGGZPIG6MO7tFx1Y3btyuI2FFpfm7++VAkAN3MV9i+hEILFLvoYx8g/8V9Kpy6n/
1pVWkoIM0QQcLGWOoZg0Tx/KIkm93qLjISCHOthrJuUxIQj3A9EMtw+BAkA30lmL
vL9k0+ucMgRR47bMxWC4e6VnizXnEo2GTWdWYLLpUaRz8IIB+F28T+O8lwuYvn+l
4rlJ8JuOYDQnjiiRAkARQt1K+VmVBDMGUhjQmI0V6G/qgCfGig22PeYLurtBaO2i
oBOpifm1KuklecmG2D01ssASnkbPv5ZG4XO2Wv3r
-----END RSA PRIVATE KEY-----`

/**
 * 使用公钥加密数据
 * @param {string} data 待加密的数据
 * @returns {string} 加密后的数据
 */
export const encryptByPublicKey = (data) => {
  if (!data) return ''

  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(data)
}

/**
 * 使用私钥解密数据
 * @param {string} encryptedData 待解密的数据
 * @returns {string} 解密后的数据
 */
export const decryptByPrivateKey = (encryptedData) => {
  if (!encryptedData) return ''

  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey)
  return decrypt.decrypt(encryptedData)
}

/**
 * 密码加密
 * @param {string} password 待加密的密码
 * @returns {string} 加密后的密码
 */
export const encryptPassword = (password) => {
  return encryptByPublicKey(password)
}

/**
 * 密码解密
 * @param {string} encryptedPassword 待解密的密码
 * @returns {string} 解密后的密码
 */
export const decryptPassword = (encryptedPassword) => {
  return decryptByPrivateKey(encryptedPassword)
}
