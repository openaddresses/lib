function help(argv, oa) {
    if (!argv._[2] && !argv._[3]) {
        console.log('');
        console.log('usage: oa.js <command> [--raw] [--script] [--version] [--help]');
        console.log('');
        console.log('<command>');
        for (const s of Object.keys(oa.schema.cli)) {
            console.log('    ' + s + ' '.repeat(28 - s.length) + oa.schema.cli[s].description);
        }
        options();
    } else if (argv._[2] && !argv._[3]) {
        console.log('');
        console.log(`usage: oa.js ${argv._[2]} <subcommand> [--raw] [--script] [--version] [--help]`);
        console.log('');
        console.log('desc:', oa.schema.cli[argv._[2]].description);
        console.log('');
        console.log('<command>');
        for (const s of Object.keys(oa.schema.cli[argv._[2]].cmds)) {
            console.log('    ' + s);
        }
        options();
    } else {
        console.log('');
        console.log('Unknown help subcommand');
        console.log('oa --help');
        console.log('oa <subcommand> --help');
        console.log('');
    }
}

function options() {
    console.log('');
    console.log('<options>');
    console.log('    --raw                       Print the raw JSON responses when using the CLI');
    console.log('    --script                    Disable prompts when using the CLI');
    console.log('    --version                   Print the current version of the CLI');
    console.log('    --help                      Print a help message');
    console.log('');
}

module.exports = {
    help
};
