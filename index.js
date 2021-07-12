const crypto = require('crypto')

const rand256 = () => crypto.randomBytes(32).toString('hex')
const randIndex = (a = 0, b = 255) => parseInt(Math.random() * b + a)
const shasha = b => crypto.createHash('sha256').update(
  crypto.createHash('sha256').update(b).digest()
).digest()
const hash = (a, b) => {
  const result = shasha(Buffer.concat([
    Buffer.from(a, 'hex').reverse(),
    Buffer.from(b, 'hex').reverse()
  ])).reverse().toString('hex')
  return result
}

const fakeHeader = merkleRoot => Buffer.concat([
  Buffer.from('00000001', 'hex'), // version
  crypto.randomBytes(32), // previous hash
  Buffer.from(merkleRoot, 'hex').reverse(), // merkle root
  crypto.randomBytes(12) // time, bits, nonce
]).toString('hex')

module.exports = ({
  txOrId = rand256(),
  targetType = 'merkleRoot',
  index = randIndex()
} = {}) => {
  // Validation
  if (!/[0-9a-f]{2}/g.test(txOrId)) {
    throw new Error(`txOrId must be a hex string, received ${txOrId}`)
  }
  if (txOrId.length < 64) {
    throw new Error(
      `txOrId must be 32 bytes if a TXID, longer if a TX, length: ${txOrId.length}`
    )
  }
  if (!(['merkleRoot', 'hash', 'header'].some(x => x === targetType))) {
    throw new Error(
      `targetType must be "merkleRoot", "hash" or "header", received ${targetType}`
    )
  }
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`index must be a non-negative integer, received ${index}`)
  }

  // txOrId is converted to a TXID if it is not 64 characters
  let c
  if (txOrId.length !== 64) {
    c = shasha(Buffer.from(txOrId, 'hex')).reverse().toString('hex')
  } else {
    c = txOrId
  }

  // Nodes are based on the previous node and a new random pairing
  const nodes = []
  const indexBin = index.toString(2)
  for (let i = indexBin.length - 1; i >= 0; i--) {
    const r = rand256()
    const isRight = Boolean(Number(indexBin[i]))
    nodes.push(r)
    c = isRight ? hash(r, c) : hash(c, r)
  }

  // The target is generated based on the target type
  let target
  if (targetType === 'merkleRoot') {
    target = c
  } else if (targetType === 'hash') {
    target = rand256()
  } else if (targetType === 'header') {
    target = fakeHeader(c)
  }

  // The mockle proof is returned
  return {
    txOrId,
    targetType,
    nodes,
    target,
    index
  }
}
