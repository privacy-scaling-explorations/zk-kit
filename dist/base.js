"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers = require("ethers");
var circomlib = require('circomlib');
var bigintConversion = require("bigint-conversion");
var common_1 = require("./common");
var groth16 = require('snarkjs').groth16;
var Tree = require('incrementalquintree/build/IncrementalQuinTree');
var BaseSemaphore = /** @class */ (function () {
    function BaseSemaphore() {
        this.commitmentHasher = null;
    }
    BaseSemaphore.prototype.setHasher = function (hashFunction) {
        var hash = common_1.identityCommitmentHasher[hashFunction];
        if (!hash)
            throw new Error(hashFunction + " identityCommitment hasher not provided");
        this.commitmentHasher = hash;
    };
    BaseSemaphore.prototype.genIdentity = function (privKey) {
        if (privKey === void 0) { privKey = (0, common_1.genRandomBuffer)(32); }
        return {
            keypair: (0, common_1.genEddsaKeyPair)(privKey),
            identityNullifier: bigintConversion.bufToBigint((0, common_1.genRandomBuffer)(31)),
            identityTrapdoor: bigintConversion.bufToBigint((0, common_1.genRandomBuffer)(31)),
        };
    };
    BaseSemaphore.prototype.serializeIdentity = function (identity) {
        var data = [
            identity.keypair.privKey.toString('hex'),
            identity.identityNullifier.toString(16),
            identity.identityTrapdoor.toString(16),
        ];
        return JSON.stringify(data);
    };
    BaseSemaphore.prototype.unSerializeIdentity = function (serialisedIdentity) {
        var data = JSON.parse(serialisedIdentity);
        return {
            keypair: (0, common_1.genEddsaKeyPair)(Buffer.from(data[0], 'hex')),
            identityNullifier: bigintConversion.hexToBigint(data[1]),
            identityTrapdoor: bigintConversion.hexToBigint(data[2]),
        };
    };
    BaseSemaphore.prototype.genNullifierHash = function (externalNullifier, identityNullifier, nLevels) {
        return (0, common_1.poseidonHash)([BigInt(externalNullifier), BigInt(identityNullifier), BigInt(nLevels)]);
    };
    BaseSemaphore.prototype.genExternalNullifier = function (plaintext) {
        var _cutOrExpandHexToBytes = function (hexStr, bytes) {
            var len = bytes * 2;
            var h = hexStr.slice(2, len + 2);
            return '0x' + h.padStart(len, '0');
        };
        var hashed = ethers.utils.solidityKeccak256(['string'], [plaintext]);
        return _cutOrExpandHexToBytes('0x' + hashed.slice(8), 32);
    };
    BaseSemaphore.prototype.genSignalHash = function (signal) {
        var converted = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal));
        return BigInt(ethers.utils.solidityKeccak256(['bytes'], [converted])) >> BigInt(8);
    };
    BaseSemaphore.prototype.genMsg = function (externalNullifier, signalHash) {
        return circomlib.mimcsponge.multiHash([
            externalNullifier,
            signalHash,
        ]);
    };
    BaseSemaphore.prototype.packToSolidityProof = function (fullProof) {
        var proof = fullProof.proof, publicSignals = fullProof.publicSignals;
        return {
            a: proof.pi_a.slice(0, 2),
            b: proof.pi_b
                .map(function (x) { return x.reverse(); })
                .slice(0, 2),
            c: proof.pi_c.slice(0, 2),
            inputs: publicSignals.map(function (x) {
                x = BigInt(x);
                return (x % common_1.SNARK_FIELD_SIZE).toString();
            })
        };
    };
    BaseSemaphore.prototype.createTree = function (depth, zeroValue, leavesPerNode) {
        return new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, common_1.poseidonHash);
    };
    BaseSemaphore.prototype.verifyProof = function (vKey, fullProof) {
        var proof = fullProof.proof, publicSignals = fullProof.publicSignals;
        return groth16.verify(vKey, publicSignals, proof);
    };
    BaseSemaphore.prototype.signMsg = function (privKey, msg) {
        return circomlib.eddsa.signMiMCSponge(privKey, msg);
    };
    BaseSemaphore.prototype.verifySignature = function (msg, signature, pubKey) {
        return circomlib.eddsa.verifyMiMCSponge(msg, signature, pubKey);
    };
    return BaseSemaphore;
}());
exports.default = BaseSemaphore;
//# sourceMappingURL=base.js.map