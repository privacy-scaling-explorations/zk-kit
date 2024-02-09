import { expect } from "chai"
import { bufferToBigint, bigintToBuffer, leBigintToBuffer, leBufferToBigint } from "../src/number-conversions"

describe("Number Conversions", () => {
    describe("Bigint to/from Buffer Conversions", () => {
        const tesetBytes1 = [
          0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
          0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
          0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
          0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
        ]
        const testNum1LE = BigInt("0x1F1E1D1C1B1A191817161514131211100F0E0D0C0B0A09080706050403020100");
        const testNum1BE = BigInt("0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F");

        it("Should support little-endian conversions", async () => {
          const in1 = Buffer.from(tesetBytes1)
          const n1 = leBufferToBigint(in1)
          expect(n1).to.be.eq(testNum1LE)
          const out1 = leBigintToBuffer(n1)
          expect(out1.length).to.eq(32)
          expect(out1).to.deep.eq(Buffer.from(tesetBytes1))
        })

        it("Should support big-endian conversions", async () => {
          const in1 = Buffer.from(tesetBytes1)
          const n1 = bufferToBigint(in1)
          expect(n1).to.be.eq(testNum1BE)
          const out1 = bigintToBuffer(n1)
          expect(out1.length).to.eq(32)
          expect(out1).to.deep.eq(Buffer.from(tesetBytes1))
        })

        it("Should pad small numbers", async () => {
          const smallBufLE = leBigintToBuffer(BigInt(0x020100))
          expect(smallBufLE).to.have.length(32)
          const smallOutLE = leBufferToBigint(smallBufLE)
          expect(smallOutLE).to.eq(BigInt(0x020100))

          const smallBufBE = bigintToBuffer(BigInt(0x020100))
          expect(smallBufBE).to.have.length(32)
          const smallOutBE = bufferToBigint(smallBufBE)
          expect(smallOutBE).to.eq(BigInt(0x020100))
        })

        it("Should not mutate input buffers", async () => {
          const in1 = Buffer.from(tesetBytes1)
          expect(in1).to.deep.eq(Buffer.from(tesetBytes1))

          const n1LE = leBufferToBigint(in1)
          expect(n1LE).to.eq(testNum1LE)
          expect(in1).to.deep.eq(Buffer.from(tesetBytes1))

          const n1BE = bufferToBigint(in1)
          expect(n1BE).to.eq(testNum1BE)
          expect(in1).to.deep.eq(Buffer.from(tesetBytes1))
        })
      })
})
