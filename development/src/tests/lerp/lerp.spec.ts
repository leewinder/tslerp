import { Lerp } from '../../lib/lerp/lerp';
import { Transition } from '../../lib/lerp/lerp';
import { Style } from '../../lib/lerp/lerp';

describe('Lerp Tests', () => {

    // Called before each test
    beforeEach(function () {
        jasmine.clock().install();
        jasmine.clock().mockDate();
        this.lerp = new Lerp();
    });

    // Called after each test
    afterEach(function () {
        jasmine.clock().uninstall();
        this.lerp.stop();
    });

    it('Lerp takes a set of values', function () {
        this.lerp.define([[0, 1]], 10);
        this.lerp.define([[0, 1], [2, 3]], 10);
    });

    it('Lerp takes optional styles', function () {
        this.lerp.define([[0, 1]], 10, Transition.EaseOut);
        this.lerp.define([[0, 1]], 10, Transition.EaseOut, Style.Quadratic);
    });

    it('Lerp completes after given duration - EaseOut Quadratic', function () {
        this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Quadratic);
        checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
    });

    it('Lerp completes after given duration - EaseOut Linear', function () {
        this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Linear);
        checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
    });

    it('Lerp reports time in a linear manner', function () {
        this.lerp.define([[0, 1], [3, 6]], 10);

        let lastTime = 0;
        this.lerp.lerp((results: number[], time: number) => {
            // Just save our values
            lastTime = time;
        });

        // Go forward
        jasmine.clock().tick(1000 * 5);

        // Check we finished
        expect(lastTime).toBeCloseTo(0.5, 3);
    });

    // Hard to indicate what these values _should_ be, so hard coded
    it('Lerp increases in value - Transition.EaseOut, Style.Quadratic', function (done) {

        this.lerp.define([[0, 1], [3, 5]], 10, Transition.EaseOut, Style.Quadratic);
        checkLerpOverTime(done, this.lerp, 0.00718704, 0.0159359, 1, 3.01437408, 3.031872, 1);
    });

    // Hard to indicate what these values _should_ be, so hard coded
    it('Lerp increases in value - Transition.EaseOut, Style.Linear', function (done) {

        this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseOut, Style.Linear);
        checkLerpOverTime(done, this.lerp, 0.00925, 0.017, 2, 3.020, 3.033, 2);
    });

    // Hard to indicate what these values _should_ be, so hard coded
    it('Pause temporarily stops the lerp', function (done) {

        this.lerp.define([[0, 1]], 10);

        // Uninstall the clock so our setTimeout works correctly
        // as mocking the clock doesn't really trigger our intervals
        jasmine.clock().uninstall();

        // We need to track multiple values
        let lerpResults: number[] = null;
        this.lerp.lerp((results: number[], time: number) => {
            lerpResults = results;
        });

        // Spin through this a couple of times
        setTimeout(() => {

            // Pause after we've gone through a couple of iterations
            this.lerp.pause(true);
            let previousResults: number[] = lerpResults;

            // Run again, nothing should happen
            setTimeout(() => {

                // Check the values are the same after the pause
                expect(lerpResults[0]).toBe(previousResults[0]);
                this.lerp.pause(false);

                // Run again, we should continue now
                setTimeout(() => {
                    // We should have moved one and we're done
                    expect(lerpResults[0]).toBeGreaterThan(previousResults[0]);
                    done();
                }, 50);

            }, 50);

        }, 50);
    });

    // Hard to indicate what these values _should_ be, so hard coded
    it('Stop terminates the lerp', function (done) {

        this.lerp.define([[0, 1]], 10);

        // Uninstall the clock so our setTimeout works correctly
        // as mocking the clock doesn't really trigger our intervals
        jasmine.clock().uninstall();

        // We need to track multiple values
        let lerpResults: number[] = null;
        this.lerp.lerp((results: number[], time: number) => {
            lerpResults = results;
        });

        // Spin through this a couple of times
        setTimeout(() => {

            // Pause after we've gone through a couple of iterations
            this.lerp.stop();
            let previousResults: number[] = lerpResults;

            // Run again, nothing should happen
            setTimeout(() => {

                // Check the values are the same after the stop
                expect(lerpResults[0]).toBe(previousResults[0]);

                // Run again, we should continue now
                setTimeout(() => {

                    // Check the values are the same after the stop
                    expect(lerpResults[0]).toBe(previousResults[0]);
                    done();
                }, 50);

            }, 50);

        }, 50);
    });

    // Hard to indicate what these values _should_ be, so hard coded
    it('Able to chain lerps', function (done) {

        this.lerp.define([[0, 1]], 0.2);

        // Uninstall the clock so our setTimeout works correctly
        // as mocking the clock doesn't really trigger our intervals
        jasmine.clock().uninstall();

        // We need to track multiple values
        let timeInFirst = 0;
        let timeInSecond = 0;
        this.lerp.lerp((results: number[], time: number) => {
            timeInFirst = time;
            if (timeInFirst === 1) {
                this.lerp.define([[0, 1]], 0.2);
                this.lerp.lerp((secondResults: number[], secondTime: number) => {
                    timeInSecond = secondTime;
                });
            }
        });

        // Spin through this a couple of times
        setTimeout(() => {
            // First and second will have run
            expect(timeInFirst).toBe(1);
            expect(timeInSecond).toBe(1);

            done();

        }, 500);
    });


    // Support Functions

    //
    // Checks for a given lerp that after the run, the lerp is complete, time is at 1 and we're at the end values
    //
    function checkLerpCompletesAtOne(lerp: Lerp, rangeOne: number, rangeTwo: number, duration: number) {

        let lastResults: number[] = [0, 0];
        let lastTime = 0;
        lerp.lerp((results: number[], time: number) => {
            // Just save our values
            lastResults = results;
            lastTime = time;
        });

        // Go forward
        jasmine.clock().tick(1000 * duration);

        // Check we finished
        expect(lastResults[0]).toBe(rangeOne);
        expect(lastResults[1]).toBe(rangeTwo);
        expect(lastTime).toBe(1);
    }

    //
    // For a given lerp, tracks the expected value over time
    //
    function checkLerpOverTime(done: DoneFn, lerp: Lerp,
                               set1First: number, set1Second: number, set1Accuracy: number,
                               set2First: number, set2Second: number, set2Accuracy: number) {

        // Uninstall the clock so our setTimeout works correctly
        // as mocking the clock doesn't really trigger our intervals
        jasmine.clock().uninstall();

        // We need to track multiple values
        let firstResult: number[] = null;
        let secondResult: number[] = null;

        lerp.lerp((results: number[], time: number) => {

            if (firstResult === null) {
                firstResult = results;
            } else if (secondResult == null) {
                secondResult = results;
            }
        });

        // Wait for our work to be done
        setTimeout(() => {

            // Expect our increased values to be around the same each time
            expect(firstResult[0]).toBeCloseTo(set1First, set1Accuracy);
            expect(firstResult[1]).toBeCloseTo(set2First, set2Accuracy);

            expect(secondResult[0]).toBeCloseTo(set1Second, set1Accuracy);
            expect(secondResult[1]).toBeCloseTo(set2Second, set2Accuracy);

            expect(secondResult[0]).toBeGreaterThan(firstResult[0]);
            expect(secondResult[1]).toBeGreaterThan(firstResult[1]);

            // Finish this test
            done();

        }, 100);
    }
});
