const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const VAULT_ADDR = 'https://127.0.0.1:8200';
const ROOT_TOKEN = process.env.VAULT_ROOT_TOKEN || 'YOUR_VAULT_ROOT_TOKEN'; // Set this in your environment

async function updateVault() {
    try {
        console.log('Fetching existing secrets...');
        const fetchResponse = await fetch(`${VAULT_ADDR}/v1/secret/data/sovereign-estate`, {
            method: 'GET',
            headers: { 'X-Vault-Token': ROOT_TOKEN }
        });

        let existingSecrets = {};
        if (fetchResponse.ok) {
            const data = await fetchResponse.json();
            existingSecrets = data.data.data || {};
            console.log('Found existing secrets:', Object.keys(existingSecrets));
        }

        const newSecrets = {
            ...existingSecrets,
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY'
        };

        console.log('Updating secrets with new Stripe credentials...');
        const updateResponse = await fetch(`${VAULT_ADDR}/v1/secret/data/sovereign-estate`, {
            method: 'POST',
            headers: {
                'X-Vault-Token': ROOT_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: newSecrets }) // KV v2 requires wrapping in "data" object
        });

        if (!updateResponse.ok) {
            const errText = await updateResponse.text();
            throw new Error(`Failed to update vault: ${updateResponse.status} ${errText}`);
        }

        console.log('Successfully added STRIPE_SECRET_KEY to Vault!');
    } catch (e) {
        console.error('Error:', e);
    }
}

updateVault();
