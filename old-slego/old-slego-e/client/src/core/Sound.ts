import { mapObject } from "./Types";
import { SoundEffectPlayer, ISoundEffect } from "./SoundEffect";

declare var beepbox: any;

function makeLineMadeSound(count: number) {
  let freq = 0.1 + count * 0.1
  return {
    "wave_type": 1,
    "p_env_attack": 0,
    "p_env_sustain": 0.38701134227782774,
    "p_env_punch": 0,
    "p_env_decay": 0.47819100390306646,
    "p_base_freq": freq,
    "p_freq_limit": 0,
    "p_freq_ramp": 0.44238243150781564,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 1,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0.48499070682397616,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0,
    "p_hpf_ramp": 0,
    "sound_vol": 0.25,
    "sample_rate": 44100,
    "sample_size": 8
  }
}

export const Sounds = mapObject({
  explosion: {
    "wave_type": 3,
    "p_env_attack": -0.07798820351596275,
    "p_env_sustain": 0.6186397519784647,
    "p_env_punch": -0.028729751367902387,
    "p_env_decay": 0.13265572154351699,
    "p_base_freq": 0.26273929812816055,
    "p_freq_limit": 0,
    "p_freq_ramp": 0.04238730069277365,
    "p_freq_dramp": -0.0011068278273320686,
    "p_vib_strength": 0.402,
    "p_vib_speed": 0.0066734526469209784,
    "p_arp_mod": 0.10191498425693786,
    "p_arp_speed": 0.2213839102895271,
    "p_duty": -0.1697049278590128,
    "p_duty_ramp": -0.029509365105563852,
    "p_repeat_speed": 0.05154017640213363,
    "p_pha_offset": 0.12181809924225594,
    "p_pha_ramp": 0.07607986441509429,
    "p_lpf_freq": 1.1253516376531465,
    "p_lpf_ramp": -0.04784709544881777,
    "p_lpf_resonance": 0.007117341222663075,
    "p_hpf_freq": -0.11000150892288335,
    "p_hpf_ramp": -0.04664225510311318,
    "sound_vol": 0.125,
    "sample_rate": 44100,
    "sample_size": 8,
    "p_vib_delay": null
  },
  playSound: {
    "wave_type": 3,
    "p_env_attack": 0,
    "p_env_sustain": 0.1429517462527825,
    "p_env_punch": 0.42991129078955037,
    "p_env_decay": 0.10534453563204361,
    "p_base_freq": 0.756303973356857,
    "p_freq_limit": 0,
    "p_freq_ramp": -0.23566013887379067,
    "p_freq_dramp": 0,
    "p_vib_strength": 0.11770688087391387,
    "p_vib_speed": 0.44518605353015767,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 0,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0.9908032579923518,
    "p_hpf_ramp": 0,
    "sound_vol": 0.25,
    "sample_rate": 44100,
    "sample_size": 8
  },
  lineMade1: makeLineMadeSound(1),
  lineMade2: makeLineMadeSound(2),
  lineMade3: makeLineMadeSound(3),
  lineMade4: makeLineMadeSound(4),
  lineMade5: makeLineMadeSound(5),
  lineMade6: makeLineMadeSound(6),
  startRound: {
    "oldParams": true,
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
  },
  mouseDown: {
    "oldParams": true,
    "wave_type": 3,
    "p_env_attack": 0,
    "p_env_sustain": 0.021277239831831884,
    "p_env_punch": 0,
    "p_env_decay": 0.13467822098739526,
    "p_base_freq": 0.9078085621230343,
    "p_freq_limit": 0,
    "p_freq_ramp": -0.5981443511003721,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 0,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0.9629678638694237,
    "p_hpf_ramp": 0,
    "sound_vol": 0.585,
    "sample_rate": 44100,
    "sample_size": 8
  },
  mouseUp: {
    "oldParams": true,
    "wave_type": 3,
    "p_env_attack": 0,
    "p_env_sustain": 0.021277239831831884,
    "p_env_punch": 0,
    "p_env_decay": 0.13467822098739526,
    "p_base_freq": 0.9078085621230343,
    "p_freq_limit": 0,
    "p_freq_ramp": -0.5981443511003721,
    "p_freq_dramp": 0,
    "p_vib_strength": 0,
    "p_vib_speed": 0,
    "p_arp_mod": 0,
    "p_arp_speed": 0,
    "p_duty": 0,
    "p_duty_ramp": 0,
    "p_repeat_speed": 0,
    "p_pha_offset": 0,
    "p_pha_ramp": 0,
    "p_lpf_freq": 1,
    "p_lpf_ramp": 0,
    "p_lpf_resonance": 0,
    "p_hpf_freq": 0.9629678638694237,
    "p_hpf_ramp": 0,
    "sound_vol": 0.585,
    "sample_rate": 44100,
    "sample_size": 8
  }
}, (s: ISoundEffect) => new SoundEffectPlayer(s))


export class Sound {
  soundInitDone: boolean = false;

  on = false;
  frequency = 400;
  musicGain!: GainNode;
  mixerGain!: GainNode;
  songNo = Math.floor(Math.random() * 2);
  synth: any;
  musicVolume: number = 1;

  async asyncInit() {

  }

  setFrequency(f: number) {
    this.frequency = f;
  }

  constructor() {
    this.asyncInit();
  }

  start(musicVolume: number) {
    if (this.on) return;
    this.on = true;
    // top songs from https://twitter-archive.beepbox.co/
    let songs = [
      "#7n32s4k0l00e0ft2nm1a7g0fj7i0r1o32100T5v0ue8q3d6f7y1z8C0c0h6H-SstrsrBzjAqihT0v0ua7q3d6f8y4z1C0w0c1h0T1v0u82q1d1f6y1z2C0c1AcFfB7ViQ0245P7788E0000T4v2uf0q1z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00T3v4ug5q1d7f7y0zbC0S9irsAABJJJJJJJIb4zgid000lBsh8x4y4i8h8x4h8y8h4i8y000h4h4h0001804w0i0180p23mCKCR-jzQQuMgv0aPzYnJVBxN-rljtfQtfpH_K8Sqfyy_ziftQzSHbZ1FW7h7ImnXF7IH6LCTQR_N7B5ZV6VH_lwzzRCzZAzsQvcYhRlp6CzNyfqIzS9MzFH2fgyfGwp7IOM4tl24uxAuRp7Ijx7jm4uYhwkQv1vgqZ1vgnSAuALEbWieALEbWp82Cz98XOeYOWGHOeILia1Q0awWvtenI0",
      "#9n32s7k6l04e0bt2ca7g0fj0ar1i0o421T1v0u01f50m91ea2hc2k02f3q1335b2d26AcF8B5Q0259P8998E112T1v0u01f30n817a2cbq8T10n9470623d0aA1F0B2Q31bdPb525E363b529b8T1v0u01f31c80kc2hbq00d03A1F4B2Q200dPb794E3617628637T3v0u03f20o8166q45022d5aSjPrrW9V80Eah0a0E191T4v0u04f20q7167q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b000id5pUCH0id18Q4zgid18Q4zgid18Q4h4h4h4h4h400x4h4h4M0wp25nBWNRR_zOVdAOg4FJvBjHGuqH7ntrYLkWvO5jbMbgbqttyZlGSHr7nn-fbWzBdeKQt3bpH-_JzHKJ-nZshk1ghiZd7QptFvihOhvntI5ZlhBQRBZddQxqtsKAC0bVdeO-x40LIiMLpEZ86-U3X0s7ELFD0kHbYHITIbYPbHJ2G2G3JuKF_BYa8AwILEX5Er7We0juCYLU9EZ6hFLh_TprczN4CnCGKM1jhY3bEEbW2ehFbXGd0OWa2-wzAqi-0EQ3bEEbW2eGALAGd0OWa2-wzAGi-Sw1k7jXFOM0kQow8SqcU7bHEGKGFG8Wyf8DaBZ9BQ4th7ihQAuhelsQplUfeM0",
      "#8n31s0k0l00e03t2mm0a7g0fj07i0r1o3210T1v1L4u66q1d5f8y1z7C0c0A5F4B5V7Q1753Pca88E0088T1v1L4u9aq3d5fay1z0C0c0AcF8BeV8Q0259PffffE8543T5v1L4u32q1d5f8y1z7C1c0h0HU7000U0006000ET4v1L4uf0q1z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00b4h400000000h4g000000014h000000004h400000000p1ZFBMj5y4Yt0jCQQuiBYGCn35JJaqic1cJd7XihIQu39So2pqCnZe01cRVU9yw0",
      "#6n62sbkbl00e0Ttbm0a7g0Tjvi1r3o33331100T1d1c1A0F0B0V1Q0000Pf6d0E0161T1d1c1A0F0B0V1Q0000Pf6d0E0161T1d1c1A0F0B0V1Q0000Pf4d0E0161T1d1c1A0F0B0V1Q0000Pf4d0E0161T1d1c1A0F0B0V1Q0000Pf670E0161T1d1c1A0F0B0V1Q0000Pf670E0161T1d1c0A0F0B0V1Q0000Pf760E0161T1d1c2A0F0B0V1Q0000Pf760E0161T1d1c0A0F0B0V1Q0000Pf7e7E0161T1d1c0A0F0B0V1Q0000Pf7e7E0161T1d1c0A0F0B1V1Q3029Pe624E0177T1d1c0A0F0B0V1Q302dPf625E0177T2w1d1v2T2w1d1v2T2w4d0v0T2w4d0v0b0000001232123400565756570089abcdef00ggghiiijkkllmmn000000000001232123000565756570089abcdef00ggghiiijkkllmmn000000000001232123000565756570089abcdef00ggghiiijkkllmmn0000000000000000000005650565000000bcdef00ggghiiijkkllmmnropq0000012343534351267686768129a9abc341234343434343434341ed00000123333333312333433351233343334126789abcdefghijklomn0d11e23f11111114511111111451111111g45h666666677777789bac01111231111111a451111111a4b111a111c4b1111111d111111674890p2GnkQcy4CvoQOQ2CgeAthzq4NU3AzSyCgeAthzlsKc-pOhXhj87ieENEY218wI18wA0i8944w2A4C2h180Agi8902FHoh0oZjj3wm0V0ID8cjJ6fpS1pl555egihZb1J391G39xG391G3i7kHj6NwQi8V4VUAWG1Rr1baEO1oxA2N0CRp1b89R3FEFO1p9t9Os0jF7iegcUDbB1Q3E6Qkkk5W1Q3EcqyCQyr2hIp6hAp2pIp6NAp6hhgYhIr55574p6hgF0ANAkk3ldb1zMwncu4r0G1apgcp0A0U5N2Ak76hN0G1k2hV51eywDhA2E5gawl0G1aqvwQyU0CBM3y19BM3Ga1V0dwmg385g9Sa1SQQ3FFE7gjF6QQ4Wa2td0Wit8RdvAPVd0Wj6000FEoMAPW6CewlO1QzGcrhA1OhVhn87ieENGKv6n06kfraV0WhRCckRZdce35Gegb0cwmjA69SIwNregbaEEEFO2gUgQimgb4iZ552K76ex9zjxUFhgeywt2jIE7ojHE7oegS1k2sg9QV1ba7nhjA2OswIAYiw2t8WisweyyxEEEE7gjAxO8WiXbQiA3l0zw82--C17kdFGGF7rpkeIt9zkkQh4S4zoOcz8O4PoOdz8OcyyxUToSaaae8Ocyxi19z8EE6Gqm3fx0KoY8S1k2kOwoO181Mby58Eeczy1k2E4zOa2t51ez85gawl0G1k2kQY4uMCBMgjbw6Ngf88k4eo4W5gegFE7jjgewDidFE9Qk4Wq1QAWhGq_9DOq1QCc001jhMMFDE3j7gaV0WhR6dEO0V8YEHA3F7koRnfzbw3a7JBswt8WP6aq-EttEj3wWMWgki8V385giN2CFn3z7GxUB8QFekw82OMs1hieGACAUqzo5yegawm8k3A1O1dE9Q4Wcwmhh83FO1k2E4AYW09QzF9QzAqqmyyCAt1fB4z8Aqj22yCUyr2hIp6hAp2pIp6NAp6hhgYhIr55574p6hgF0ANAkk3ldb1zNwncucr0G1apgcp0A0U5N2Ak76hN0G1k2hV51eywDhA2E5gawl0G1aqvEZxdbwwCn0dywuggE8sM9Sa1TkQ3FFE7gjF6QQ4Wa2td0Wit8RdvAPVd0Wj60000ar7H7jq3Fw2CuejE9O0WqahQBQDag1eAt9egco2yCw8CMAr6hAp6gCr6hIp6hAkkf4r6NhhhN6hAkag9cp550RjiMoj3wncu4r0G1apgcp0A0U5N2Ak76hN0G1k2hV51eywDhA2E5gawl0G1aqvwZxdbwwCn0dywuggE8sM9Sa1SQQ3FFE7gjF6QQ4Wa2td0Wit8RdvAPVd0Wj6Z0UBnBpllmtr0pHpCmmpBCpppCdCpppC9zF71swsF0Rgc0e-AttcBkc05df9kPQU3aOGGIkw83drcOOPce6OheQqoZ1K8M1mwzAzOwKojI7B1ONS4W36zjba2Ay2j190Agi8804A2h190Agi0942qYMtFuxce1peg9jh_8XheHo5AV1r8O1peg97P0qgT1G3s6Ecy6Ed8thJcqjLHwbE4tFeADliAXrrrb1M55d5l6ObDwe-jF7JyP1Ms0eMtMXmED48Ucszw0IiAF6hw9ahquBE20M3BcUbCXJJKrpCmmpw000002CDxFDFM6lBlloF0g6qSpBBCosdNcNTl4QRuiapZW1w82CK81QicAXpzBs1EEwhM0U3jnRIwtR8WOt1eCzOcwtl8WJyz8FEZz87lphmjE9RQt52oV10pdJZRcDt0QRgdBnNOos2jbMFg2w70Ci3a7AwOIA6lQzxU2CAD9SQQAV8vNEYWkOcCL8Opf87IMM01kO2800lSaCglS2KNkO2KMlSaCglS2KNkO2KMRS7CqsKMlSaCglS2KNkibkQLjRnB0t54aeIs50aEUgt3YMDijF7phlhP0G1apZ-0uUjH7jgeOyGxnbHDPt9-rrragcBlqeCKCLMDaQRuMV0X2qh-V68p6pApKhXEkNZ8W5Uiawncr6tAav4g328Wr7Yft9YrAoxAozAozAoWYL8OYzbO1RVugo-PMjIwcWPcIIPePcIIP5d3SvjcvLrt-lBllpZZ-q002CC19y81j0g5AxOhp8sAmi795AxOhp8sAmi7949MQR2zkFIp52Cm17kk9GA1hV556NR1MBddxcS4zoOcz8GFOcz8Ocz8FlcYOkO81g38O0k0Ocw50cz81g1Ocw50cx9cz8YoOa6xjbg8Ocz8O4Sfx7Ikk4Waa1GCxH4aqmEgFBwhN550Qt556gC11MBcigF2k7o5gbp3AyOgV8IAeib93AyOgV8IAei9YGSwXgIAeib93AyOgV8IAeib93AyOgFDkYhIxUEmi795AxOhp8sAmi795AxOhp8sAjAxF3i795AxOhp8sAmi795AxOhp8lcsiIAeQ9kQ8CAPoidz8OcyGD8Ocz8OcyA00001j4UMSAkM95qb93A4Gxp1na4GooADw4UuSji0I403yw9Cknuo8roa0k0E0Ch9391g2w50cA512wxggF0Q0F8k4a251Ajg9bfsC6AzN8H1p8swBkb88QAmAzi6wd96Ad0qid8q0QQkkkkkkf40F8k4a258a0kAa2512A3g2AxggE8k0jh9dHIC6AzN8GxpgsEBgb9aV0a0f40F8k4a251zOuXG9L55qid0qiJ96wd9xq2d8q0QAqgQ1F3i6wHjhhhhg0000000",
      // pas terrible      "#9n31sbk0l00e00t2ma7g00j07r1i0o432T1v1u64f0qwx10u211d08A1F2B5Q20a0Pe64bE3b662776T5v1u80f10o5q011d03HS6060006000000h0E0T5v1u80f10o5q011d03HS6060006000000h0E0T4v1uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4h4p22kyLps8051CnCYCHL9EnbCHjbNAjlRllyQntX4QljmjdThdSbltTAjhldp5TtdloKhdtVcRuh9jQhIuwxntTByV5TujAntRltyKpupKGG5FKGGGGWECyfqSbKWXKYIn8KXOsyXKGHInpCWGEk00000",
      "#5sbkbl00e03t9a7g0fj7i0r1w1111f0000d1111c2000h0000v0000o3210b4zgid14h4h4id18Q4h4h4h4h4h4h4h4h4x8i4x4h4h4p228FzxMaqvs6CLEZyFdHW77L9DNjnnGjr-wFzI52qvRaCBUoGIuz1E3hg6wd0q5cuubzkQ-vltAd7dFDZEjo_AR_g0ao00aa4Ne381FOG0kk0OgR1FOGehhi6EdelhhhhhAxG3jBk00",
      "#8n41s7k4l00e0vt38m0a9g0vj07i0r1o22110T0v1L4u00q0d2fay3z1C0w4c0h5T0v1L4u00q1d1f5y0z1C1w0c3h0T3v1L4uaeq1d2f8y2z9C0Sp99f9c9Vppbaa9gT5v1L4u05q0d3f7y1zhC1c0h8Hx3l47o388i1900T3v1L4uf9q1d5f6y1z6C1SW86bmhkrrzrkrrrb00000i15hw0004k007xUu0004zcx08s0hkl50000hQs04i8i4i400015u6pC4w1U00000000000000008Od5pN4y8x4x8h8Qd0004zg04zgp29EFJv6jsvEFH-kSLT9sJCLVHapJvx7CIGKV0YvKlnnrpPDaPsXfOFb4urBVKrBls1pOdLbPcGLs2Gq_TZUFJvT_-FGuLtX5k8sOCCFWYmxRrjn-_zbWyCrnUGCLRPFW3FZ2rFZ39N7BlcT7YwVjdQ_5Y3jq_u0VClrCY8IiM34sGFCRYfaCLZ_uarnZ-yyFGuLtX5k8kR_GrnYPYTaHpJvYfBrurCVkByddvFIR-25jelARyKnBcVmlmABISCsL9GTbdFDbOGQTpJcVujlKmrjenBlOI1SCsH9H5cLqpOIGKpCwQPBpdpSm5jelBljh-Ard7Ph7j97B4ulh7D4unF7j97B4ulh7OyfdMzFAzOyf9EzPOfbQzFAzOyfaEzVx7C-hQOhVh7AQhVN7B-hQOhVh7BkhQQuChIQu8AhQOhRohRShUGhVCAtcAukhVl4tjn-_9fkSLXZ55jkZuXSaEgVBddjRUJ1dvSQR_LUO-EFCR-aZXuTLtTIlhDcHKbTK-UO-EHKaZz8WyxTtX5ktPaXy-XLKcLGaXyBCRPHsSKpTISK8oPnBSCLcOGOKXD5pCrzCLbJ7zYKXO-_GrnaPGWMaPGXHLC_KUzmw_pRtRS0",
      "#9n41s7k6l04e08t2za7g0cj09r1i0o4321T7v1u07f30q82fb1abqwF32ib0n81cc162d06HT-SRJJJJIAAAAAh0IaE101T7v0u07f50p71790ra2d72g4qwF21a90k7162d06HT-SRJJJJIAAAAAh0IaE1c11T1v1u01f20oe17dqwz10s8111d08A0F0B0Q00adPfe39E4b761862863bT0v3u00f20oc1bbqgM10fe3b0d23w5h0E1c01T4v0u04f22xe2ubq00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4h4zhm5UAi8zhmsECw0id5pOyq000id58Qk18zh4gy8wp2c5IQvla9jhYp5kjBpkQPwChl4VencLl2RBmrNszjd7PJJkrrmzl4QjhccHhd4Qj3akjhd4Qphd5lVGZjdcQPrRcQPjc3dcQPjdMJcMBi7ptdhd4QjkFhd4Qj3akjhd4SvjdlSrHJjdcQPpJcQPjc3RcQPjc3dcRjoBFBhaqfz8mEDaOFFDeOaED9OVBqEkIH3OED8OaEDaOFFD0YzapOcPbWElJH1QED8OeEDaOFFDcOaED9OVKGzHajOZd7WPhYjsQvkQECyeyqECyeyqECyeyqECyeyqECG9GyqKrNsyqeqfGGECG9GyqFE-Blh7llkhRllkRkRkV51MF7llkhRllkRkRkVwgth7llkhRllkRkRkUdv2Atllh7llljljljPJZhd4t4Rhd4t4Rhd4t4Rhd4t4Rhdkjl4RFXR4QhQjl4QhQjl4QhQjl4QhQjl4RhdkjmXLkjh7hdkjh7hdkjh7hdkjh7hdkjl4RhdjNtdvXhjpuCEwqcGyVL5OFICLVEFJvkshBV5l79p6jAgl765ApChphP6hCp45hVFh0kpt7dkgd6thOR43hDQk7E_aCz8a1sLRQ4CLIih-9E_ecIkAozMR8Kk1k2Vqc8WawnbI2profMXMPMPzb597EU9ibB050Kmz2eyE5OWOpoiTMTMPMPzb4l-7Q3T64l7ykOMI3TTutVNByCLeLxW2ubFEPE2RXhDrSYRh0Tkgdt5Iz8gczrvCpSTJQVmw-8QQp5N7rpuZEO-_qqcRhhvthh0TQknng5c20",
      "#6n31sbkbl00e0dt5m0a7g0fj7i0r1o3210T0w1f4d0c1h0v0T0w2f4d0c0h8v0T0w5f2d0c0h0v0T2w2d1v1b000i4Al7w00Ocz8Ohkk003gQd3hmlzgQ4h4h4i8y4h4p2c7yj3C1wb4NMsA6gCm7B0TgmwJOsijfi15ClSnXSi38U-1Q45gcEz1H8VxJ1k2P31beg85P71axerpzMmIOMOJPbUM0tlczw7E3Gj3hNbOi15xBidIx8si3Ok8rJJJBKO3gMNrJJJBKO3uQ460pwbg9GuEI--KKPygsvLwPYA58cAek2g1jo-j7j3S5FHGGpxETBg491QRkRkP3p1RlkRkMdk3lllllIHsNOh9fcOXLbwcNc7bOHJX73CQHMJl0ZBF2-y2TLUbS7RZUbFGMumy6VWQIPbKYK0Pe1OYGXV3CQJrXZNd7cOXLbwsYfsLaKWGH0_ucjC7tTzjBTup2pWamc47CnCcRJJmB2iecmTtUQrtnCqiF8UQg-pCoJSMA4Chih3UbkQJo-bKYqsKXP8f1AkIo8fcLcpHrqJ9qT6frKYocKHOTJj8AAQnw197vUKXNDOXLcwY5hiNwwYOYNCJJGQBHsoZKXNwOWLbU8AAQkiosMc1oCe3jgCm7lCSXKjyipWg75GqrqGCoqdVk12MldldlcNmgtlldlc3l0RllllraUeGGGoqU24wWGqqFuWGjUlPp70syO1GJIGSMZdZlldlsb0RkQMJlRRdRlldkDv1kRkRkXrqrqGGqFiO-GCC4GCa4KFFy2oAQfJCDGsdjrlljl9MA3ljjtlcc9tjj44NrSPjygc59i0o0dgo2SIbcvs3j0Wy-CE5lgaaqqwcMaE6hhjjk2GE55ddldleyyCCE5ll8qwkkwGEFFG1lli2CE55lg0",
      "#8n31sbk1l00e0wt2rm3a7g0wj0ni0r1o3210T0v0L4u12q1d1f7y1z1C0w2c0h2T0v1L8u00q1d0f7y1z1C0w2c2h2T0v3L0u00q3d0f2y3z8C0w2c0h6T2v3L4u02q0d1f9y1z1C2w0b28oy2aoW4EixaBIqNH6Ir2cFTFmMgx248gw4cwxA68x248cowz2d1P00000000xiBakFzCcoNyBeFiRI0000000000688N3e0xi58kxlFgsVPGp2daK3Qv7jlJeKRZ6Ujpu6CNvQQv52rnQdqDnu8Y1RdEZugSrNvzqCYnYu3bdBYrqttyU7TVjmPsTZlCZ7VkJeKFY1NCLU1FCI2KXYFCCrd7_BcISLU0PhYPjdcIOYOPrK1XdvTtjZf-DM6zdHbdFqsHyfIkuBbd7NbjkZu90q9tjTXgbGuYN76q_CqpGpkLl3FHVvS1jCzWGGGFPhRljAnGGt4INs3GsOZlllllleAzQtClpH-6agoDd7wRjAzWGDgbauGFMq_ZGM2iKSBS2fVww62KTx7E8I0ellcL3zYfHOQSmILgVEILpvajhbJ7Ct03hbGu9q9tNflXcSDnqflMPh_PhbCU_PcsSLRlnhbK9YB2OXtkKOUFlllmbKrWZSEInqf51vMEBBf2ynkYaaDtrXjuzASyl-wUeEmvQtghiI7E-eDpLh_aInE_4Y4DhldWehjuzYk_E_a800mCQv7QA2Ppv2bdKZSPq_kSrOfVbyZJeKNs7GpILDH4mrC-XDdE8S45ZOi_BdvPAR4Knx57PBlkllllTmRklllqWaaaaaaaqaaaaaad97ghQ4t16ynAmwmwmwmwmwmwmAmS7Q-zYtU_Jm01abz_a4mLNPWcyNsvNdcImLPddWei01eDjhAkkRkkFHOapiaqqaaaqs0SqaacgPbYTKkk2FJsALjahhgbjghQQkk9HOuEFEOqaqczpb-PhghVKjhhhghXnyqa1mrn0bbYCywmGwzpB9GCqpFBdulkOHEiPFWAlt2oF5iw517hghQklcKW4F8E1hgbhhgbhhhvgkRsGY571BlcGUAhja0kkkpehhhhjhy2fb8hjnAk9KD800",
      "#8n51sbk0l0Je00t2-m0a7g0Jj0vi1r1o343110T0v0L4u00q0d0f8y0z1C2w3c2h0T0v0L4u00q0d0f8y0zkC2w4c2h0T0v0L4u00q0d0f8y0z1C2w3c0h0T0v0L4u00q0d0f8y0z1C2w4c0h0T0v0L4u00q0d0f8y0z1C2w4c0h0T0v0L4u00q0d0f8y0z1C2w4c0h0T0v0L4u00q0d0f8y0z1C0w5c0h0T0v1L4u00q0d0f8y0z1C0w5c0h0T0v0L4u00q0d0f0y0z1C2w1c0h0T0v0L4u00q0d0f0y0z1C2w1c0h0T2v1L4u15q0d1f8y0z1C2w0T2v1L4u15q0d1f8y0z1C2w0b000013141312567ab67899999999567ab67899999999c0000000000000000045671213121380004567121312139000000000000312121212121212121212121212121212401212121212131212121212121212121212121212121240001111111112111111121112111211111112111211123000000004125312526789678967891252678967896789a0p2fEkRYg9EV6BcI2bAkEESsHaNaH9Oe0mLbFUMn8F8U8zwaidjbRHBdviRFEXauq5Oakkrapq1tyCCyCGRVHaFVIn8FVDcGGFGFHKOfF6sChFGGAKtJPepFPsCzOGqHqWWWWqGqGsGDaOqvdUGYCKCGGLzrsPyqsT9EYCCGK--1wE62wo20FGJReJFESq9CypECq9CypECq9DjhPd0Mk31kRlQQkSskbAlkZqCnHnvcOddlkBRBKpPderAQqCmuwF80000002Cm4jbNaQOczn8VChljppnpj9RkRkRkRkTkSkSQKtAmQRSlTpChljppnp3RgJdRdldldRdRc3kVChnjpnnvCp5ldBBtBZlZdlcfj44F2QMRcgkV6FBWO_9EWpaCGCFdv2O6pPdepAQu1kRmRRRQSmQRkVlelAQ-rNBpdldldn6mpD4QVCjgFbViSJ9vSCLZKLwBnH5Ldx44N7jGLnbfeSG00000001uSn408ottTrSLHKXOXI6KXLbKXsKMgGXKYKXLbLtHKXOXKQWuKXWKXKKXKh21ZvcIZ1v__0000000005d78N3jjjjjjbN1jjjjjiOQfjjjjjjbh1jjjjjiRRQQQQQQRMk10nSMs8GppW2Jo000000000FRYUFFAFFAFFAFFAFFAFFAFFAFqpaqpaqpaqpakYsqt9Ry6qpMdxGnPaxS2KUtpjHqokwludsEZ10000000001iTEdGpkHqhg4FE5OsAFE5OsAFE5OsAl8W1sD9aq1sD9aq1sD9aq4iIreOaAt0KjABd0KjAyFoOWiG_dcVCRjCnpBtQOBLgfjNtcE0bO3T7uskAlx8-q5UX9aq1sD9aq1sD9aq1sD95uKNFBiJQAkIFE5OGOyCwnaHaaq1sGIEl8W1sGIEFE5OGOyCwnaHaaq4iIrlrgGhQ2VlphjgbBlB5d0KlmkkQ2VlpgGhQ2VlphjgbBlB2FoOqiG_dcVydkVBSpntcFrQ15i-zDFw0000000",
      "#9na5sbk0l00e0ot2Mafg0Nj0tr1i1666666000066600o5524344433T7v1u07f21120q8q0j0011d0aHUZSgF8O1000000h0IaE0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T5v1ua2f10mbq8243d4aHKTTz99irrqih90h0E0T1v1u01f32l50ob1h8q0y10r52d02A5F4BfQ010bPf9b0E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1ue5f0q0w10r5d19A5F4BdQ010bPf977E3b862a78T1v1u01f309910e2teq1D20k72lb51452d05A1F4BbQ00acPe355E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T1v1ub3f0q0w10n7d23A1F0B5Q00acPd559E3b963974T0v0u00f20ne1beq8b2510d07w1h8E100T1v1u97f0q0y10t23d4aA9F3B6Q5428Paa74E3ba63975T3v1uaef0q0w10p7d23Sp99f9c9Vppbaa9gE1b9T1v1u82f0q8w10l51d03AcFfB7Q0245P7788E2b27iT1v1u70f10p7qw01d03A1F9B2Q1030Pdc6cE362663b72T5v1u41f0qww10r51d08H_RJSIrsAArrrrrh0E1b7T1v1u76f0qE012d03A0F9B3Q1000Pdbc0E1629T5v1u05f20nd18eqxD10n51623b1d06H-LHyiiN9x9dcx8h0E1b6T6v1ub8f0q0w10p7d23W7E2b925T3v1ud6f10t9q00d23SU0010508whhaa9hE0T0v1ua7f10o9q8213d19w0h0E0T1v1ud5f10q5q8223d23A1FeBfQ021ePf34fE2612626T1v1u9bf0q8y10x523d19AcF8BeQ0245PceceE1biT1v1ud7f10qaq023d35AcF8B7Q047bPf422E176T5v1u05f20d711bq86431d23HYP802i8ah00300h6E0T1v1uc2f10n7q00d23A4F0B6Q2409Pc733E179T5v1ua1f10mbq8243d4aHT-Ih9jrh900000h0E0T1v1u9bf0q8y10x523d19AcF8BeQ0245PceceE1biT1v1ub2f10k8q00d23A0F1B8Q0000Pe600E179T1v1uc5f0q801d23A0F0B3Q5000Pf800E0T5v1u85f10l7q00d23HK-LBJrttAAAyqhh0E0T6v1u06f20mb2s5q83432d76W5E0T5v1u05f1097q0X30la14d2g953023d97HZRQIJRF1000000h0E0T1v1u84f10r8q00d35AcF8B5Q0259P8998E0T1v1u97f0q0y10t23d4aA9F3B6Q5428Paa74E3ba63975T4v1uf0f0q00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T3v0u03f0q00d03S-JIAArrrrrqiiiiE0T4v1u04f10uaq00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJ2jikikrizrHtBD_AzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0T3v1uf8f0q0w10p7d08S-IqiiiiiiiiiiiiE1biT2v1u15f10w4qw02d03w0E0T4v1uf0f0q00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0T3v1uf7f0qww10m71d08SZIztrsrzrqiiiiiE1b6T3v1uf9f0qww10l51d08SW86bmhkrrzrkrrrE1b6T3v1uf7f0qww10m71d08SZIztrsrzrqiiiiiE1b6T3v1uf7f0qww10m71d08SZIztrsrzrqiiiiiE1b6T3v1uf5f0qww10n51d08S1jsSIzsSrIAASJJE1b6T3v1uf8f0q0w10p7d08S-IqiiiiiiiiiiiiE1biT3v1uf7f0qww10m71d08SZIztrsrzrqiiiiiE1b6T4v1uf0f0q00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0T3v1ufaf0qww10t51d08SjPrrW9V800ah0a0E1b7T4v1uf0f0q00z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0T3v1u03f10a7qww10n61d08ST__qii800Azr01jE1b6T3v1u03f1078q0w10p7d08S___SRAri9999000E1bib00000003SKqW4pjE2Jw00000000000000000000000000000000002Cex9j7gA0000000000000000000000y28p0y288xA28oh14cw0000000000000000000000000xAaoVR1gA05Iq000000000000000000000000000006gFzD44Fw0i148ODg0000000000000000000000y28p0y6g8xA28wh0000000000000000000000000000000000h34c12Ce00080000000000000000000000000000014cgM4aoU000w00000000000000000000000000000000100810000M0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gFiB6coNz6coM00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008gx2248gx248g000000000000000000000p2yN5cKwd6wFwiCAQq2CAFFfghbW2CAFFaqiCAFFaqjRAq1jikQCzgkQBd9Xyd0FEaq2C1ao8FJaocFGap4FIaq3hF5F5F5G5Gap0F5d7G9egxqWWVeiwV6hKKKKGKKHKLAbGp2G-1GHF4LjbE6z0Czsqc4qcCqcAqc4qcGkzx2A9agKGKHJJIwqqrbFa1GwrbHAQs2EBte6eCzUA9e1IG6Fp1MANngA3rl1RlnO4Bv8OAFnp9mOcx8OkxppocewEe4AqF6OGGCKgHIAaGHrqqWWqHF2GOWmx1H6nipthBOpBOhBOxBMVBM9BzscK3cKAOWPbLcKIOV4OV0ONJ6n86nuptNBTCn96n8Cn86mcm3CW2ewzA3CU4zF8V8VIp8sT14t1797dRAt978AsyhQAth69Wfgs70D1SAtV6d8Lwqi-UzEAyeUOW2-yibW2eyh8U8zG8NJ5Z5FBQRidtcB8OcB0SmTM471gc98O5BJdEYF3EpcW6EW6ld61d4silTkTTmTMs1vtt0is19iBcNh50MI5j9Msxn0RR3sFIwrWUeCgAGH92OhJGGJJFHHAqUagGILAHxfz_b5H5H5H5ANqxhfze75Kap4FLag00000kOX45Ahp4mg5Ahp4mG0w820wV6KKCOUZT6AkO9j95cKkN4kSBcAkRBchBdVjukRBdNjskTBdpidwFGap4FHariCMFA2CIFy4FHarOCIFy0FwOCgaqOArhjskRBc2kSBc4kM9j05dhjskTBcCkO1j41jokOhiaqfV9SgJttsB8TTOdRRRRlRRtRYxtj8lnMdlt8MqgHHAGHqXrr82CCOWiwqE6OWVd70G9njxzX4x9MdBgV8X8AieULK8WqieULG8WieAzEO1cyQzJ8WOcr5ds7ccxt0SRgtllYx9nOcFalSilIz8icB8mmm33Ea3x96GhIGGFHAaX92GGSSCKKCGWgGIKBEg00000000000000kSLx4R_1T-8p1TUVr8e_Mb8e_70Sgt_DV1vwmgnzBcwX_9O2_4cwL0001jh-3bJcKUOVcOV8OVgOUsOU4ONK6n1CniptpBTCnmpsypswpoSzbA3bLcKUOXPbAzbAjbA3b0000000000005dvx92iFAGqpaiIKJLAqWNfhUgU-hef6h5Zk1snSQTBZBA2CU_QkR_MLJIIbXrXy-GGiONPBdAzvnr8OtlJBYxlodqO1FwqoaClAomgAV62G74SpnjvwKh8QRSn33zO-MU-AUYocunMVNYwsudyOgGBaqqqGqF64AGWxx490QO4Bp9QSkQQRi5UM0YnEFdu5LKArNK7jEH_kBYwt_1Okx8000000000000FEYA4swhSAt979Atp7ihFHZ6iMczxieUzL8V0zAOeIz6IhMh79Atp7mhRAth7CMeohMh7khO97qhO97khyCU_hlFJv-_zE2_t6VrKSXdZSYeqbX2-QLKIdu-ALJFK6EnT5ZNv0T6LvuqZVucyfnUiSCOOMu4xMsg6nssTgs714syhT4sChzcUVKa3Ur00006cgnMl9vc17h94sapt1vh9BZ17h8As4hR4oSy-yQOWqF6KCiAp6iwrbrU23wE64Ap2OSCQkOWgW6jexGexBjhwjh74BtRdZRJY70nTng4D0ikFjckhgcb1kOs78lMdtgTar86-K3FA9aGOgIArqGHrqqWV6K2AaHbVaU0000001pLh-ti32c4M6rFZ1uThN9twiY2M3wr0Mv91x00000000000000000a3Qvo33WfAcyYN8o51jQtwZ7VnDEYhlfhVJSuzTRfhY70002uzKwk-wX0gJwRgafgvkxwA3fhSwkuwX2PjQuUwDEYBsZ7HCw-xUG0001k2LW1Srl7Z3X6Oq3W7Z000000000000000000000000000000jU_jaqb0kQM5bcFl9BaFGG6AkQ5d1jgkQ5d1jgkQk5d1jgkQ5d1jgkQ5d51jgad0mwmwmwmwmwmwmyywmwmwmwmwmwmwmwmwmwmwmwmwmyywmwmwmwmwmwmwmwmwmwkjUfJaq2CyywmwFkOGAwswt3gkQ5d1EQ5d550J1jgkQ5d550J1jgkw00000000000000000FBd2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q7CE000000000000000000kQpMLE8Wa2ewLE8W2eywYX00001kOHEjB2CFnaAaqZsuhlQuORHA3UD00000",
    ];

    let songNo = (Math.random() * songs.length) | 0;
    let song = songs[songNo];
    console.log("Song ", songNo, song.substring(0, 8));

    this.musicVolume = musicVolume / 100;
    this.synth = new beepbox.WorkletSynth("beepbox_synth.min.js", song);
    if (this.synth.isPlayingSong) {
      this.synth.pause();
    } else {
      this.synth.play();
      this.synth.volume = (this.musicVolume);
      // TODO fix a bug in the synth so that it always take account of the volume
      setTimeout(() => this.synth.volume = (this.musicVolume), 100)
      setTimeout(() => this.synth.volume = (this.musicVolume), 200)
      setTimeout(() => this.synth.volume = (this.musicVolume), 400)
    }
  }

  setMusicVolume(newValue: number) {
    this.musicVolume = newValue / 100;
    if (this.synth) this.synth.volume = (newValue / 100);
  }

  setSoundVolume(newValue: number) {
    SoundEffectPlayer.soundVolume = newValue / 100;
  }


  init(musicVolume: number) {
    if (!this.on) this.start(musicVolume);
    this.soundInitDone = true;
  }

  stop() {
    if (!this.on) return;
    this.on = false;
    //this.musicGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
    //this.musicGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.03);
  }
}
