import vault from 'node-vault';
import dotenv from 'dotenv';
dotenv.config();

const client = vault({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
    token: 'root-token'
});

async function test() {
    const paths = [
        'secret/data/sovereign-estate',
        'secret/sovereign-estate',
        'sovereign-estate'
    ];

    for (const p of paths) {
        try {
            console.log(`Trying path: ${p}`);
            const res = await client.read(p);
            console.log(`Success on ${p}:`, JSON.stringify(res, null, 2));
        } catch (e: any) {
            console.log(`Error on ${p}:`, e.response ? e.response.statusCode : e.message);
        }
    }
}

test();
