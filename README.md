# mockle

Mock TSC merkle proof generator

## Notes

This tool generates mocked (fake) SPV proofs in the JSON TSC format, and returns them as JavaScript objects. It does this by taking the given transaction or transaction ID (or by randomly generating a TXID), and then hashing it with randomly generated merkle branches to arrive at a random merkle root.

Needless to say, these proofs will not validate against the real chain of blocks, since the random merkle branches are not inputs to any real block's merkle root. This tool is useful for testing software that deals with the SPV ecosystem

## Example Usage

```js
const mockle = require('mockle')
// or
import mockle from 'mockle'
```

Generate a mock proof for a random TXID

```js
const mockProof = mockle()
```

Generate a mock proof for a given `txOrId`, `index` and `targetType`

```js
const mockProof = mockle({
  txOrId: '...',
  index: 1337,
  targetType: 'header'
})
```

## API

## License

The license for the code in this repository is the Open BSV License.
