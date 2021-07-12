const mockle = require('./index')
const verify = require('./verifyMerkleProof')

describe('mockle', () => {
  it('Generates a verifiable TSC merkle proof', () => {
    const proof = mockle()
    const verified = verify(proof)
    expect(verified.proofValid).toEqual(true)
  })
  it('Generates a verifiable mockle proof for a custom TXID', () => {
    const customTXID = '33e06548be0cf94c58299d0bc6377cd46064ae3e76ed9dcd9e346909df94491e'
    const proof = mockle({ txOrId: customTXID })
    expect(proof.txOrId).toEqual(customTXID)
    const verified = verify(proof)
    expect(verified.proofValid).toEqual(true)
  })
  it('Generates a verifiable mockle proof with a custom index', () => {
    const proof = mockle({ index: 65535 })
    expect(proof.nodes.length).toEqual(16)
    const verified = verify(proof)
    expect(verified.proofValid).toEqual(true)
  })
  it('Generates a verifiable mockle proof on a block header', () => {
    const proof = mockle({ targetType: 'header' })
    expect(proof.target.length).toBe(160)
    expect(proof.targetType).toEqual('header')
    const verified = verify(proof)
    expect(verified.proofValid).toEqual(true)
  })
  it('Generates a verifiable mockle proof on a merkle root', () => {
    const proof = mockle({ targetType: 'merkleRoot' })
    const verified = verify(proof)
    expect(proof.targetType).toEqual('merkleRoot')
    expect(verified.proofValid).toEqual(true)
  })
  it('Generates a mockle proof on a block hash', () => {
    const proof = mockle({ targetType: 'hash' })
    expect(proof.target.length).toBe(64)
    expect(proof.targetType).toEqual('hash')
    // Because the mocked block hash is bogus, this type of mockle proof cannot be verified with the reference implementation
  })
  it('Creates a mockle proof on a transaction', () => {
    const rawTx = '0200000001c6360582fea1b1eb2493a30543d74b9ec640d04aadb3e688045b4afc4160f57e010000006a473044022049165c02271c7180bb5fc862de82f4c6d9701bfdf127c176a7a7450b1ee61f3802205faee8f2b728fb405d0b89878989bacb72ae08632fba0a369ba7da3f43c37f72412102501d42cd801491460ae0d17534d3ba10842bf5830b25dc7fb4498c8ea2872596ffffffff02000000000000000013006a1064633439343139356637356264633661e7150000000000001976a9148e6d99ca9c801a004056fa0934d64af6c600a64388ac00000000'
    const proof = mockle({
      txOrId: rawTx
    })
    expect(proof.txOrId).toEqual(rawTx)
    const verified = verify(proof)
    expect(verified.proofValid).toEqual(true)
  })
})
