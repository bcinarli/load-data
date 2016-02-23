# Load Data
Loads and merge `json` data to a JavaScript object from your local directory e.g. `data/`. For the final data, file 
name transformed to `camelCase` variable in `json`. It supports directory nesting.

## Usage
In your module or `Gulp|Gruntfile`:

```js
// your json files are in data/
var data = require('load-data')();

// from another directory
var data2 = require('load-data')('path-to-directory');

// you can use your data as 
// console.log(data['filename']);
```

## Options
You can pass in an object of options while calling the function.

```js
dir: 'data/',
cache: false,
ext: 'json'
```

```js
// loading data with custom options
var options = {
    dir: './my-source/',
    cache: true
}

var data = require('load-data')(options);
```

### Dir
The directory where you local data files (`json`) stored.

### Cache
Default: false
If set to false, every time data loaded, uses the most recent values in the json file. Otherwise, `require` method 
caches the loaded files so, the changes are not loaded after first run.

### Ext
Loads files with `json` extension.