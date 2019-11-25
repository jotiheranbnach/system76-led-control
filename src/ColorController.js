var Color = require('color');
class ColorController {
    constructor() {
        this.fs = require('fs');
        this.h = Math.random();
    }
    setBrightness(level) {
        if (level > ColorController.MAX_BRIGHTNESS || level < ColorController.MIN_BRIGHTNESS) {
            throw new Error('Invalid brightness provided. Only values between 0 and 255 are allowed');
        }
        this.fs.writeFile('/sys/class/leds/system76::kbd_backlight/brightness', level, (err) => {
            if (err)
                console.log(err);
        });
    }
    setState(hexcolor, section) {
        let file;
        switch (section) {
            case ColorController.SECTION_LEFT:
                file = 'color_left';
                break;
            case ColorController.SECTION_CENTER:
                file = 'color_center';
                break;
            case ColorController.SECTION_RIGHT:
                file = 'color_right';
                break;
            default:
                throw Error('Unknown section provided');
        }
        this.fs.writeFile('/sys/class/leds/system76::kbd_backlight/' + file, hexcolor, (err) => {
            if (err)
                console.log(err);
        });
    }
    runRandomRgbAnimation() {
        let getRandomColor = () => {
            let golden_ratio_conjugate = 0.618033988749895;
            this.h += golden_ratio_conjugate;
            this.h %= 1;
            let hsl = Color.hsl(this.h * 360, 100, 50);
            let hex = hsl.hex();
            return hex.substr(1);
        };
        this.setState(getRandomColor(), ColorController.SECTION_LEFT);
        this.setState(getRandomColor(), ColorController.SECTION_CENTER);
        this.setState(getRandomColor(), ColorController.SECTION_RIGHT);
        setTimeout(() => {
            this.runRandomRgbAnimation();
        }, 1000);
    }
    runBlackPulseAnimation() {
        let config = {
            stepSize: 1,
            minBrightness: 0,
            maxBrightness: 50,
        };
        let pulse = (config, section, currentBrightness, isIncreasing) => {
            if (isIncreasing) {
                currentBrightness += config.stepSize;
            }
            else {
                currentBrightness -= config.stepSize;
            }
            let colorDelta = Color.hsl(360, 100, currentBrightness * 2 - config.maxBrightness);
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
        pulse(config, ColorController.SECTION_LEFT, 0, false);
        pulse(config, ColorController.SECTION_CENTER, 25, false);
        pulse(config, ColorController.SECTION_RIGHT, 50, true);
    }
    runKnightRider() {
        let eyePos = 0;
        let red = 'ff0000';
        let black = '000000';
        let swipe = (eyePos) => {
            let colorizeKeyboardSection = (eyePos) => {
                if (eyePos < 0 || eyePos > 3) {
                    throw new Error('Invalid eye position detected: ' + eyePos);
                }
                if (eyePos === 1 || eyePos === 3) {
                    this.setState(black, ColorController.SECTION_LEFT);
                    this.setState(red, ColorController.SECTION_CENTER);
                    this.setState(black, ColorController.SECTION_RIGHT);
                }
                if (eyePos === 0) {
                    this.setState(red, ColorController.SECTION_LEFT);
                    this.setState(black, ColorController.SECTION_CENTER);
                    this.setState(black, ColorController.SECTION_RIGHT);
                }
                if (eyePos === 2) {
                    this.setState(black, ColorController.SECTION_LEFT);
                    this.setState(black, ColorController.SECTION_CENTER);
                    this.setState(red, ColorController.SECTION_RIGHT);
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
ColorController.SECTION_LEFT = 'left';
ColorController.SECTION_CENTER = 'center';
ColorController.SECTION_RIGHT = 'right';
ColorController.MAX_BRIGHTNESS = 255;
ColorController.MIN_BRIGHTNESS = 0;
(() => {
    let cc = new ColorController();
    // Set the desired Brightness:
    cc.setBrightness(ColorController.MAX_BRIGHTNESS);
    // Run the Animation of your choice:
    cc.runRandomRgbAnimation();
    // cc.runBlackPulseAnimation();
    // cc.runKnightRider();
})();
//# sourceMappingURL=ColorController.js.map