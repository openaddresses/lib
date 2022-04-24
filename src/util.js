import { writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';

export function local_schema() {
    const local = JSON.parse(readFileSync(new URL('./schema.json', import.meta.url)));
    return local;
}

export default async function schema(url, method, spath) {
    url = new URL('/api/schema', url);

    if (method) url.searchParams.append('method', method);
    if (spath) url.searchParams.append('url', spath);

    const res = await fetch(url, {
        method: 'GET'
    });

    if (!res.ok) throw new Error('Failed to fetch schema');

    const body = await res.json();
    if (!method && !spath) {
        const local = local_schema();
        local.schema = body;

        await writeFile(path.resolve(__dirname, './schema.json'), JSON.stringify(local, null, 4));

        return local;
    } else {
        return body;
    }
}
