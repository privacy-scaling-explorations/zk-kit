# libsemaphore

### Description

A library that allows for easy access and interoperability for [Semaphore](https://semaphore.appliedzkp.org/) and [RLN](https://medium.com/privacy-scaling-explorations/rate-limiting-nullifier-a-spam-protection-mechanism-for-anonymous-environments-bbe4006a57d) constructs. It is meant to be used by third-party applications to easily integrate with Seamphore and RLN. The library provides an API (Semaphore and RLN) for:
- Identity generation
- Proof generation
- Proof verification.


The library is structured as a three separate npm packages:
- `identity` - Exposes utilities for Zk identity generation, necessary for interacting with the Zk protocols supported by this library
- `protocols` - Utilities for proof genration and verification for various Zk protocols
- `types` - Helper package which exposes the types used by `identity` and `protocols` packages.

Please refer to the [identity](https://github.com/appliedzkp/libsemaphore/tree/master/packages/identity)and [protocols](https://github.com/appliedzkp/libsemaphore/tree/master/packages/protocols) packages accordingly for installation and usage instructions. The packages also provide tests which can be used as a guide for interaction.
