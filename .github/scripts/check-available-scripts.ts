import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const SCRIPTS = ['lint', 'format:check', 'typecheck', 'test', 'build', 'jscpd', 'knip', 'audit'] as const;
const githubOutput = process.env.GITHUB_OUTPUT;

function output(line: string) {
    if (githubOutput) {
        appendFileSync(githubOutput, line + '\n');
    } else {
        console.log(line);
    }
}

try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const scripts = pkg.scripts || {};

    for (const s of SCRIPTS) {
        const outputName = s.replace(/:/g, '_');
        output(`${outputName}=${scripts[s] ? 'true' : 'false'}`);
    }
} catch {
    for (const s of SCRIPTS) {
        const outputName = s.replace(/:/g, '_');
        output(`${outputName}=false`);
    }
}

output(`has_src_lib=${existsSync('src') || existsSync('lib') ? 'true' : 'false'}`);
