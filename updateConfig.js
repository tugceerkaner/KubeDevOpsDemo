const fs = require('fs');

// Load the Terraform outputs
const terraformOutput = JSON.parse(fs.readFileSync('./terraform_output.json', 'utf8'));

const backendIp = terraformOutput.backend_ip.value;
const frontendIp = terraformOutput.frontend_ip.value;

console.log('backendIp', backendIp);

console.log('frontendIp', frontendIp);

// Update backend-service.yaml
let backendService = fs.readFileSync('./k8s/backend-service.yaml', 'utf8');
backendService = backendService.replace(/loadBalancerIP: .*/, `loadBalancerIP: ${backendIp}`);
fs.writeFileSync('./k8s/backend-service.yaml', backendService);

// Update frontend-service.yaml
let frontendService = fs.readFileSync('./k8s/frontend-service.yaml', 'utf8');
frontendService = frontendService.replace(/loadBalancerIP: .*/, `loadBalancerIP: ${frontendIp}`);
fs.writeFileSync('./k8s/frontend-service.yaml', frontendService);

// Update main.js
let mainJsContent = fs.readFileSync('./frontend/main.js', 'utf-8');
mainJsContent = mainJsContent.replace(/const backendUrl = ".*";/, `const backendUrl = "http://${backendIp}";`);
fs.writeFileSync('./frontend/main.js', mainJsContent);

console.log('Configurations have been updated with the new IP addresses');
