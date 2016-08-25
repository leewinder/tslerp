import { Intervals } from './interval';
import { Continuation } from './interval';

//
// Types of lerps available
//
// Transition style
export enum Transition {
    EaseOut,
    EaseIn,
    EaseInOut,
}

// Movement style
export enum Style {
    Linear,
    Quadratic,
    Sine,
}

//
// Lerps a given set of values over time
//
export class Lerp {

    private currentTime: number = 0;
    private lerpValues: number[][] = [[0, 0]];

    private duration: number = 0;

    private lerpFunctions: { [key: string]: (initial: number, lerpDistance: number, duration: number, currentTime: number) => number } = {};
    private lerpIntervals: Intervals = new Intervals();

    private clientCallback: (results: number[], time: number) => void = null;

    private transition: Transition = Transition.EaseOut;
    private style: Style = Style.Quadratic;

    public constructor() {
        this.constructLerpFunctions();
    }

    //
    // Sets multiple values to be lerped over
    //
    public define(lerpValues: number[][], duration: number, transition: Transition = Transition.EaseOut, style: Style = Style.Quadratic) {

        this.lerpValues = lerpValues;

        this.duration = duration;
        this.currentTime = 0;

        this.transition = transition;
        this.style = style;

        this.clientCallback = null;
    }

    //
    // Lerps the given values
    //
    public lerp(clientCallback: (results: number[], time: number) => void) {

        // If duration is 0, we have nothing to do
        if (this.duration === 0) {
            return;
        }

        // If we're already lerping, don't bother
        if (this.clientCallback !== null) {
            return;
        }

        // Start our interval poll
        this.clientCallback = clientCallback;
        this.lerpIntervals.start((timeDelta: number) => {
            return this.intervalCallback(timeDelta);
        });
    }

    //
    // Pauses this current lerp
    //
    public pause(paused: boolean) {
        this.lerpIntervals.pause(paused);
    }

    //
    // Stops this current lerp
    //
    public stop(paused: boolean) {
        this.lerpIntervals.stop();
        this.clientCallback = null;
    }

    //
    // Interval callback to lerp our values
    //
    private intervalCallback(timeDelta: number): Continuation {

        // Don't bother if we don't have a client callback
        if (this.clientCallback === null) {
            return Continuation.Cancel;
        }

        // Increase our time
        this.currentTime += timeDelta;
        this.currentTime = Math.min(this.currentTime, this.duration);

        // Just lerp each element
        let lerpResults: (number)[] = [];
        for (let index = 0; index < this.lerpValues.length; ++index) {

            // Pull out this set of values
            let currentLerpValues = this.lerpValues[index];

            // Get the function we need to call
            let functionToCall = this.calculateLerpFunction();

            // Lerp the values
            let lerpDistance = currentLerpValues[1] - currentLerpValues[0];
            let lerpedValue = functionToCall(currentLerpValues[0], lerpDistance, this.duration, this.currentTime);

            // Add our result
            lerpResults.push(lerpedValue);
        }

        // Update our client
        let currentTime: number = this.currentTime / this.duration;
        this.clientCallback(lerpResults, currentTime);

        // Are we finished?
        let finished: boolean = (currentTime === 1);
        return finished === true ? Continuation.Cancel : Continuation.Continue;
    }

    //
    // Returns the lep function to call
    //
    private calculateLerpFunction(): (startValue: number, lerpDistance: number, duration: number, currentTime: number) => number {

        // Get the styles we are interested in using
        let transition: string = Transition[this.transition];
        let style: string = Style[this.style];

        // Build up the function name and get our function
        let functionName: string = 'lerpStyle' + transition + style;
        let functionToCall = this.lerpFunctions[functionName];

        // Send back our function
        return functionToCall;
    }

    //
    // Builds up the function map for the lerp functions
    // I'd like to do this a better way using reflection, but TypeScript seems to confuse that
    //
    private constructLerpFunctions() {

        // Quadratic

        // lerpStyleEaseOutQuadratic
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Quadratic]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseOutQuadratic(initial, lerpDistance, duration, currentTime);
            };

        // lerpStyleEaseInQuadratic
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Quadratic]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseInQuadratic(initial, lerpDistance, duration, currentTime);
            };

        // lerpStyleEaseInOutQuadratic
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Quadratic]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseInOutQuadratic(initial, lerpDistance, duration, currentTime);
            };

        // Linear

        // lerpStyleLinear
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Linear]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Linear]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Linear]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };

        // Sine

        // lerpStyleEaseOutSine
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Sine]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseOutSine(initial, lerpDistance, duration, currentTime);
            };

        // lerpStyleEaseInSine
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Sine]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseInSine(initial, lerpDistance, duration, currentTime);
            };

        // lerpStyleEaseInOutSine
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Sine]] =
            (initial: number, lerpDistance: number, duration: number, currentTime: number): number => {
                return this.lerpStyleEaseInOutSine(initial, lerpDistance, duration, currentTime);
            };

    }

    //
    // Linear lerp
    //
    private lerpStyleLinear(initial: number, lerpDistance: number, duration: number, currentTime: number): number {
        return ((lerpDistance * currentTime) / duration) + initial;

    }

    //
    // Quadratic easing out
    //
    private lerpStyleEaseOutQuadratic(initial: number, lerpDistance: number, duration: number, currentTime: number): number {

        currentTime /= duration;
        return -lerpDistance * currentTime * (currentTime - 2) + initial;
    }

    //
    // Quadratic easing in
    //
    private lerpStyleEaseInQuadratic(initial: number, lerpDistance: number, duration: number, currentTime: number): number {

        currentTime /= duration;
        return lerpDistance * currentTime * currentTime + initial;
    }

    //
    // Quadratic easing in/out
    //
    private lerpStyleEaseInOutQuadratic(initial: number, lerpDistance: number, duration: number, currentTime: number): number {

        currentTime /= duration / 2;
        if (currentTime < 1) {
            return (lerpDistance / 2) * currentTime * currentTime + initial;
        }

        currentTime--;
        return -lerpDistance / 2 * (currentTime * (currentTime - 2) - 1) + initial;
    }

    //
    // Sine easing out
    //
    private lerpStyleEaseOutSine(initial: number, lerpDistance: number, duration: number, currentTime: number): number {
        return lerpDistance * Math.sin(currentTime / duration * (Math.PI / 2)) + initial;
    }

    //
    // Sine easing in
    //
    private lerpStyleEaseInSine(initial: number, lerpDistance: number, duration: number, currentTime: number): number {
        return -lerpDistance * Math.cos(currentTime / duration * (Math.PI / 2)) + lerpDistance + initial;
    }

    //
    // Sine easing in/out
    //
    private lerpStyleEaseInOutSine(initial: number, lerpDistance: number, duration: number, currentTime: number): number {
        return -lerpDistance / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + initial;
    }
}
