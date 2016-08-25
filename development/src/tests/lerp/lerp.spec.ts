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

    // Completion at end tests
    describe('Completion values at time === 1', () => {

        // Quadratic
        it('Lerp completes after given duration - EaseOut Quadratic', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Quadratic);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseIn Quadratic', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseIn, Style.Quadratic);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseInOut Quadratic', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseInOut, Style.Quadratic);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        // Linear
        it('Lerp completes after given duration - EaseOut Linear', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Linear);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseIn Linear', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Linear);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseInOut Linear', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Linear);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        // Sine
        it('Lerp completes after given duration - EaseOut Sine', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Sine);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseIn Sine', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Sine);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });

        it('Lerp completes after given duration - EaseInOut Sine', function () {
            this.lerp.define([[0, 1], [3, 6]], 10, Transition.EaseOut, Style.Sine);
            checkLerpCompletesAtOne(this.lerp, 1, 6, 10);
        });
    });

    // Increases in Lerp Value tests
    describe('Increase of lerp values over time', () => {

        // Quadratic
        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseOut, Style.Quadratic', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 10, Transition.EaseOut, Style.Quadratic);
            checkLerpOverTime(done, this.lerp, 0.00718704, 0.0159359, 0.01, 3.01437408, 3.031872, 0.01);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseIn, Style.Quadratic', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 10, Transition.EaseIn, Style.Quadratic);
            checkLerpOverTime(done, this.lerp, 0.00001225, 0.00004761, 0.003, 3.00009522, 3.00009522, 0.005);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseInOut, Style.Quadratic', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 10, Transition.EaseInOut, Style.Quadratic);
            checkLerpOverTime(done, this.lerp, 0.0000231, 0.0001008, 0.003, 3.000046, 3.0002016, 0.005);
        });

        // Linear
        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseOut, Style.Linear', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseOut, Style.Linear);
            checkLerpOverTime(done, this.lerp, 0.00925, 0.017, 0.01, 3.020, 3.033, 0.01);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseIn, Style.Linear', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseIn, Style.Linear);
            checkLerpOverTime(done, this.lerp, 0.00925, 0.017, 0.01, 3.020, 3.033, 0.01);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseInOut, Style.Linear', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseInOut, Style.Linear);
            checkLerpOverTime(done, this.lerp, 0.00925, 0.017, 0.01, 3.020, 3.033, 0.01);
        });

        // Sine
        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseOut, Style.Sine', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseOut, Style.Sine);
            checkLerpOverTime(done, this.lerp, 0.013744, 0.02748, 0.003, 3.02748, 3.05497, 0.005);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseIn, Style.Sine', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseIn, Style.Sine);
            checkLerpOverTime(done, this.lerp, 0.000105, 0.000399, 0.0003, 3.00021, 3.00079, 0.0003);
        });

        // Hard to indicate what these values _should_ be, so hard coded
        it('Lerp increases in value - Transition.EaseInOut, Style.Sine', function (done) {

            this.lerp.define([[0, 1], [3, 5]], 4, Transition.EaseInOut, Style.Sine);
            checkLerpOverTime(done, this.lerp, 0.000211, 0.00084, 0.0003, 3.000422, 3.00168, 0.0003);
        });
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
                               set1First: number, set1Second: number, set1Delta: number,
                               set2First: number, set2Second: number, set2Delta: number) {

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
            expect(firstResult[0]).toBeGreaterThan(set1First - set1Delta);
            expect(firstResult[0]).toBeLessThan(set1First + set1Delta);

            expect(secondResult[0]).toBeGreaterThan(set1Second - set1Delta);
            expect(secondResult[0]).toBeLessThan(set1Second + set1Delta);

            // Second set values
            expect(firstResult[1]).toBeGreaterThan(set2First - set2Delta);
            expect(firstResult[1]).toBeLessThan(set2First + set2Delta);

            expect(secondResult[1]).toBeGreaterThan(set2Second - set2Delta);
            expect(secondResult[1]).toBeLessThan(set2Second + set2Delta);

            // Second should always be bigger
            expect(secondResult[0]).toBeGreaterThan(firstResult[0]);
            expect(secondResult[1]).toBeGreaterThan(firstResult[1]);

            // Finish this test
            done();

        }, 100);
    }
});
