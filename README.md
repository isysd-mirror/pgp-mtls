# pgp-mtls

_Authenticate and encrypt p2p sessions using OpenPGP Web of Trust and mutual TLS._

Peer to peer authentication using OpenPGP identities to manage individual Certificate Authorities and mutual TLS sessions. No more centralized Certificate Authorities or application-specific authentication! Simply install your client SSL certificate to your [browser](https://www.tbs-certificates.co.uk/FAQ/en/installer_certificat_client_google_chrome.html) or [app](https://github.com/digitalbazaar/forge) and make requests.

This library currently does not make any network requests, only providing the authentication utilities. The protocol could be used in other context, but it is easiest to assume an extension of the [HTTP Keyserver Protocol](https://tools.ietf.org/html/draft-shaw-openpgp-hkp-00), as shown in the examples below.

### OpenPGP + CA Handshake

Before initiating a mutual TLS session, the "client" (sender) and "server" (receiver) must identify each other by OpenPGP keys, and sign each others SSL certificates.

Steps:

1. Client sends their PGP Public Key to the server (`POST /pks/add`)
2. Server checks the signatures on the client key against trust database, and imports if approved.
3. Response body is the Server's PGP Public Key, but status will be 401 if step #2 failed
4. Client checks the signatures on the server key against trust database, and imports if approved.
5. Client sends a PGP-signed Certificate Signing Request (CSR) (`POST /pks/csr`)
6. Server verifies the PGP signature, and uses local Certificate Authority to sign the Client's CSR or status 401
7. Server responds with signed client certificate, and own PGP-signed CSR
8. (optional) Client verifies the PGP signature, and uses local Certificate Authority to sign the Server's CSR
9. (optional) Client send signed Server certificate (`POST /pks/cert`)

![PGP CA handshake](https://raw.githubusercontent.com/isysd-mirror/pgp-mtls/isysd/img/pgp-mtls.jpg)

After this handshake, secure mTLS sessions can be established using the normal handshake.

### Dependencies

This package will be made isomorphic, but for now it is node-only and requires the following:

 + OpenSSL
 + GnuPG

### Install

##### Node

This package is not yet published in npm or any other package managers.

```sh
git clone https://github.com/isysd-mirror/pgp-mtls.git
cd pgp-mtls
npm i
```

### Comparisons

| Name | No middle man | X.509 | e2e Encryption | Public Key Auth | Hardware Support | Peer Discovery |
|------|---------------|------|----------------|-----------------|------------------|----------------|
| pgp-mtls | yes       | yes  | yes            | yes             | yes              | yes            |
| PGP TLS [RFC 6091](https://tools.ietf.org/html/rfc6091) | yes | no | yes | yes | yes | yes         |
| TLS 1.3 [RFC 8446](https://tools.ietf.org/html/rfc8446) | no | yes | vulnerable | yes | yes | no   |
| mutual TLS 1.3 [RFC 8446](https://tools.ietf.org/html/rfc8446) | no | yes | yes | yes | yes | no   |
| [peerca](https://github.com/substack/peerca) | yes | yes | yes | yes | yes        | no             |
| [webauthn](https://www.w3.org/TR/webauthn-1/) w / [FIDO2](https://fidoalliance.org/fido2/) | depends | no | no | yes | yes | no |
| [OpenID Connect](https://openid.net/connect/) (inc. [Auth0](https://auth0.com)) | no | no | no | depends | depends | no |

##### No Middle Man

Indicates whether any trusted middle men are involved in the cryptographic operations.

This includes centralized authorities like traditional X.509 Certificate Authorities, as well as central authentication servers like those in Oauth2/OpenID Connect.

##### X.509

Indicates whether backwards compatible TLS certificates and sessions are supported. This is the current web standard for session encryption, and a strong but underutilized Authentication standard.

GnuTLS dropped support for [RFC 6091](https://tools.ietf.org/html/rfc6091) [citing X.509 dominance](https://www.gnutls.org/manual/html_node/OpenPGP-certificates.html).

##### e2e (End to End) Encryption

All session data must be encrypted from end to end. When Man In The Middle (MITM) attacks are possible (i.e. non-mutual TLS), this can be considered broken.

Many auth protocols argue this is not their domain, and that TLS should take care of it. As we see, this is not always the case, and when it is, Authentication is also included.

##### Public Key Auth

Public Key authentication ensures no party can impersonate or decrypt messages meant for a third party. Using symmetric cryptography, servers can impersonate users and read their messages.

##### Hardware Support

Indicates native integration with smart card or dedicated hardware devices. Examples are FIDO2 and OpenPGP.

##### Peer Discovery

Indicates ability to discover a previously unknown peer, and negotiate a secure session. The best example is the OpenPGP [Web of Trust](https://en.wikipedia.org/wiki/Web_of_trust).

### License

MIT Copyright isysd <public@iramiller.com>
