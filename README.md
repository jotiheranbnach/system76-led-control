# system76-led-control
A simple Node.js script for controlling the keyboard LED lights on the System76 laptops.

## Supported Laptops
- **(tested)** Oryx Pro 16" & Oryx Pro 17"
- Adder WS 15"
- Serval WS 15" & Serval WS 17"

## Features
I put in some basic animations, but honestly they are there just for showcasing how
to do the job on your own. Currently there are 3 **modes** which you can use to
develop your own:
- `randomRgb` Changes up the colors of the 3 keyboard sections more or less
randomly by rotating a color wheel. This way the resulting colors feel
more... random.
- `redWave` Generates a slow paced red wave which will go from left to right.
- `uglyKnightRider` This one is a very basic and ugly interpretation of a knight
rider animation.

Feel free to use these to develop your own.

## Getting Started

These instructions will get you a copy of the project up and running on your local
machine for development and testing purposes.

### Prerequisites

The following things must be available on you machine. The versions displayed
below are the versions I used/use for developing and testing. You MAY try other
versions.

* Git - v2.7.4
* Node - v10.15.3
* NPM - v6.4.1

### Installing
(optional) If you want to get it up and running and are fine with the basic
modes I provided, you may install it globally and put in a cronjob to let it
start on boot like this:

```bash

```

To get it up and running for development:
1. First open you CLI and go into the folder where you want to put the project
(a folder will be created in the process). Then clone the repository:

    ```bash
    git clone https://github.com/jotiheranbnach/system76-led-control.git
    ```

2. Step into the cloned repository and install all node modules:

    ```bash
    cd system76-led-control
    npm install
    ```

3. Now simply run one of the prepared NPM scripts:
    ```bash
    npm run randomRgb
    ```
### Vendors

The following vendors were used and earned my respect:

- [Qix-](https://github.com/Qix-) / [**color**](https://github.com/Qix-/color) - For easier color handling. Great lib!
- [microsoft](https://github.com/microsoft) / [**TypeScript**](https://github.com/microsoft/TypeScript) - Because Typescript is ♥!

## Authors

* **Johann Tierbach** - [jotiheranbnach](https://github.com/jotiheranbnach)

## License

This project is unlicensed under the UNLICENCE Licence - see the [LICENSE.md](./LICENSE.md) file or
[here](https://unlicense.org) for details.

## Acknowledgements

* You. For reading through all this. You crazy Bastard!
