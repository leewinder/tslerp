import { Intervals } from '../../lib/lerp/interval';
import { Continuation } from '../../lib/lerp/interval';

describe('Interval Tests', () => {

    // Called before each test
    beforeEach(function () {
        jasmine.clock().install();
        this.intervals = new Intervals();
    });

    // Called after each test
    afterEach(function () {
        jasmine.clock().uninstall();
        this.intervals.stop();
    });

    it('Interval triggers after fixed interval', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return false;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL + 10);
        expect(numberOfTimesCalled).toBe(1);

    });

    it('Interval doesn\'t trigger before interval', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Cancel;
        });

        // Move on
        jasmine.clock().tick(1);
        expect(numberOfTimesCalled).toBe(0);

    });

    it('Interval triggers multiple times', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {

            ++numberOfTimesCalled;
            return (numberOfTimesCalled === 5 ? Continuation.Cancel : Continuation.Continue);
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 4);
        expect(numberOfTimesCalled).toBeGreaterThan(3);

    });

    it('Interval stops when return is false', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {

            ++numberOfTimesCalled;
            return (numberOfTimesCalled === 3 ? Continuation.Cancel : Continuation.Continue);
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 5);
        expect(numberOfTimesCalled).toBe(3);

    });

    it('Interval scan be manually stopped', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Stop it and record how many times we've called so far
        this.intervals.stop();
        let timesAlreadyCalled = numberOfTimesCalled;

        // Move on a bit more
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Numver of times called should not have increased
        expect(numberOfTimesCalled).toBe(timesAlreadyCalled);

    });

    it('Interval can be stopped and restarted', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Stop it and record how many times we've called so far
        this.intervals.stop();
        let timesAlreadyCalled = numberOfTimesCalled;
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on a bit more
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Numver of times called should have continued to increase
        expect(numberOfTimesCalled).toBeGreaterThan(timesAlreadyCalled);

    });

    it('Interval can be paused', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Pause it and record how many times we have run
        this.intervals.pause(true);
        let timesAlreadyCalled = numberOfTimesCalled;

        // Move on a bit more
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);
        expect(numberOfTimesCalled).toBe(timesAlreadyCalled);

        // Resume
        this.intervals.pause(false);
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Numver of times called should have continued to increase
        expect(numberOfTimesCalled).toBeGreaterThan(timesAlreadyCalled);

    });

    it('Interval pause cancelled when stopped', function () {

        let numberOfTimesCalled = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Pause it and record how many times we have run
        this.intervals.pause(true);
        let timesAlreadyCalled = numberOfTimesCalled;

        // Start again
        this.intervals.stop();
        this.intervals.start(() => {
            ++numberOfTimesCalled;
            return Continuation.Continue;
        });

        // Move on a bit more
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Numver of times called should have continued to increase
        expect(numberOfTimesCalled).toBeGreaterThan(timesAlreadyCalled);

    });

    it('Multiple intervals run concurrently', function () {

        let numberOfTimesCallback1 = 0;
        let numberOfTimesCallback2 = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCallback1;
            return Continuation.Cancel;
        });
        this.intervals.start(() => {
            ++numberOfTimesCallback2;
            return Continuation.Cancel;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Both should have run
        expect(numberOfTimesCallback1).toBe(1);
        expect(numberOfTimesCallback2).toBe(1);

    });

    it('Multiple intervals can be removed independantly', function () {

        let numberOfTimesCallback1 = 0;
        let numberOfTimesCallback2 = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCallback1;
            return Continuation.Continue;
        });
        this.intervals.start(() => {
            ++numberOfTimesCallback2;
            return Continuation.Cancel;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Both should have run, second should have only run once
        expect(numberOfTimesCallback1).toBeGreaterThan(1);
        expect(numberOfTimesCallback2).toBe(1);

    });

    it('Multiple intervals added in future', function () {

        let numberOfTimesCallback1 = 0;
        let numberOfTimesCallback2 = 0;

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCallback1;
            return Continuation.Continue;
        });
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 5);

        this.intervals.start(() => {
            ++numberOfTimesCallback2;
            return Continuation.Continue;
        });

        // Move on
        jasmine.clock().tick(Intervals.DEFAULT_MILLISECOND_INTERVAL * 3);

        // Both should have run, second should have only run once
        expect(numberOfTimesCallback2).toBeGreaterThan(1);
        expect(numberOfTimesCallback1).toBeGreaterThan(numberOfTimesCallback2);

    });

    it('Chaining intervals runs in sequence when cancelled', function (done) {

        let numberOfTimesCallback1 = 0;
        let numberOfTimesCallback2 = 0;

        // Disable the Jasmine clock so we can time out correctly
        jasmine.clock().uninstall();

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCallback1;

            if (numberOfTimesCallback1 === 3) {

                // Trigger off a new one
                this.intervals.start(() => {
                    ++numberOfTimesCallback2;
                    return Continuation.Cancel;
                });
                return Continuation.Cancel;
            } else {
                return Continuation.Continue;
            }
        });

        // Wait
        setTimeout(() => {

            // Should have been called the right amount of time
            expect(numberOfTimesCallback1).toBe(3);
            expect(numberOfTimesCallback2).toBe(1);

            // Done
            done();

        }, 200);

    });

    it('Chaining intervals runs in sequence when continuing', function (done) {

        let numberOfTimesCallback1 = 0;
        let numberOfTimesCallback2 = 0;

        // Disable the Jasmine clock so we can time out correctly
        jasmine.clock().uninstall();

        // Set up our intervals and start it
        this.intervals.start(() => {
            ++numberOfTimesCallback1;

            if (numberOfTimesCallback1 === 3) {

                // Trigger off a new one
                this.intervals.start(() => {
                    ++numberOfTimesCallback2;
                    return Continuation.Continue;
                });
            }
            // Continue
            return Continuation.Continue;
        });


        // Wait
        setTimeout(() => {

            // Should have been called the right amount of time
            expect(numberOfTimesCallback1).toBe(numberOfTimesCallback2 + 3);
            done();

        }, 300);

    });
});
