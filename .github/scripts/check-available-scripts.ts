import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const SCRIPTS = ['lint', 'format:check', 'typecheck', 'test', 'build', 'jscpd', 'knip', 'audit'] as const;
const githubOutput = process.env.GITHUB_OUTPUT;

function writeOutput(line: string) {
    if (githubOutput) {
        appendFileSync(githubOutput, line + '\n');
    }
}

const results: Array<{ script: string; available: boolean }> = [];

try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const scripts = pkg.scripts || {};

    for (const s of SCRIPTS) {
        const available = !!scripts[s];
        results.push({ script: s, available });
        writeOutput(`${s.replace(/:/g, '_')}=${available}`);
    }
} catch {
    for (const s of SCRIPTS) {
        results.push({ script: s, available: false });
        writeOutput(`${s.replace(/:/g, '_')}=false`);
    }
}

const hasSrcLib = existsSync('src') || existsSync('lib');
writeOutput(`has_src_lib=${hasSrcLib}`);

console.log(`  Available scripts: ${results.filter(r => r.available).map(r => r.script).join(', ') || 'none'}`);
console.log(`  Has src/lib: ${hasSrcLib}`);
