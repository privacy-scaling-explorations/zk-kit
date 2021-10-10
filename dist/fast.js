"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var groth16 = require('snarkjs').groth16;
var base_1 = require("./base");
var common_1 = require("./common");
var Tree = require('incrementalquintree/build/IncrementalQuinTree');
var FastSemaphore = /** @class */ (function (_super) {
    __extends(FastSemaphore, _super);
    function FastSemaphore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FastSemaphore.prototype.genSecret = function (identity) {
        if (!this.commitmentHasher)
            throw new Error('Hasher not set');
        var secret = [identity.identityNullifier, identity.identityTrapdoor];
        return this.commitmentHasher(secret);
    };
    FastSemaphore.prototype.genIdentityCommitment = function (identity) {
        if (!this.commitmentHasher)
            throw new Error('Hasher not set');
        var secret = [this.genSecret(identity)];
        return this.commitmentHasher(secret);
    };
    FastSemaphore.prototype.genProofFromIdentityCommitments = function (identity, externalNullifier, signal, wasmFilePath, finalZkeyPath, identityCommitments, depth, zeroValue, leavesPerNode, shouldHash) {
        if (shouldHash === void 0) { shouldHash = true; }
        return __awaiter(this, void 0, void 0, function () {
            var tree, identityCommitment, leafIndex, _i, identityCommitments_1, identityCommitment_1, merkleProof, fullProof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, common_1.poseidonHash);
                        identityCommitment = this.genIdentityCommitment(identity);
                        leafIndex = identityCommitments.indexOf(identityCommitment);
                        if (leafIndex === -1)
                            throw new Error('This commitment is not registered');
                        for (_i = 0, identityCommitments_1 = identityCommitments; _i < identityCommitments_1.length; _i++) {
                            identityCommitment_1 = identityCommitments_1[_i];
                            tree.insert(identityCommitment_1);
                        }
                        merkleProof = tree.genMerklePath(leafIndex);
                        return [4 /*yield*/, this.genProofFromBuiltTree(identity, merkleProof, externalNullifier, signal, wasmFilePath, finalZkeyPath, shouldHash)];
                    case 1:
                        fullProof = _a.sent();
                        return [2 /*return*/, {
                                fullProof: fullProof,
                                root: tree.root
                            }];
                }
            });
        });
    };
    //sometimes identityCommitments array can be to big so we must generate it on server and just use it on frontend
    FastSemaphore.prototype.genProofFromBuiltTree = function (identity, merkleProof, externalNullifier, signal, wasmFilePath, finalZkeyPath, shouldHash) {
        if (shouldHash === void 0) { shouldHash = true; }
        return __awaiter(this, void 0, void 0, function () {
            var grothInput;
            return __generator(this, function (_a) {
                grothInput = {
                    identity_nullifier: identity.identityNullifier,
                    identity_trapdoor: identity.identityTrapdoor,
                    identity_path_index: merkleProof.indices,
                    path_elements: merkleProof.pathElements,
                    external_nullifier: externalNullifier,
                    signal_hash: shouldHash ? this.genSignalHash(signal) : signal,
                };
                return [2 /*return*/, groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath)];
            });
        });
    };
    return FastSemaphore;
}(base_1.default));
exports.default = new FastSemaphore();
//# sourceMappingURL=fast.js.map