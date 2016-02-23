/**
 * @author Bilal Cinarli
 */

var fs        = require('fs'),
    path      = require('path'),
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

    var finalData,
        data      = {},
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

    var readDir = function(dir, parent) {
        fs.readdirSync(dir).forEach(function(filename) {
            var file = path.join(parentDir, dir, filename),
                stat = fs.statSync(file),
                _key = filename.replace('.' + opts.ext, '').toCamelCase();

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

    finalData = data;

    return finalData;
};

delete require.cache[__filename];