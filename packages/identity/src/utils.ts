
/* eslint @typescript-eslint/no-var-requires: "off" */
const ZqField = require("ffjavascript").ZqField

export const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export const Fq = new ZqField(SNARK_FIELD_SIZE)