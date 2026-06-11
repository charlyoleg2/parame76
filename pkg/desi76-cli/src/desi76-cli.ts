#!/usr/bin/env node
// desi76-cli.ts

import { geom_cli } from 'geomcli';
import packag from '../package.json' with { type: 'json' };
import { designList } from './designList.ts';

//console.log('desi76-cli says hello');
await geom_cli(process.argv, designList, packag, 'output');
//console.log('desi76-cli says bye');
