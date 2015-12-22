# list-distribution
A helper package for analyzing the distribution of a list based on a field in every item.

[![Build Status](https://travis-ci.org/olivif/list-distribution.svg?branch=master)](https://travis-ci.org/olivif/list-distribution)
[![Coverage Status](https://codecov.io/github/olivif/list-distribution/coverage.svg?precision=2)](https://codecov.io/github/olivif/list-distribution)

## How to use it

Construct the distribution with the following parameters

`items` - this is the list of items you want to operate on. it should be an array, and not be null, undefined or empty.
 
`getter` - this is the getter function for the "key" that will be used to compute the distribution

`precision` - this is the precision you want to have on the key, for instance if you use 100, all buckets will be in 100 intervals
 
```js
var distribution = new Distribution(items, getter, precision);

var buckets = distribution.getBuckets();

distribution.printBuckets();
```

## An actual example

Let's say you have a list of git repositories, and you want to see what the distribution of forks is over your list.  

```js
    var repos: [
        { forks: 10,    watchers: 20    },
        { forks: 14,    watchers: 243   },
        { forks: 14523, watchers: 13442 },
        { forks: 143,   watchers: 4232  },
        { forks: 1555,  watchers: 322   },
        { forks: 1,     watchers: 654   },
        { forks: 103,   watchers: 54    }
    ];
```
Your getter should be a function that takes in a repo object and selects the interest property off the repo object, in this case the forks count.

```js
var repoForksGetter = function(repo) { 
    return repo.forks; 
};
```

Now let's construct our distribution object, with a `precision` of 1000.

```js
var distribution = new Distribution(repos, repoForksGetter, 1000);
```

And now let's print it to see what's going on

```js
distribution.printBuckets();
```

This is what you should see 

```sh
Bucket 1000 -> 5
Bucket 2000 -> 1
Bucket 15000 -> 1
```

This is saying there are 5 repositories with less than 1000 forks, 1 repository with 1000-2000 forks and 1 repository with greater than 15000 forks.

You can also get the raw buckets if there is any extra processing or printing that you would like to do. 
```js
var buckets = distribution.getBuckets();
```

## Contributing

For any ideas, suggestions for improvement or bugs, feel free to [file issues](https://github.com/olivif/list-distribution/issues)! PRs are more than welcome also! Thanks :tada: 
     
