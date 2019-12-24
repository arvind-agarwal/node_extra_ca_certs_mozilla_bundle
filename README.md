# node_extra_ca_certs_mozilla_bundle

If you are trying to connect to a secure website via nodejs. You may run into errors such as
 
[CERT_UNTRUSTED](https://stackoverflow.com/questions/41390965/cert-untrusted-error-when-execute-https-request)

[UNABLE_TO_VERIFY_LEAF_SIGNATURE](https://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature) 

[unable to verify the first certificate](https://stackoverflow.com/questions/31673587/error-unable-to-verify-the-first-certificate-in-nodejs)

It may be due to a couple of reasons.
The Root CA certificate is missing in nodejs
Or the site does not correctly install the intermediate certificates

Typically you encounter these at the last minute, and usually, the server is not in your control; hence you cannot even modify the certificates, and it is challenging to change code at that time.

### Node js added an Environment variable to address this issue:

### [NODE_EXTRA_CA_CERTS](https://nodejs.org/api/cli.html#cli_node_extra_ca_certs_file)
When set, the well known "root" CAs (like VeriSign) will be extended with the extra certificates in file. The file should consist of one or more trusted certificates in PEM format.

*NOTE: This environment variable is ignored when node runs as setuid root or has Linux file capabilities set.*

However, it is cumbersome to create the PEM file for missing certificates manually and can be a security issue.

### This module downloads and creates a PEM file from https://www.ccadb.org/resources (Common CA Database) used by Mozilla 
https://wiki.mozilla.org/CA/Included_Certificates
https://wiki.mozilla.org/CA/Intermediate_Certificates

It generates three different bundles that can be used based on your needs:
* Intermediate certificates only bundle ca_intermediate_bundle.pem
* Root only certificates bundle ca_root_bundle.pem
* Intermediate and Root certificates bundle ca_intermediate_root_bundle.pem

You can use any of the above bundles with NODE_EXTRA_CA_CERTS.

### To install:

`npm install node_extra_ca_certs_mozilla_bundle`

During the installation of the module, it downloads the latest certificates from the Mozilla database and builds the PEM file in `node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle` folder.

You can launch your script while using the above certificates using: `NODE_EXTRA_CA_CERTS=node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem node your_script.js`

The PEM file bundle can also be used as a ca parameter for SSL options.
