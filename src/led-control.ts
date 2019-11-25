var Color = require('color');

class LedControl {
    static SECTION_LEFT = 'left';
    static SECTION_CENTER = 'center';
    static SECTION_RIGHT = 'right';

    static MAX_BRIGHTNESS = 255;
    static MIN_BRIGHTNESS = 0;

    private fs = require('fs');
    private h: number = Math.random();

    setBrightness(level: number) {
        if (level > LedControl.MAX_BRIGHTNESS || level < LedControl.MIN_BRIGHTNESS) {
            throw new Error('Invalid brightness provided. Only values between 0 and 255 are allowed');
        }

        this.fs.writeFile('/sys/class/leds/system76::kbd_backlight/brightness', level, (err) => {
            if (err) console.log(err);
        });
    }

    setState(hexcolor: string, section: string) {
        let file: string;
        switch (section) {
            case LedControl.SECTION_LEFT:
                file = 'color_left';
                break;
            case LedControl.SECTION_CENTER:
                file = 'color_center';
                break;
            case LedControl.SECTION_RIGHT:
                file = 'color_right';
                break;
            default:
                throw Error('Unknown section provided');
        }

        this.fs.writeFile('/sys/class/leds/system76::kbd_backlight/' + file, hexcolor, (err) => {
            if (err) console.log(err);
        });
    }

    runRandomRgbAnimation() {
        let getRandomColor = (): string => {
            let golden_ratio_conjugate = 0.618033988749895;
            this.h += golden_ratio_conjugate;
            this.h %= 1;
            let hsl = Color.hsl(this.h * 360, 100, 50);
            let hex = hsl.hex();
            return hex.substr(1);
        };

        this.setState(getRandomColor(), LedControl.SECTION_LEFT);
        this.setState(getRandomColor(), LedControl.SECTION_CENTER);
        this.setState(getRandomColor(), LedControl.SECTION_RIGHT);

        setTimeout(() => {
            this.runRandomRgbAnimation();
        }, 1000);
    }

    runRedWaveAnimation() {
        let config = {
            stepSize: 1,
            minBrightness: 0,
            maxBrightness: 50,
        };

        let pulse = (config: any, section: string, currentBrightness: number, isIncreasing: boolean) => {
            if (isIncreasing) {
                currentBrightness += config.stepSize
            } else {
                currentBrightness -= config.stepSize
            }
            let colorDelta: any = Color.hsl(360, 100, currentBrightness * 2 - config.maxBrightness);

            if (currentBrightness >= config.maxBrightness) {
                isIncreasing = false;
                currentBrightness = config.maxBrightness;
            }

            if (currentBrightness <= config.minBrightness) {
                isIncreasing = true;
                currentBrightness = config.minBrightness;
            }
            this.setState(colorDelta.hex().substr(1), section);
            setTimeout(() => {
                pulse(config, section, currentBrightness, isIncreasing);
            }, 80);
        };

        pulse(config, LedControl.SECTION_LEFT, 0, false);
        pulse(config, LedControl.SECTION_CENTER, 25, false);
        pulse(config, LedControl.SECTION_RIGHT, 50, true);
    }

    runUglyKnightRider() {
        let eyePos: number = 0;
        let red: string = 'ff0000';
        let black: string = '000000';

        let swipe = (eyePos: number) => {
            let colorizeKeyboardSection = (eyePos: number): void => {
                if (eyePos < 0 || eyePos > 3) {
                    throw new Error('Invalid eye position detected: ' + eyePos);
                }
                if (eyePos === 1 || eyePos === 3) {
                    this.setState(black, LedControl.SECTION_LEFT);
                    this.setState(red, LedControl.SECTION_CENTER);
                    this.setState(black, LedControl.SECTION_RIGHT);
                }
                if (eyePos === 0) {
                    this.setState(red, LedControl.SECTION_LEFT);
                    this.setState(black, LedControl.SECTION_CENTER);
                    this.setState(black, LedControl.SECTION_RIGHT);
                }
                if (eyePos === 2) {
                    this.setState(black, LedControl.SECTION_LEFT);
                    this.setState(black, LedControl.SECTION_CENTER);
                    this.setState(red, LedControl.SECTION_RIGHT);
                }
            };

            colorizeKeyboardSection(eyePos);

            switch (eyePos) {
                case 0:
                    eyePos++;
                    break;
                case 1:
                    eyePos++;
                    break;
                case 2:
                    eyePos++;
                    break;
                case 3:
                    eyePos = 0;
                    break;
            }

            setTimeout(() => {
                swipe(eyePos);
            }, 500);
        };

        swipe(eyePos);
    }
}

(() => {
    // Parse mode
    const args = process.argv.slice(2);

    if (args.length !== 1) {
        throw new Error('No mode parameter provided.');
    }

    let lc = new LedControl();

    // Set the desired Brightness:
    lc.setBrightness(LedControl.MAX_BRIGHTNESS);

    switch (args[0]) {
        case 'randomRgb':
            lc.runRandomRgbAnimation();
            break;
        case 'blackPulse':
            lc.runRedWaveAnimation();
            break;
        case 'uglyKnightRider':
            lc.runUglyKnightRider();
            break;
        default:
            throw new Error('Unknown mode parameter provided.');
    }
})();
