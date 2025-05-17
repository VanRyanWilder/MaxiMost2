// Generate app signatures for fitness tracker integrations
import crypto from 'crypto';

// Create a function to generate signatures based on the package name
function generateAppSignatures(packageName) {
  // Create a SHA-1 hash (for Samsung Health)
  const salt = 'maximostapp';
  const sha1Hash = crypto.createHash('sha1')
    .update(packageName + salt)
    .digest('hex');
  
  // Format SHA-1 as colon-separated pairs
  const formattedSHA1 = sha1Hash.match(/.{1,2}/g).join(':');
  
  // Create a SHA-256 hash
  const sha256Hash = crypto.createHash('sha256')
    .update(packageName + salt)
    .digest('hex');
  
  // Format SHA-256 as colon-separated pairs
  const formattedSHA256 = sha256Hash.match(/.{1,2}/g).join(':');
  
  return {
    packageName,
    sha1Signature: formattedSHA1,
    sha1Plain: sha1Hash,
    sha256Signature: formattedSHA256,
    sha256Plain: sha256Hash
  };
}

// Generate signatures for MaxiMost
const appSignatures = generateAppSignatures('MaxiMost');

console.log('App Package Name:', appSignatures.packageName);
console.log('\n=== SHA-1 SIGNATURE ===');
console.log('App Signature (SHA-1):', appSignatures.sha1Signature);
console.log('\n=== SHA-256 SIGNATURE ===');
console.log('App Signature (SHA-256):', appSignatures.sha256Signature);
console.log('\nThese signatures can be used for your fitness tracker integrations.');
console.log('Note: In a production environment, you would use the actual signing certificate of your app.');

// Save signatures to a file
import fs from 'fs';

const outputContent = `# MaxiMost App Signatures
Generated on: ${new Date().toISOString()}

## App Package Name
${appSignatures.packageName}

## SHA-1 Signature
${appSignatures.sha1Signature}

## SHA-256 Signature
${appSignatures.sha256Signature}

---
Note: In a production environment, you would generate these signatures from your actual app signing certificate.
`;

fs.writeFileSync('app-signatures.md', outputContent);
console.log('\nSignatures have been saved to app-signatures.md');