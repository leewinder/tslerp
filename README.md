# tslerp

Typescript library for lerping single and multi-sample data sets over time across a variety of styles and transitions.

## Build Status

[![npm version](https://badge.fury.io/js/tslerp.svg)](https://badge.fury.io/js/tslerp)

**Master Branch**

[![Build Status](https://travis-ci.org/leewinder/tslerp.svg?branch=master)](https://travis-ci.org/leewinder/tslerp) 
[![Dependency Status](https://dependencyci.com/github/leewinder/tslerp/badge)](https://dependencyci.com/github/leewinder/tslerp)

**Develop Branch**

[![Build Status](https://travis-ci.org/leewinder/tslerp.svg?branch=develop)](https://travis-ci.org/leewinder/tslerp) 

<br>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"tslerp": "^0.0.1"`
  
  Optionally, you can manually install the package using the npm command line

  `npm install tslerp --save`
  
2. Add tslerp to both your `map` and `packages` structures in `systemjs.config.js`

  ```javascript
  var map = {
    ...
    'tslerp': 'node_modules/tslerp'
  };
  ```
  
  ```javascript
  var packages = {
    ...
    'tslerp': { main: 'index.js', defaultExtension: 'js' },
  };
  ```
  
3. Optionally, add the `rootDir` option to `tsconfig.json` to make sure TypeScript's default root path algorithm doesn't pull in the `node_modules` folder

<br>

## Usage

Examples of using tslerp can also be found in the tslerp test packages in [lerp.spec.ts](https://github.com/leewinder/tslerp/blob/master/development/src/tests/lerp/lerp.spec.ts)

### Triggering a simple lerp

```TypeScript
// Import the lerp class from tslerp
import { TsLerp } from 'tslerp';

class ClassToLerpSomething {

  // Define our lerp object
  private tsLerp: TsLerp = new TsLerp();

  // Starts a transition using TsLerp
  public startTransition() {
    
    // Define the properties of the lerp, this can contain a single set of
    // points to lerp between, or multiple data points
    
    // The format of the function is define([ [start, end], ...], duration);
    // The following defines two data sets, one to lerp between 0 and 10, and one
    // to lerp between 30 and 50.  Both sets will take 10 seconds to complete
    this.tsLerp.define([ [0, 10], [30, 50] ], 10);
    
    // Trigger the lerp, providing a callback that will be called constantly
    // as the lerp progresses from start to finish
    
    // This callback will be called every 33 milliseconds providing a constent
    // 30 FPS on stable systems.  For none stable systems, the transition is
    // framerate independent to will always take the defined amount of time to finish
    this.tsLerp.lerp((results: number[], time: number) => {
      this.lerpCallback(results, time);
    });
  }
  
  // Function called from TsLerp.lerp every 33 milliseconds
  private lerpCallback(results: number[], time: number) {
  
    // This callback is passed
    // - results: An array of values containing the current lerp values of the data
    //            sets passed through in TsLerp.define.  The order of the results
    //            is guarenteed to be the same order as originally defined.
    // - time:    The current passage of time in the range [0..1].  When time is 
    //            1, the lerp has completed and the callback will cease to be called.
  }
}
```

### Chaining lerp sequences

```TypeScript
// Import the lerp class from tslerp
import { TsLerp } from 'tslerp';

class ClassToLerpSomething {

  ...
  
  // Lerp callback containing the results of the current lerp process
  private lerpCallback(results: number[], time: number) {
  
    // It is perfectly acceptable to request an a new set of lerp values
    // during a current lerp.  In the following example, when the first
    // set of lerp values has completed, a sequential set of lerp values
    // is initiated.
    
    // Note that calling TsLerp.define will reset the current lerp values
    // which means triggering a new set of lerp points in the middle of
    // a current lerp sequence may result in unwanted results.
    
    // Call this when the current lerp has finished
    if (time === 1) {
    
      // Define a lerp between [10..100] over 5 seconds
      this.tsLerp.define([ [10, 100] ], 5);
      
      // We can use the same callback or a different callback depending on
      // the expected results.  Note in this case, we're creating an infinite
      // loop of lerp events, something you probably don't want to do...
      this.tsLerp.lerp((results: number[], time: number) => {
        this.lerpCallback(results, time);
      });
    }
  }
}
```

### Styling a lerp transition
`TsLerp.define` allows you to specify the kind of transition and style the lerp will travel.

```TypeScript
// Import the lerp types from tslerp
import { TsLerp, TsLerpTransition, TsLerpStyle } from 'tslerp';

class ClassToLerpSomething {

  ...

  // Starts a transition using TsLerp
  public startTransition() {
    
    // Define a lerp that eases out of the transition using a quadratic path
    this.tsLerp.define([ [0, 10], [30, 50] ], 10, Transition.EaseOut, Style.Quadratic);
    
    ...
  }
  
  // Lerp callback containing the results of the current lerp process
  private lerpCallback(results: number[], time: number) {
    
    // Regardless of the type of style or transition used for the lerp, the 
    // time value of the callback will always increment in a linear manner.
  }
}
```

Given that this library is in it's infancy only the following styles are currently supported
- Transitions
  - EaseOut

- Style
  - Quadratic

### Controlling an in-progress lerp
It is possible to pause or delay an in-progress lerp in response to external events

```TypeScript
// Import the lerp class from tslerp
import { TsLerp } from 'tslerp';

class ClassToLerpSomething {

  ...
  
  // Generic event indicating the page or animation needs to pause
  private onSomeEventToPause() {
    
    // You can call TsLerp.pause to stop the current transition
    // This will stop the lerp from progressing and stop all calls
    // to the user provided callback in TsLerp.lerp.
    this.tsLerp.pause(true);
    
    ...
  }
  
  // Generic event indicating the page or animation can continue
  private onSomeEventToResume() {
    
    // You can call TsLerp.pause to resume the current transition
    // This will start the progression of the lerp again and resume 
    // calls to the user provided callback in TsLerp.lerp.
    this.tsLerp.pause(false);
    
    ...
  }
  
  // Generic event indicating the transition needs to terminate
  private onSomeEventToStop() {
    
    // You can call TsLerp.stop to cancel the current lerp and
    // stop all calls to the user defined callback in tsLerp.lerp
    this.tsLerp.stop()
    
    ...
  }
}
```



