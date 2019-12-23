const csvtojson = require('csvtojson');
const fs = require('fs');
const request = require('request-promise-native');
const bundleFileName = 'dist/mozilla_root_intermediate_bundle.pem';


async function appendPEMFromUrl(url) {
    console.log(`Downloading from URL ${url}`);
    const data = await request.get(url);
    console.log('Parsing data');
    const jsonData = await csvtojson().fromString(data);

    for (const entry of jsonData) {
        // Retrieve PEM Info column and remove quotes in beginning and end
        const certPem = entry['PEM Info'].slice(1, -1);
        const commonName = entry['Common Name or Certificate Name'] || entry['Certificate Subject Common Name'];
        const serialNumber = entry['Certificate Serial Number'];

        // Add common Name and serial number
        console.log(`Processing ${commonName} - ${serialNumber}`);
        fs.appendFileSync(bundleFileName, `${commonName} - ${serialNumber}\n${certPem}\n\n`);
    }
    console.log(`URL ${url} processed\n\n`);
}

async function build() {
    // Ensure dist directory
    if (!fs.existsSync('dist')){
        fs.mkdirSync('dist');
    }

    // clear file if exists
    fs.writeFileSync(bundleFileName, '');
    
    // Add intermediate certificates
    await appendPEMFromUrl('https://ccadb-public.secure.force.com/mozilla/PublicAllIntermediateCertsWithPEMCSV');

    // Add root certificates
    await appendPEMFromUrl('https://ccadb-public.secure.force.com/mozilla/IncludedCACertificateReportPEMCSV');
}

build();