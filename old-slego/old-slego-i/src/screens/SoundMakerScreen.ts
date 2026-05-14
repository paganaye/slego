import { App } from "../controls/App";
import { PagedScreen } from "./PagedScreen";
import { IScreen } from "../core/IScreen";
import { IPlasma } from "./Plasma";
import { Fonts } from "../Fonts";
import { NumericInput } from "../controls/NumericInput";
import { SoundEffectPlayer } from "../core/SoundEffect";
import { Button } from "../controls/Button";
import { IDiv } from "../core/FlowLayout";
import { Colors } from "../core/Colors";

export class SoundMakerScreen extends PagedScreen implements IScreen {
  musicOn: boolean = true;
  soundOn: boolean = true;
  plasma: IPlasma = {} as IPlasma;
  soundEffect: Record<string, number> = {
    "wave_type": 0,
    "p_env_attack": 0,
    "p_env_sustain": 0.6184924751775533,
    "p_env_punch": 0.8223940169492174,
    "p_env_decay": 0.2715133710175884,
    "p_base_freq": 0.2723171360931539,
    "p_freq_limit": 0,
    "p_freq_ramp": 0,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0.7454,
    "p_arp_speed": 0.40264087535999904,
    "p_duty": 0.8807309088068096,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0.5215736659909593,
    "p_lpf_resonance": 0.1682286945422451,
    "p_hpf_freq": 0,
    "p_hpf_ramp": 0,
    "sound_vol": 0.15,
    "sample_rate": 44100,
    "sample_size": 8
  }
  soundEffectPlayer?: SoundEffectPlayer;

  updateSound() {
    if (this.soundEffectPlayer) this.soundEffectPlayer.stop();
    this.soundEffectPlayer = new SoundEffectPlayer(this.soundEffect)
    this.soundEffectPlayer.play()
    return true;
  }


  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true });
    //this._flowLayout.setColumnCount(3);
    //this.leftMargin = 1;
    //this.rightMargin = 1;
    let screen = this;


    function soundProperty(name: string, text: string, maxValue: number = 1, steps?: number): IDiv {
      steps = (maxValue > 1) ? maxValue : 10;
      let value = screen.soundEffect[name];
      let initialValue = Math.round(value * steps); // Math.floor(multiplier * maxValue);
      screen.soundEffect[name] = value;
      return {
        spans: [
          { text, font: Fonts.defaultFont },
          {
            layer: new NumericInput(screen, {
              silent: true, initialRect: { x: 0, y: 20 }, maxValue: steps, initialValue, changeValue: (v: number) => {
                screen.soundEffect[name] = v / steps! * maxValue;
                return screen.updateSound()
              }
            }), alignRight: true
          }
        ]
      };
    }

    function addSoundProperty(name: string, text: string, maxValue: number = 1, steps?: number) {
      screen.addSection(soundProperty(name, text, maxValue, steps));
    }

    function section(text: string, parts: IDiv[]) {
      screen.addSection({ spans: [{ text, color: Colors.blue, font: Fonts.font10bold }] }, ...parts)
    }

    screen.addDiv(
      {
        layer: new Button(screen, "Play", {
          silent: true, initialRect: { x: 0, y: 20 }, onClick: () => {
            this.updateSound();
          }
        })
      });

    addSoundProperty("wave_type", "wave", 3)

    section("Envelope", [
      soundProperty("p_env_attack", "attack", 1),
      soundProperty("p_env_sustain", "sustain", 1),
      soundProperty("p_env_punch", "punch", 1),
      soundProperty("p_env_decay", "decay", 1)]);

    section("Frequency", [
      soundProperty("p_base_freq", "freq", 1),
      soundProperty("p_freq_limit", "limit", 1),
      soundProperty("p_freq_ramp", "ramp", 1),
      soundProperty("p_freq_dramp", "dramp", 1)]);

    section("Vibrato", [
      soundProperty("p_vib_strength", "strength", 4),
      soundProperty("p_vib_speed", "speed", 1)]);

    section("Arpeggiato", [
      soundProperty("p_arp_mod", "mod", 1),
      soundProperty("p_arp_speed", "speed", 1)]);

    section("Duty Cyble", [
      soundProperty("p_duty", "duty", 1),
      soundProperty("p_duty_ramp", "ramp", 1)]);

    section("Retrigger", [
      soundProperty("p_repeat_speed", "speed", 1)]);

    section("Flanger", [
      soundProperty("p_pha_offset", "offset", 1),
      soundProperty("p_pha_ramp", "ramp", 1)]);

    section("Low pass", [
      soundProperty("p_lpf_freq", "freq", 1),
      soundProperty("p_lpf_ramp", "ramp", 1),
      soundProperty("p_lpf_resonance", "resonance", 1)]);

    section("High pass", [
      soundProperty("p_hpf_freq", "freq", 1),
      soundProperty("p_hpf_ramp", "ramp", 1)]);
    section("Volume", [
      soundProperty("sound_vol", "vol", 1)]);
  }

  getTitle(): string {
    return "Sound maker";
  }
}
