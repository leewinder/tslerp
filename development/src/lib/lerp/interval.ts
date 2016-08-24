
// Continuation state for interval callbacks
export enum Continuation {
    Continue,
    Cancel,
}

//
// Updates intervals until complete and calls a callback when done
//
export class Intervals {

    // Private properties
    private setIntervalHandle: any = null;
    private setIntervalLastTime: number = 0;

    private paused: boolean = false;

    private clientCallbacks: ((timeDelat: number) => Continuation)[] = [];

    // Constants
    public static get DEFAULT_MILLISECOND_INTERVAL(): number { return 33; }

    //
    // Starts the interval
    //
    public start(clientCallback: (timeDelta: number) => Continuation) {

        // Add this to the list
        this.clientCallbacks.push(clientCallback);

        // If we have a valid interval, don't bother continuing as we're already running
        if (this.setIntervalHandle !== null) {
            return;
        }

        // Get the time and start
        this.setIntervalLastTime = (new Date()).getTime();
        this.setIntervalHandle = setInterval(() => this.setIntervalCallback(), Intervals.DEFAULT_MILLISECOND_INTERVAL);
    }

    //
    // Manually stops the interval
    //
    public stop() {

        // Clear the callbacks
        this.clientCallbacks = [];
        this.paused = false;

        // If we don't have an interval, we have nothing to do
        if (this.setIntervalHandle === null) {
            return;
        }

        // Simply stop the interval
        clearInterval(this.setIntervalHandle);
        this.setIntervalHandle = null;
    }

    //
    // Pauses the current interval
    //
    public pause(pause: boolean) {
        this.paused = pause;
    }

    //
    // Interval callback
    //
    private setIntervalCallback() {

        // If we don't have an interval handle, we cannot continue
        if (this.setIntervalHandle === null) {
            return;
        }

        // Before we get the callback, callculate the time difference
        let currentTime = (new Date()).getTime();
        let timeDelta = (currentTime - this.setIntervalLastTime) / 1000;

        // Only enable the callbacks if we're not paused
        if (this.paused === false) {

            // We need to make a deep copy of the callback lists
            // so clients can add intervals during a callback
            let currentCallbacks: ((timeDelat: number) => Continuation)[] = [];
            for (let i = 0; i < this.clientCallbacks.length; ++i) {
                currentCallbacks.push(this.clientCallbacks[i]);
            }

            // Trigger the clients callbacks
            for (let i = 0; i < currentCallbacks.length; i++) {

                let thisCallback = currentCallbacks[i];
                let continueWithInterval: Continuation = thisCallback(timeDelta);

                // Should we continue with this callback?
                if (continueWithInterval === Continuation.Cancel) {
                    let callbackIndex = this.clientCallbacks.indexOf(thisCallback);
                    if (callbackIndex !== -1) {
                        this.clientCallbacks.splice(callbackIndex, 1);
                    }
                }
            }
        }

        // Save our callback time
        this.setIntervalLastTime = currentTime;

        // Should we continue
        if (this.clientCallbacks.length === 0) {
            this.stop();
        }
    }

}
