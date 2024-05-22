import fs from 'fs-extra';

export default function sessionize(
    data: string,
    mode: string| undefined
) {
    if (mode === undefined)
        mode = 'write';

    let sessions_json = fs.readFileSync('server-sessions.json', { encoding: 'utf-8' });
    let sessions_data = JSON.parse(sessions_json);

    switch(mode) {
        case 'write':
            sessions_data.push(data);
            break;
        case 'slice':
            sessions_data.splice(sessions_data.indexOf(data), 1);
            break;
        case 'read':
            return sessions_data.includes(data) as boolean;
    }

    fs.writeFileSync('server-sessions.json', JSON.stringify(sessions_data, undefined, 2));

    return false;
}