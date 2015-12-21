const should = require("should");
const stdout = require("test-console").stdout;

const Distribution = require("./../lib/list-distribution");

var TestData = {
    Repos: [
        { forks: 10,    watchers: 20    },
        { forks: 14,    watchers: 243   },
        { forks: 14523, watchers: 13442 },
        { forks: 143,   watchers: 4232  },
        { forks: 1555,  watchers: 322   },
        { forks: 1,     watchers: 654   },
        { forks: 103,   watchers: 54    }
    ], 
    RepoForksGetter: function(repo) { return repo.forks; },
    RepoWatchersGetter: function(repo) { return repo.watchers; },
    NoPrecision: 1,
    Precision100: 100,
    Precision1000: 1000,
    Precision10000: 10000,
    PrecisionMillion: 1000000,
}

describe("Distribution tests", function() {

    describe("Distribution construction", function() {
  
        it("should be able to contruct a distribution object", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.NoPrecision);
            
            should.exist(distribution);
            
            done();
        });
        
        it("should not be able to contruct a distribution object with null or undefined items", function(done) {
            
            should(function() { var distrib = new Distribution(null, null, 0); })
                .throw("Items is null or undefined");
            
            should(function() { var distrib = new Distribution(undefined, null, 0); })
                .throw("Items is null or undefined");
            
            done();
        });
        
        it("should not be able to contruct a distribution object with items which arent arrays", function(done) {
            
            should(function() { var distrib = new Distribution({}, null, 0); })
                .throw("Items is not an array");
            
            done();
        });
        
        it("should not be able to contruct a distribution object with items which is empty array", function(done) {
            
            should(function() { var distrib = new Distribution([], null, 0); })
                .throw("Items is empty, no distribution be analyze");
            
            done();
        });
        
        it("should not be able to contruct a distribution object with an null or undefined getter", function(done) {
            
            should(function() { var distrib = new Distribution(TestData.Repos, null, 0); })
                .throw("Getter is null or undefined");
            
            should(function() { var distrib = new Distribution(TestData.Repos, undefined, 0); })
                .throw("Getter is null or undefined");
                
            done();
        });
        
        it("should not be able to contruct a distribution object with a getter which isnt a function", function(done) {
            
            should(function() { var distrib = new Distribution(TestData.Repos, 10, 0); })
                .throw("Getter is not a function");
            
            done();
        });
        
        it("should not be able to contruct a distribution object with a NaN precision", function(done) {
            
            should(function() { var distrib = new Distribution(TestData.Repos, TestData.RepoForksGetter, {}); })
                .throw("Precision is not a number");
            
            done();
        });
        
        
        it("should not be able to contruct a distribution object with a precision < 1", function(done) {
            
            should(function() { var distrib = new Distribution(TestData.Repos, TestData.RepoForksGetter, 0); })
                .throw("Precision should be >= 1");
            
            should(function() { var distrib = new Distribution(TestData.Repos, TestData.RepoForksGetter, -10); })
                .throw("Precision should be >= 1");
            
            done();
        });
        
        it("should not be able to contruct a distribution object with a double precision", function(done) {
            
            should(function() { var distrib = new Distribution(TestData.Repos, TestData.RepoForksGetter, 10.2); })
                .throw("Precision is not a whole number");
            
            done();
        });
    });
    
    describe("Buckets", function() {

        it("should be able to get buckets", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.NoPrecision);
            
            should.exist(distribution);
            
            var buckets = distribution.getBuckets();
            should.exist(buckets);
            
            done();
        });
        
        
        it("should be able to get initialize buckets with no precision", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.NoPrecision);
            
            var buckets = distribution.getBuckets();
            
            should.exist(buckets);
            
            var keys = buckets.keys();
            keys.length.should.eql(7);
            
            var values = buckets.values(); 
            values.length.should.eql(7);
            values.forEach(function(value) { value.should.eql(1); });
            
            done();
        });
        
        it("should be able to get initialize buckets with precision 100", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.Precision100);
            distribution.printBuckets();
            
            var buckets = distribution.getBuckets();
            
            should.exist(buckets);
            
            var keys = buckets.keys();
            keys.length.should.eql(4);
            
            var values = buckets.values(); 
            values.length.should.eql(4);
            
            // Bucket 0 -> 3
            // Bucket 100 -> 2
            // Bucket 1500 -> 1
            // Bucket 14500 -> 1
            buckets.get(0).should.eql(3);
            buckets.get(100).should.eql(2);
            buckets.get(1500).should.eql(1);
            buckets.get(14500).should.eql(1);
            
            done();
        });
        
        it("should be able to get initialize buckets with precision 10000", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.Precision10000);
            distribution.printBuckets();
            
            var buckets = distribution.getBuckets();
            
            should.exist(buckets);
            
            var keys = buckets.keys();
            keys.length.should.eql(2);
            
            var values = buckets.values(); 
            values.length.should.eql(2);
            
            // Bucket 0 -> 6
            // Bucket 10000 -> 1
            buckets.get(0).should.eql(6);
            buckets.get(10000).should.eql(1);
            
            done();
        });
        
        it("should be able to get initialize buckets with precision million", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.PrecisionMillion);
            distribution.printBuckets();
            
            var buckets = distribution.getBuckets();
            
            should.exist(buckets);
            
            var keys = buckets.keys();
            keys.length.should.eql(1);
            
            var values = buckets.values(); 
            values.length.should.eql(1);
            
            buckets.get(0).should.eql(TestData.Repos.length);
            
            done();
        });
    });
    
    describe("Printing", function() {

        it("should be able to print buckets", function(done) {
            
            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.NoPrecision);
            
            var output = stdout.inspectSync(function() {
                distribution.printBuckets();
            });

            output.should.eql([
                "Bucket 1 -> 1\n",
                "Bucket 10 -> 1\n",
                "Bucket 14 -> 1\n",
                "Bucket 103 -> 1\n",
                "Bucket 143 -> 1\n",
                "Bucket 1555 -> 1\n",
                "Bucket 14523 -> 1\n"
            ]);

            done();
        });
        
        it("should be able to print example buckets", function(done) {

            var distribution = new Distribution(TestData.Repos, TestData.RepoForksGetter, TestData.Precision1000);
            distribution.printBuckets();
            
            done();
        });
    });
});