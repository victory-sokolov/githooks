import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const TOOLS: Record<string, string> = {
    'eslint': 'ESLint',
    'oxlint': 'oxlint',
    '@biomejs/biome': 'Biome',
    'jshint': 'JSHint',
    'stylelint': 'stylelint',
    'prettier': 'Prettier',
    'oxfmt': 'oxfmt',
    'typescript': 'TypeScript',
    'vitest': 'Vitest',
    'jest': 'Jest',
    'mocha': 'Mocha',
    'cypress': 'Cypress',
    'playwright': 'Playwright',
    'tsup': 'tsup',
    'webpack': 'webpack',
    'esbuild': 'esbuild',
    'vite': 'Vite',
    'rollup': 'Rollup',
    'turbo': 'Turborepo',
    'next': 'Next.js',
    'knip': 'Knip',
    'jscpd': 'jscpd',
    'semantic-release': 'semantic-release',
    'tsx': 'tsx',
    'ts-node': 'ts-node',
};

const [packageManager = 'bun', typosVersion = ''] = process.argv.slice(2);

const run = (cmd: string) => {
    try {
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch {
        return 'not found';
    }
};

const print = (label: string, value: string) => console.log(`  ${label.padEnd(20)}${value}`);

print('Node.js', run('node --version'));
print(packageManager, run(`${packageManager} --version`));
print('typos', typosVersion);

try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const deps = { ...pkg.devDependencies, ...pkg.dependencies };

    const found: Array<{ display: string; version: string }> = [];
    for (const [name, display] of Object.entries(TOOLS)) {
        if (deps[name]) {
            found.push({ display, version: deps[name] });
        }
    }

    if (found.length > 0) {
        console.log('');
        found.sort((a, b) => a.display.localeCompare(b.display));
        for (const t of found) {
            print(t.display, t.version);
        }
    }
} catch {}
