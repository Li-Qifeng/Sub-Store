const path = require('path');
const { build } = require('esbuild');

const rootDir = path.join(__dirname, '..');
const outFile = path.join(rootDir, 'api', 'index.js');

(async () => {
    await build({
        entryPoints: [path.join(rootDir, 'src', 'serverless.js')],
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: ['node18'],
        outfile: outFile,
        sourcemap: false,
        banner: { js: '/* Sub-Store Vercel Serverless Bundle */' },
        alias: {
            '@': path.join(rootDir, 'src'),
        },
    });
    // eslint-disable-next-line no-console
    console.log(`Built ${outFile}`);
})().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
