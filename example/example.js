const Distribution = require("list-distribution");

// An example set of items
var repos = [
    { forks: 10,    watchers: 20    },
    { forks: 14,    watchers: 243   },
    { forks: 14523, watchers: 13442 },
    { forks: 143,   watchers: 4232  },
    { forks: 1555,  watchers: 322   },
    { forks: 1,     watchers: 654   },
    { forks: 103,   watchers: 54    }
];

// A getter which operates on a single item in the list
// and gets the interest property from it
var repoForksGetter = function(repo) { 
    return repo.forks; 
};

// Construct the distribution with 
// - the items : in this case the list of repos
// - the getter : in this case the repoForksGetter
// - the precision : in this case 1000 - this is the number the you 
// want to round the forks up to in order to create the buckets
var distribution = new Distribution(repos, repoForksGetter, 1000);

// Now your distribution is created and a set of buckets is available
// for you to act on the data. 

// You can print the buckets 
distribution.printBuckets();

// You should get something like this 
// => 
//      Bucket 0 -> 5
//      Bucket 1000 -> 1
//      Bucket 14000 -> 1

// You can also get the actual buckets, which is a HashMap object 
var buckets = distribution.getBuckets();
console.log(buckets);

// That should look something like this
// => 
//      HashMap { 
// 	        _data: { 
// 		           '0': [ 0, 5 ], 
// 		           '1000': [ 1000, 1 ], 
// 		           '14000': [ 14000, 1 ] 
// 	        } 
//      }