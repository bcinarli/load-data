/**
 * @author Bilal Cinarli
 */

var fs        = require('fs'),
    path      = require('path'),
    resolve   = require('resolve'),
    extend    = require('extend'),
    parentDir = path.dirname(module.parent.filename);

String.prototype.toCamelCase = function() {
    var str = this.toLowerCase().replace(/[-_]/g, ' ');
    return str.replace(/([ -][a-zA-Z\p{M}])/g,
        function($1) {
            return $1.toUpperCase().replace(' ', '');
        });
};

module.exports = function(options) {
    'use strict';

    var data      = {},
        defaults  = {
            dir:    'data',
            cache:  false,
            ext:    'json',
            output: 'json'
        };

    if(typeof options == 'string') {
        options = {
            dir: options
        };
    }

    var opts = extend(defaults, options);

    if(opts.dir[0] !== path.sep && opts.dir.slice(0, 2) !== '.' + path.sep) {
        opts.dir = path.join(process.cwd(), opts.dir);
    }

    var readDir = function(dir, parent) {
        fs.readdirSync(dir).forEach(function(filename) {
            var file = path.join(dir, filename),
                stat = fs.statSync(file),
                _key = filename.replace('.' + opts.ext, '').toCamelCase();

            // file is empty
            if(stat.size === 0){
                return;
            }

            if(stat.isDirectory()) {
                data[_key] = [];
                readDir(dir + filename, data[_key]);
            }

            else {
                if(!stat.isFile()) {
                    return;
                }

                if(parent) {
                    parent[_key] = require(file);
                }

                else {
                    data[_key] = require(file);
                }

                if(!opts.cache) {
                    delete require.cache[require.resolve(file)];
                }
            }
        });
    };

    readDir(opts.dir);

    return data;
};

delete require.cache[__filename];