import { Fq } from "../src/utils"

describe("Field arithmetics", () => {
  describe("Test bunch of calculations in Fq", () => {
    it("Retrieve n from y = kx + n", () => {
      const k = Fq.random()
      const n = Fq.random()

      const x1 = Fq.random()
      const y1 = Fq.add(Fq.mul(k, x1), n)

      const x2 = Fq.random()
      const y2 = Fq.add(Fq.mul(k, x2), n)

      const ydiff = Fq.sub(y2, y1)
      const xdiff = Fq.sub(x2, x1)

      const slope = Fq.div(ydiff, xdiff)
      const retrieved = Fq.sub(y1, Fq.mul(x1, slope))

      expect(retrieved).toEqual(n)
    })

    it("Lagrange in Fq", () => {
      const degree = 4

      const coeffs: Array<bigint> = [BigInt(7), BigInt(6), BigInt(9), BigInt(1), BigInt(7)]
      const xs: Array<bigint> = []

      for (let i = 0; i < degree; i += 1) {
        xs.push(BigInt(i))
      }

      const ys: Array<bigint> = []

      for (let i = 0; i < degree; i += 1) {
        const x: bigint = xs[i]
        let tmpX: bigint = x
        let y: bigint = coeffs[0]

        for (let j = 1; j < degree + 1; j += 1) {
          y = Fq.add(y, Fq.mul(tmpX, coeffs[j]))
          tmpX = Fq.mul(tmpX, x)
        }

        ys.push(y)
      }

      let f0 = BigInt(0)

      for (let i = 0; i < degree; i += 1) {
        let p = BigInt(1)

        for (let j = 0; j < degree; j += 1) {
          if (j !== i) {
            p = Fq.mul(p, Fq.div(xs[j], Fq.sub(xs[j], xs[i])))
          }
        }

        f0 = Fq.add(f0, Fq.mul(ys[i], p))
      }

      expect(Fq.eq(f0, coeffs[0])).toBe(true)
    })
  })
})
