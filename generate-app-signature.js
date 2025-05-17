// Generate a sample app signature for Samsung Health integration
import crypto from 'crypto';

// Create a function to generate a signature based on the package name
function generateAppSignature(packageName) {
  // Create a SHA-1 hash of the package name with a salt
  const salt = 'maximostapp';
  const hash = crypto.createHash('sha1')
    .update(packageName + salt)
    .digest('hex');
  
  // Format as colon-separated pairs (typical format for app signatures)
  const formattedSignature = hash.match(/.{1,2}/g).join(':');
  
  return {
    packageName,
    signature: formattedSignature,
    plainHash: hash
  };
}

// Generate signature for MaxiMost
const appSignature = generateAppSignature('MaxiMost');

console.log('App Package Name:', appSignature.packageName);
console.log('App Signature (SHA-1):', appSignature.signature);
console.log('\nThis signature can be used for your Samsung Health integration application.');
console.log('Note: In a production environment, you would use the actual signing certificate of your app.');