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

## Dependencies
* [Typings](https://www.npmjs.com/package/typings): `npm install typings --global`

<br>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"tslerp": "^1.0.0"`
  
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
    this.tsLerp.define([ [0, 10], [30, 50] ], 10, TsLerpTransition.EaseOut, TsLerpStyle.Quadratic);
    
    ...
  }
  
  // Lerp callback containing the results of the current lerp process
  private lerpCallback(results: number[], time: number) {
    
    // Regardless of the type of style or transition used for the lerp, the 
    // time value of the callback will always increment in a linear manner.
  }
}
```

The following animations show the various transitions and styles available, samples over a 1 second period.  All animations were captured from [Easing Equations by Robert Penner](http://gizma.com/easing/)

#### Style: Linear 
Note that the `TsLerpTransition` option is ignored when choosing a Linear style
![linear](https://cloud.githubusercontent.com/assets/1649415/17978641/f5f3d798-6aee-11e6-8d2d-040a53da4185.gif)


#### Style: Quadratic

##### Transition: Ease In
![quad in](https://cloud.githubusercontent.com/assets/1649415/17978651/00925878-6aef-11e6-83b6-460f3345dcea.gif)

##### Transition: Ease Out
![quad out](https://cloud.githubusercontent.com/assets/1649415/17978671/0ab4d682-6aef-11e6-9c48-5b53e5f5bc11.gif)

##### Transition: Ease In and Out
![quad in out](https://cloud.githubusercontent.com/assets/1649415/17978662/0a220c44-6aef-11e6-8f76-1b6e15b05333.gif)


#### Style: Sine

##### Transition: Ease In
![sine in](https://cloud.githubusercontent.com/assets/1649415/17978667/0a38d7ee-6aef-11e6-9ea3-bbc5ba1aa77f.gif)

##### Transition: Ease Out
![sine out](https://cloud.githubusercontent.com/assets/1649415/17978661/0a1f0e36-6aef-11e6-96ad-ae37de012819.gif)

##### Transition: Ease In and Out
![sine in out](https://cloud.githubusercontent.com/assets/1649415/17978663/0a36254e-6aef-11e6-9900-7eb5a9a5f719.gif)


#### Cubic

##### Transition: Ease In
![cube in](https://cloud.githubusercontent.com/assets/1649415/17978670/0ab2c3f6-6aef-11e6-8f61-e52941f48e3f.gif)

##### Transition: Ease Out
![cube out](https://cloud.githubusercontent.com/assets/1649415/17978665/0a37633c-6aef-11e6-9332-9db612a244a5.gif)

##### Transition: Ease In and Out
![cube in out](https://cloud.githubusercontent.com/assets/1649415/17978668/0a391d94-6aef-11e6-9b4a-bf2b0e7cb6b8.gif)


#### Style: Exponential

##### Transition: Ease In
![expo in](https://cloud.githubusercontent.com/assets/1649415/17978666/0a3892b6-6aef-11e6-99a8-d6338eedd973.gif)

##### Transition: Ease Out
![expo out](https://cloud.githubusercontent.com/assets/1649415/17978664/0a3625f8-6aef-11e6-93c6-d5773e402975.gif)

##### Transition: Ease In and Out
![expo in out](https://cloud.githubusercontent.com/assets/1649415/17978669/0a4a4196-6aef-11e6-8c3e-d21d8ae7034a.gif)


<br>

## Change Log

### 1.0.4
* Documentation update stating Typings as a Dependency

### 1.0.3
* Updated package requirements to Typescript ^2.0.0 plus related package upgrades

### 1.0.2
* Minor readme updates

### 1.0.1
* Updated correct acknowledgment for [Easing Equations by Robert Penner](http://gizma.com/easing/)

### 1.0.0
* Added support for Linear, Sine, Cubic and Exponential styles
* Added support for Ease In, Out and In/Out transitions for all styles

### 0.0.1
* Initial release
* Support for Ease In Quadratic lerps only
