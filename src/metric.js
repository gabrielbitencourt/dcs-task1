const ONE_HOUR = 3600 * 1000;

/**
 * Represents metrics for a key.
 */
class Metric {
    /**
     * Creates a metric for a given key.
     * @param {string} id 
     */
    constructor(id) {
        this.id = id;
        this.values = [];
    }

    /**
     * Adds a new metric value to the current key. 
     * @param {number} value - value to add to metric.
     * @param {Date} [time=Date.now()] - time that metric was recorded.
     */
    add(value, time = Date.now()) {
        return this.values.push({ value, time });
    }

    /**
     * Clear metrics older than the time passed
     * @param {Date} [time=Date.now()] - time limit for a metric to be considered valid.
     */
    clearOlderThan(time = Date.now()) {
        this.values = this.values.filter((v) => {
            return v.time >= time;
        });
    }

    /**
     * Sums all the current key metrics'.
     * @returns {number} Sum of all metrics.
     */
    sum() {
        return this.values.reduce((prev, curr) => {
            return prev + curr.value;
        }, 0);
    }
}

/**
 * Represents a set of metrics
 */
module.exports = class Metrics {
    /**
     * Creates the metric set.
     * @param {Object} [metrics={}] - initial metrics values.
     */
    constructor(metrics = {}) {
        this.metrics = metrics;
    }

    /**
     * Adds a new metric to an id. If the id did not exist it is created.
     * @param {number} id - id of the existing/new metric.
     * @param {number} value - value to be recorded.
     * @param {Date} [time=Date.now()] - time to record at.
     */
    add(id, value, time = Date.now()) {
        if (!this.metrics[id]) {
            this.metrics[id] = new Metric(id);
        }
        this.metrics[id].add(value, time);
    }

    /**
     * Returns the sum of the valid metrics of an id (it will clear the old ones before returning the sum).
     * @param {number} id - id of the metric to be retrived.
     * @param {Date} [time=Date.now()] - base time to calculate which records need to be cleared.
     * @param {number} [offset=ONE_HOUR] - base offset to calculate which records need to be cleared.
     * @returns {number} metric sum.
     */
    sum(id, time = Date.now(), offset = ONE_HOUR) {
        const metric = this.metrics[id];
        if (!metric) throw new Error(`Key ${id} not found`);
        metric.clearOlderThan(time - offset);
        return metric.sum();
    }

}