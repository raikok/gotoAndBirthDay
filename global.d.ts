// // This file will add both p5 instanced and global intellisence
import p5 = require('p5');
import * as p5Global from 'p5/global'

export = p5;
export as namespace p5;

declare global {
    interface Window {
        p5: typeof p5,
    }
}