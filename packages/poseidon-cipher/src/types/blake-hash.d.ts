declare module "blake-hash" {
    type BlakeVariant = "blake224" | "blake256" | "blake384" | "blake512"

    export interface BlakeHash {
        update(data: Buffer | Uint8Array): BlakeHash
        digest(encoding?: "hex" | "binary"): Buffer | string
    }

    /**
     * Creates an instance of a BLAKE hash function.
     * @param variant The desired BLAKE variant ('blake224', 'blake256', 'blake384', or 'blake512').
     * @returns An instance of the hash function.
     */
    export default function createBlakeHash(variant: BlakeVariant): BlakeHash
}
