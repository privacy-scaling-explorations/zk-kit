import * as crypto from 'crypto';
import * as bigintConversion from 'bigint-conversion';
import { sha256 as _sha256 } from "js-sha256";

interface identity {
    identityNullifier: bigint,
    identityTrapdoor: bigint,
}

const genRandomNumber = (numBytes = 32): bigint => {
    return  bigintConversion.bufToBigint(crypto.randomBytes(numBytes))
}

const genRandomIdentity = (): identity => {
    return {
        identityNullifier: genRandomNumber(31),
        identityTrapdoor: genRandomNumber(31)
    }
}

const genIdentityFromSignedMessage = (metadata: any): identity => {
    const sha256 = (message: string): string => {
        const hash = _sha256.create()
        hash.update(message)
        return hash.hex()
    }

    const { signedMessage } = metadata;

    const messageHash = sha256(signedMessage)
    const identityNullifier = bigintConversion.hexToBigint(sha256(`${messageHash}identity_nullifier`))
    const identityTrapdoor = bigintConversion.hexToBigint(sha256(`${messageHash}identity_trapdoor`))

    return {
        identityTrapdoor,
        identityNullifier
    }
}

export {
    genRandomIdentity, 
    genIdentityFromSignedMessage,
    genRandomNumber
}