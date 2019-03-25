# guld-auth

Peer to peer authentication using OpenPGP identities to manage individual Certificate Authorities and mutual TLS sessions.

### OpenPGP + CA Handshake

![pgp ca handshake](/pgp-mtls.jpg)

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
