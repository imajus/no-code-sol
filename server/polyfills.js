import fetch from 'node-fetch';
import { AbortController } from 'node-abort-controller';

global.fetch = fetch;
global.AbortController = AbortController;
