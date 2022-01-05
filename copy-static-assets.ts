import * as shell from 'shelljs';

shell.cp('-R', 'src/constants/*.json', 'dist/constants');
