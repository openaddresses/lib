import fetch from 'node-fetch';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export async function local_schema() {
    const local = JSON.parse(await readFile(new URL('./schema.json', import.meta.url)));
    return local;
}

export default async function schema(url, method, spath) {
    url = new URL('/api/schema', url);

    if (method) url.searchParams.append('method', method);
    if (spath) url.searchParams.append('url', spath);

    const res = await request({
        json: true,
        method: 'GET',
        url: url
    });

    if (res.statusCode !== 200) throw new Error(res.body.message ? res.body.message : res.body);

    if (!method && !spath) {
        const local = local_schema();
        local.schema = res.body;

        await writeFile(path.resolve(__dirname, './schema.json'), JSON.stringify(local, null, 4));

        return local;
    } else {
        return res.body;
    }
}
