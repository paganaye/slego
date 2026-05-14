// This is directly derived from https://sfxr.me/
// Jsfxr is an (opensource) online 8 bit sound maker and sfx generator. 

import { App } from "../controls/App";

// 
const enum WaveShape {
  SQUARE = 0,
  SAWTOOTH = 1,
  SINE = 2,
  NOISE = 3
}
// Playback volume
var masterVolume = 1;

var OVERSAMPLING = 8;

/*** Core data structure ***/

// Sound generation parameters are on [0,1] unless noted SIGNED & thus
// on [-1,1]
export interface ISoundEffect {
  // Wave shape
  wave_type?: WaveShape;

  // Envelope
  p_env_attack?: number;   // Attack time
  p_env_sustain?: number;  // Sustain time
  p_env_punch?: number;    // Sustain punch
  p_env_decay?: number;    // Decay time

  // Tone
  p_base_freq?: number;    // Start frequency
  p_freq_limit?: number;   // Min frequency cutoff
  p_freq_ramp?: number;    // Slide (SIGNED)
  p_freq_dramp?: number;   // Delta slide (SIGNED)
  // Vibrato
  p_vib_strength?: number; // Vibrato depth
  p_vib_speed?: number;    // Vibrato speed
  p_vib_delay?: number | null;

  // Tonal change
  p_arp_mod?: number;      // Change amount (SIGNED)
  p_arp_speed?: number;    // Change speed

  // Square wave duty (proportion of time signal is high vs. low)
  p_duty?: number;         // Square duty
  p_duty_ramp?: number;    // Duty sweep (SIGNED)

  // Repeat
  p_repeat_speed?: number; // Repeat speed

  // Flanger
  p_pha_offset?: number;   // Flanger offset (SIGNED)
  p_pha_ramp?: number;     // Flanger sweep (SIGNED)

  // Low-pass filter
  p_lpf_freq?: number;     // Low-pass filter cutoff
  p_lpf_ramp?: number;     // Low-pass filter cutoff sweep (SIGNED)
  p_lpf_resonance?: number;// Low-pass filter resonance
  // High-pass filter
  p_hpf_freq?: number;     // High-pass filter cutoff
  p_hpf_ramp?: number;     // High-pass filter cutoff sweep (SIGNED)

  // Sample parameters
  sound_vol?: number;
  sample_rate?: number;
  sample_size?: number;
}

/*** Helper functions ***/



/*** Main entry point ***/
class SoundEffect implements ISoundEffect {

  wave_type: WaveShape;
  arpeggioMultiplier: number = 0;
  arpeggioTime: number = 0;
  dutyCycle: number = 0;
  dutyCycleSlide: number = 0;
  elapsedSinceRepeat: number = 0;
  enableFrequencyCutoff: boolean = false;
  enableLowPassFilter: boolean;
  envelopeLength: number[];
  flangerOffset: number;
  flangerOffsetSlide: number;
  fltdmp: number;
  flthp_d: number;
  flthp: number;
  fltw_d: number;
  fltw: number;
  p_arp_mod: number;
  p_arp_speed: number;
  p_base_freq: number;
  p_duty_ramp: number;
  p_duty: number;
  p_env_attack: number;
  p_env_decay: number;
  p_env_punch: number;
  p_env_sustain: number;
  p_freq_dramp: number;
  p_freq_limit: number;
  p_freq_ramp: number;
  p_hpf_freq: number;
  p_hpf_ramp: number;
  p_lpf_freq: number;
  p_lpf_ramp: number;
  p_lpf_resonance: number;
  p_pha_offset: number;
  p_pha_ramp: number;
  p_repeat_speed: number;
  p_vib_delay?: number | null;
  p_vib_speed: number;
  p_vib_strength: number;
  period: number = 0;
  periodMax: number = 0;
  periodMult: number = 0;
  periodMultSlide: number = 0;
  repeatTime: number;
  sample_rate: number;
  sample_size: number;
  sampleRate: number = 0;
  sound_vol: number;
  vibratoAmplitude: number;
  vibratoSpeed: number;

  constructor(ps: Partial<ISoundEffect>) {
    // Wave shape
    this.wave_type = ps.wave_type ?? WaveShape.SQUARE;

    this.p_arp_mod = ps.p_arp_mod ?? 0;      // Change amount (SIGNED)
    this.p_arp_speed = ps.p_arp_speed ?? 0;    // Change speed
    this.p_base_freq = ps.p_base_freq ?? 0.3;    // Start frequency
    this.p_duty = ps.p_duty ?? 0;         // Square duty
    this.p_duty_ramp = ps.p_duty_ramp ?? 0;    // Duty sweep (SIGNED)
    this.p_env_attack = ps.p_env_attack ?? 0;   // Attack time
    this.p_env_decay = ps.p_env_decay ?? 0.4;    // Decay time
    this.p_env_punch = ps.p_env_punch ?? 0;    // Sustain punch
    this.p_env_sustain = ps.p_env_sustain ?? 0.3;  // Sustain time
    this.p_freq_dramp = ps.p_freq_dramp ?? 0;   // Delta slide (SIGNED)
    this.p_freq_limit = ps.p_freq_limit ?? 0;   // Min frequency cutoff
    this.p_freq_ramp = ps.p_freq_ramp ?? 0;    // Slide (SIGNED)
    this.p_hpf_freq = ps.p_hpf_freq ?? 0;     // High-pass filter cutoff
    this.p_hpf_ramp = ps.p_hpf_ramp ?? 0;     // High-pass filter cutoff sweep (SIGNED)
    this.p_lpf_freq = ps.p_lpf_freq ?? 1;     // Low-pass filter cutoff
    this.p_lpf_ramp = ps.p_lpf_ramp ?? 0;     // Low-pass filter cutoff sweep (SIGNED)
    this.p_lpf_resonance = ps.p_lpf_resonance ?? 0;// Low-pass filter resonance
    this.p_pha_offset = ps.p_pha_offset ?? 0;   // Flanger offset (SIGNED)
    this.p_pha_ramp = ps.p_pha_ramp ?? 0;     // Flanger sweep (SIGNED)
    this.p_repeat_speed = ps.p_repeat_speed ?? 0; // Repeat speed
    this.p_vib_speed = ps.p_vib_speed ?? 0;    // Vibrato speed
    this.p_vib_strength = ps.p_vib_strength ?? 0; // Vibrato depth
    this.sample_rate = ps.sample_rate ?? 44100;
    this.sample_size = ps.sample_size ?? 8;
    this.sound_vol = ps.sound_vol ?? 0.5;
    this.sampleRate = 44100;
    this.initForRepeat();  // First time through, this is a bit of a misnomer


    // Filter
    this.fltw = Math.pow(this.p_lpf_freq, 3) * 0.1;
    this.enableLowPassFilter = (this.p_lpf_freq != 1);
    this.fltw_d = 1 + this.p_lpf_ramp * 0.0001;
    this.fltdmp = 5 / (1 + Math.pow(this.p_lpf_resonance, 2) * 20) *
      (0.01 + this.fltw);
    if (this.fltdmp > 0.8) this.fltdmp = 0.8;
    this.flthp = Math.pow(this.p_hpf_freq, 2) * 0.1;
    this.flthp_d = 1 + this.p_hpf_ramp * 0.0003;

    // Vibrato
    this.vibratoSpeed = Math.pow(this.p_vib_speed, 2) * 0.01;
    this.vibratoAmplitude = this.p_vib_strength * 0.5;

    // Envelope
    this.envelopeLength = [
      Math.floor(this.p_env_attack * this.p_env_attack * 100000),
      Math.floor(this.p_env_sustain * this.p_env_sustain * 100000),
      Math.floor(this.p_env_decay * this.p_env_decay * 100000)
    ];

    // Flanger
    this.flangerOffset = Math.pow(this.p_pha_offset, 2) * 1020;
    if (this.p_pha_offset < 0) this.flangerOffset = -this.flangerOffset;
    this.flangerOffsetSlide = Math.pow(this.p_pha_ramp, 2) * 1;
    if (this.p_pha_ramp < 0) this.flangerOffsetSlide = -this.flangerOffsetSlide;

    // Repeat
    this.repeatTime = Math.floor(Math.pow(1 - this.p_repeat_speed, 2) * 20000
      + 32);
    if (this.p_repeat_speed === 0)
      this.repeatTime = 0;

  }


  initForRepeat() {
    this.elapsedSinceRepeat = 0;

    this.period = 100 / (this.p_base_freq * this.p_base_freq + 0.001);
    this.periodMax = 100 / (this.p_freq_limit * this.p_freq_limit + 0.001);
    this.enableFrequencyCutoff = (this.p_freq_limit > 0);
    this.periodMult = 1 - Math.pow(this.p_freq_ramp, 3) * 0.01;
    this.periodMultSlide = -Math.pow(this.p_freq_dramp, 3) * 0.000001;

    this.dutyCycle = 0.5 - this.p_duty * 0.5;
    this.dutyCycleSlide = -this.p_duty_ramp * 0.00005;

    if (this.p_arp_mod >= 0)
      this.arpeggioMultiplier = 1 - Math.pow(this.p_arp_mod, 2) * .9;
    else
      this.arpeggioMultiplier = 1 + Math.pow(this.p_arp_mod, 2) * 10;
    this.arpeggioTime = Math.floor(Math.pow(1 - this.p_arp_speed, 2) * 20000 + 32);
    if (this.p_arp_speed === 1)
      this.arpeggioTime = 0;
  }

  getAsFloat32Array(): Float32Array {
    var fltp = 0;
    var fltdp = 0;
    var fltphp = 0;

    var noise_buffer = Array(32);
    for (var i = 0; i < 32; ++i)
      noise_buffer[i] = Math.random() * 2 - 1;

    var envelopeStage = 0;
    var envelopeElapsed = 0;

    var vibratoPhase = 0;

    var phase = 0;
    var ipp = 0;
    var flanger_buffer = Array(1024);
    for (var i = 0; i < 1024; ++i)
      flanger_buffer[i] = 0;

    var normalized = [];

    var sample_sum = 0;
    var num_summed = 0;
    var summands = Math.floor(44100 / this.sampleRate);
    for (let t = 0; ; ++t) {

      // Repeats
      if (this.repeatTime != 0 && ++this.elapsedSinceRepeat >= this.repeatTime)
        this.initForRepeat();

      // Arpeggio (single)
      if (this.arpeggioTime != 0 && t >= this.arpeggioTime) {
        this.arpeggioTime = 0;
        this.period *= this.arpeggioMultiplier;
      }

      // Frequency slide, and frequency slide slide!
      this.periodMult += this.periodMultSlide;
      this.period *= this.periodMult;
      if (this.period > this.periodMax) {
        this.period = this.periodMax;
        if (this.enableFrequencyCutoff)
          break;
      }

      // Vibrato
      var rfperiod = this.period;
      if (this.vibratoAmplitude > 0) {
        vibratoPhase += this.vibratoSpeed;
        rfperiod = this.period * (1 + Math.sin(vibratoPhase) * this.vibratoAmplitude);
      }
      var iperiod = Math.floor(rfperiod);
      if (iperiod < OVERSAMPLING) iperiod = OVERSAMPLING;

      // Square wave duty cycle
      this.dutyCycle += this.dutyCycleSlide;
      if (this.dutyCycle < 0) this.dutyCycle = 0;
      if (this.dutyCycle > 0.5) this.dutyCycle = 0.5;

      // Volume envelope
      if (++envelopeElapsed > this.envelopeLength[envelopeStage]) {
        envelopeElapsed = 0;
        if (++envelopeStage > 2)
          break;
      }
      var env_vol;
      var envf = envelopeElapsed / this.envelopeLength[envelopeStage];
      if (envelopeStage === 0) {         // Attack
        env_vol = envf;
      } else if (envelopeStage === 1) {  // Sustain
        env_vol = 1 + (1 - envf) * 2 * this.p_env_punch;
      } else {                           // Decay
        env_vol = 1 - envf;
      }

      // Flanger step
      this.flangerOffset += this.flangerOffsetSlide;
      var iphase = Math.abs(Math.floor(this.flangerOffset));
      if (iphase > 1023) iphase = 1023;

      if (this.flthp_d != 0) {
        this.flthp *= this.flthp_d;
        if (this.flthp < 0.00001)
          this.flthp = 0.00001;
        if (this.flthp > 0.1)
          this.flthp = 0.1;
      }

      // 8x oversampling
      var sample = 0;
      for (var si = 0; si < OVERSAMPLING; ++si) {
        var sub_sample = 0;
        phase++;
        if (phase >= iperiod) {
          phase %= iperiod;
          if (this.wave_type === WaveShape.NOISE)
            for (var i = 0; i < 32; ++i)
              noise_buffer[i] = Math.random() * 2 - 1;
        }

        // Base waveform
        var fp = phase / iperiod;
        if (this.wave_type === WaveShape.SQUARE) {
          if (fp < this.dutyCycle)
            sub_sample = 0.5;
          else
            sub_sample = -0.5;
        } else if (this.wave_type === WaveShape.SAWTOOTH) {
          if (fp < this.dutyCycle)
            sub_sample = -1 + 2 * fp / this.dutyCycle;
          else
            sub_sample = 1 - 2 * (fp - this.dutyCycle) / (1 - this.dutyCycle);
        } else if (this.wave_type === WaveShape.SINE) {
          sub_sample = Math.sin(fp * 2 * Math.PI);
        } else if (this.wave_type === WaveShape.NOISE) {
          sub_sample = noise_buffer[Math.floor(phase * 32 / iperiod)];
        }

        // Low-pass filter
        var pp = fltp;
        this.fltw *= this.fltw_d;
        if (this.fltw < 0) this.fltw = 0;
        if (this.fltw > 0.1) this.fltw = 0.1;
        if (this.enableLowPassFilter) {
          fltdp += (sub_sample - fltp) * this.fltw;
          fltdp -= fltdp * this.fltdmp;
        } else {
          fltp = sub_sample;
          fltdp = 0;
        }
        fltp += fltdp;

        // High-pass filter
        fltphp += fltp - pp;
        fltphp -= fltphp * this.flthp;
        sub_sample = fltphp;

        // Flanger
        flanger_buffer[ipp & 1023] = sub_sample;
        sub_sample += flanger_buffer[(ipp - iphase + 1024) & 1023];
        ipp = (ipp + 1) & 1023;

        // final accumulation and envelope application
        sample += sub_sample * env_vol;
      }

      // Accumulate samples appropriately for sample rate
      sample_sum += sample;
      if (++num_summed >= summands) {
        num_summed = 0;
        sample = sample_sum / summands;
        sample_sum = 0;
      } else {
        continue;
      }

      sample = sample / OVERSAMPLING * masterVolume;

      // store the original normalized floating point sample
      normalized.push(sample);

    }
    return new Float32Array(normalized);
  }

}

export class SoundEffectPlayer {
  soundEffect: SoundEffect;
  playing: number = 0;
  currentlyPlayingSource: AudioBufferSourceNode | null = null;
  audioBuffer?: AudioBuffer

  constructor(ps: Partial<ISoundEffect>) {
    this.soundEffect = new SoundEffect(ps)
  }

  static audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  static soundVolume = 1;

  play(volume: number = SoundEffectPlayer.soundVolume) {
    if (!App.instance.sound) return
    if (!this.audioBuffer) {
      let float32Array = this.soundEffect.getAsFloat32Array();
      if (float32Array.length == 0) return
      this.audioBuffer = SoundEffectPlayer.audioContext.createBuffer(1, float32Array.length, SoundEffectPlayer.audioContext.sampleRate);
      this.audioBuffer.copyToChannel(float32Array, 0);
    }
    const source = SoundEffectPlayer.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    const gainNode = SoundEffectPlayer.audioContext.createGain();
    gainNode.gain.value = volume * (Math.exp(this.soundEffect.sound_vol) - 1);

    source.connect(gainNode);
    gainNode.connect(SoundEffectPlayer.audioContext.destination);
    this.playing += 1;

    this.currentlyPlayingSource = source;
    source.addEventListener('ended', () => {
      this.currentlyPlayingSource = null;
      this.playing -= 1;
    }, { once: true });
    source.start();
  }

  stop() {
    if (this.currentlyPlayingSource) this.currentlyPlayingSource.stop()
  }
}
