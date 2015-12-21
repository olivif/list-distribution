const round = require("round");
const HashMap = require("hashmap");
const typechecker = require("typechecker");

// Constructor
function Distribution(items, getter, precision) {
    
    var that = this;
    
    // Validation
    if (typechecker.isNull(items) || typechecker.isUndefined(items)) {
        throw new Error("Items is null or undefined");
    }
    if (!typechecker.isArray(items)) {
        throw new Error("Items is not an array");
    }
    if (items.length === 0) {
        throw new Error("Items is empty, no distribution be analyze");
    }
    if (typechecker.isNull(getter) || typechecker.isUndefined(getter)) {
        throw new Error("Getter is null or undefined");
    }
    if (!typechecker.isFunction(getter)) {
        throw new Error("Getter is not a function");
    }
    if (!typechecker.isNumber(precision)) {
        throw new Error("Precision is not a number");
    }
    if (precision < 1) {
        throw new Error("Precision should be >= 1");
    }
    if (precision % 1 !== 0) {
        throw new Error("Precision is not a whole number");
    }
    
    // Properties
    this.buckets = new HashMap();
    
    // Initialization    
    items.forEach(function(item) {
        var number = getter(item); 
        var bucket = round.down(number, precision);
        if (!that.buckets.has(bucket)) {
            that.buckets.set(bucket, 0);
        } 
        that.buckets.set(bucket, that.buckets.get(bucket) + 1);
    }, this);
}

Distribution.prototype.getBuckets = function() {
    return this.buckets;
} 

Distribution.prototype.printBuckets = function(items, getter, precision) {
    this.buckets.forEach(function(value, key) {
        console.log("Bucket " + key + " -> " + value);
    });
}

// Export the class
module.exports = Distribution;