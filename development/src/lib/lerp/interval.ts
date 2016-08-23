
//
// Updates intervals until complete and calls a callback when done
//
export class Intervals {

    // Private properties
    private setIntervalHandle: any = null;
    private setIntervalLastTime: number = 0;

    // Constants
    public static get DEFAULT_MILLISECOND_INTERVAL(): number { return 33; }

    //
    // Constructor
    //
    constructor(private clientCallback: (timeDelta: number) => boolean) {
    }

    //
    // Starts the interval
    //
    start() {

        // If we have a valid interval, don't bother
        if (this.setIntervalHandle !== null) {
            return;
        }

        // Get the time and start
        this.setIntervalLastTime = (new Date()).getTime();
        this.setIntervalHandle = setInterval(() => this.setIntervalCallback(), Intervals.DEFAULT_MILLISECOND_INTERVAL);
    }

    //
    // Interval callback
    //
    private setIntervalCallback() {

        // Before we get the callback, callculate the time difference
        let currentTime = (new Date()).getTime();
        let timeDelta = (currentTime - this.setIntervalLastTime) / 1000;

        // Trigger the clients callback
        let continueWithInterval: boolean = this.clientCallback(timeDelta);

        // Save our callback time
        this.setIntervalLastTime = currentTime;

        // Should we continue
        if (continueWithInterval === false) {
            clearInterval(this.setIntervalHandle);
            this.setIntervalHandle = null;
        }
    }

}
