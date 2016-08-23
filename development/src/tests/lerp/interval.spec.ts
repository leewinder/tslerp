import { Intervals } from '../../lib/lerp/interval';

describe('Interval Tests', () => {

    // Called before each test
    beforeEach(function () {
        jasmine.clock().install();
    });

    // Called after each test
    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('Interval triggers after fixed interval', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        let intervals: Intervals = new Intervals(() => {
            ++numberOfTimesCalled;
            return false;
        });
        intervals.start();

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL + 10);
        expect(numberOfTimesCalled).toBe(1);

    });

    it('Interval doesn\'t trigger before interval', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        let intervals: Intervals = new Intervals(() => {
            ++numberOfTimesCalled;
            return false;
        });
        intervals.start();

        // Move on
        jasmine.clock().tick(1);
        expect(numberOfTimesCalled).toBe(0);

    });

    it('Interval triggers multiple times', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        let intervals: Intervals = new Intervals(() => {

            ++numberOfTimesCalled;
            return (numberOfTimesCalled === 5 ? false : true);
        });
        intervals.start();

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 4);
        expect(numberOfTimesCalled).toBeGreaterThan(3);

    });

    it('Interval stops when return is false', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        let intervals: Intervals = new Intervals(() => {

            ++numberOfTimesCalled;
            return (numberOfTimesCalled === 3 ? false : true);
        });
        intervals.start();

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 5);
        expect(numberOfTimesCalled).toBe(3);

    });
});
