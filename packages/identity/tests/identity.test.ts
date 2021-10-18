import { ZkIdentity } from "../src";
import { Identity } from "../../types";

describe("Semaphore identity", () => {
    describe("Create identity", () => {
        it("Should create a Semaphore identity", async () => {
            const identity: Identity = ZkIdentity.genIdentity();
            expect(typeof identity).toEqual("object")
        })
        it("Should generate secret from identity", async () => {
            const identity: Identity = ZkIdentity.genIdentity();
            const identitySecret: bigint[] = ZkIdentity.genSecretFromIdentity(identity);
            expect(identitySecret.length).toEqual(2);
            expect(identitySecret[0]).toEqual(identity.identityNullifier);
            expect(identitySecret[1]).toEqual(identity.identityTrapdoor);
            expect(typeof identitySecret).toEqual("object")
        })

        it("Should generate random secret", async () => {
            const secretParts = 5;
            const identitySecret: bigint[] = ZkIdentity.genRandomSecret(secretParts);
            expect(identitySecret.length).toEqual(5);
            expect(typeof identitySecret).toEqual("object")
        })

        it("Should generate identity commitment from identity secret", async () => {
            const identity: Identity = ZkIdentity.genIdentity();
            const identitySecret: bigint[] = ZkIdentity.genSecretFromIdentity(identity);
            const identityCommitment: bigint = ZkIdentity.genIdentityCommitment(identitySecret);
            expect(typeof identityCommitment).toEqual("bigint")
        })

        it("Should generate identity commitment from random secret", async () => {
            const secretParts = 5;
            const identitySecret: bigint[] = ZkIdentity.genRandomSecret(secretParts);
            const identityCommitment: bigint = ZkIdentity.genIdentityCommitment(identitySecret);
            expect(typeof identityCommitment).toEqual("bigint")
        })

        it("Should serialize identity", async () => {
            const identity: Identity = ZkIdentity.genIdentity();
            const serialized: string = ZkIdentity.serializeIdentity(identity);
            expect(typeof serialized).toEqual("string")
        })
        it("Should unserialize identity", async () => {
            const identity: Identity = ZkIdentity.genIdentity();
            const serialized: string = ZkIdentity.serializeIdentity(identity);
            const unserialized: Identity = ZkIdentity.unSerializeIdentity(serialized);
            expect(unserialized).toStrictEqual(identity)
        })
    })
})