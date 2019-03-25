# guld-auth

Peer to peer authentication using OpenPGP identities to manage individual Certificate Authorities and mutual TLS sessions.

### OpenPGP + CA Handshake

Before initiating a mutual TLD session, the "client" (sender) and "server" (receiver) must identify each other by OpenPGP keys, and sign each others SSL certificates.

Steps:

1. Client sends their PGP Public Key to the server (`POST /pks/add`)
2. Server checks the signatures on the client key against trust database, and imports if approved.
3. Response body is the Server's PGP Public Key, but status will be 401 if step #2 failed
4. Client checks the signatures on the server key against trust database, and imports if approved.
5. Client sends a PGP-signed Certificate Signing Request (CSR) (`POST /pks/csr`)
6. Server verifies the PGP signature, and uses local Certificate Authority to sign the Client's CSR
7. Server responds with signed client certificate, and own PGP-signed CSR
8. (optional) Client verifies the PGP signature, and uses local Certificate Authority to sign the Server's CSR
9. (optional) Client send signed Server certificate (`POST /pks/cert`)

![PGP CA handshake](https://raw.githubusercontent.com/isysd-mirror/guld-auth/isysd/img/pgp-mtls.jpg)

After this handshake, secure mTLS sessions can be established using the normal handshake.

![mTLS handshake](https://visa.i.lithium.com/t5/image/serverpage/image-id/180i8191F313DC0D165C?v=1.0)

### Dependencies

This package will be made isomorphic, but for now it is node-only and requires the following:

 + OpenSSL
 + [peerca](https://github.com/substack/peerca)

### Install

##### Node

This package is not yet published in npm or any other package managers.

```sh
git clone https://github.com/isysd-mirror/guld-auth.git
cd guld-auth
npm i
```

### License

MIT Copyright isysd <public@iramiller.com>
