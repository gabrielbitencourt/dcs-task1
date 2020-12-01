const assert = require('assert');
const Metrics = require('../src/metric');

describe('sum testing', () => {
    it('should return 1', () => {
        const metrics = new Metrics();
        metrics.add('test', 1);
        return assert(metrics.sum('test') === 1);
    });
    it('should throw error for non-existing keys', () => {
        const metrics = new Metrics();
        try {
            metrics.sum('void');
            return assert.fail("Error not thrown");
        }
        catch (error) {
            return assert.ok(error);
        }
    });
    it('should remove metrics older than one hour', () => {
        const initial = Date.now();

        const metrics = new Metrics();
        metrics.add('test', 3, initial - (3600 * 1000) + 1);
        assert(metrics.sum('test', initial) === 3);

        metrics.add('test', 1);
        return assert(metrics.sum('test', initial + 2) === 1);
    })
});