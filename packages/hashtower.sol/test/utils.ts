import { poseidon4 } from "poseidon-lite"
import { ethers } from "ethers"

const F = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

export default class HashTower {
    readonly H: number
    readonly W: number = 4

    private _R = 0n

    private _levels
    private _levelDigests

    private _emptyDigest

    constructor(_H: number) {
        this.H = _H
        this._levels = Array(this.H)
            .fill(0)
            .map(() => [])

        this._emptyDigest = poseidon4([0, 0, 0, 0])
        this._levelDigests = Array(this.H)
            .fill()
            .map(() => this._emptyDigest)
    }

    get root() {
        let R = this._R
        let _root = 0n
        for (const level of this.levels) {
            const digest = poseidon4(level)
            _root = (_root + digest * R) % F
            R = (R * R) % F
        }
        return _root
    }

    // Fill the end of each level with 0's if needed
    get levels() {
        return this._levels.map((level) => [level, Array(this.W - level.length).fill(0)].flat())
    }

    add(item: bigint) {
        this._R = BigInt(ethers.utils.solidityKeccak256(["uint256", "uint256"], [this._R, item])) % F
        this._levels[0].push(item)
        if (this._levels[0].length < this.W) {
            return
        }
        for (let x = 1; x < this.H; x += 1) {
            const lastLevelDigest = poseidon4(this.levels[x - 1])
            this._levels[x].push(lastLevelDigest)
            this._levels[x - 1] = []
            if (this._levels[x].length < this.W) {
                break
            }
        }
    }
}
