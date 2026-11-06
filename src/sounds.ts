import { soundEffects } from "./soundEffects";
import { EventManager, Game, GameEventType } from "./types";

// ---- 音频统一调参 ----
// 8-bit 采样会带来明显的量化毛刺，16-bit 下同一条音效干净很多。
const SAMPLE_SIZE = 16;
// 高频触发音（发射 / 碰撞 / 消除）在连击时会叠成噪音，统一压低。
const FREQUENT_VOLUME = 0.1;
// 低频事件音（爆炸 / 道具 / 结束）保留相对音量。
const EVENT_VOLUME = 0.18;
// 同一类音效的最小播放间隔（毫秒），避免一帧内多次触发造成"机关枪"式叠加。
const MIN_PLAY_INTERVAL: Partial<Record<GameEventType, number>> = {
  ballCollision: 60,
  matchedBalls: 50,
  launchedBall: 30,
};

export const createSoundManager = (game: Game, events: EventManager) => {
  const audio: Record<
    GameEventType,
    ReturnType<typeof soundEffects.toAudio> | undefined
  > = {
    slowEffect: audioSlowEffect,
    explosion: audioExplosion,
    launchedBall: audioLaunchedBall,
    matchedBalls: audioMatchedBalls,
    // 演示版：结束时不播放音效（原 gameOver 音效偏刺耳，直接移除）
    gameOver: undefined,
    ballCollision: audioBallsCollision,
    boardOver: undefined,
    accuracyEffect: undefined,
    backwardsEffect: undefined
  };

  const lastPlayed: Partial<Record<GameEventType, number>> = {};

  for (const [eventType, clip] of Object.entries(audio)) {
    const type = eventType as GameEventType;
    events.addEventListener(type, () => {
      if(! game.audio.enabled) return;

      const minInterval = MIN_PLAY_INTERVAL[type];
      if (minInterval) {
        const now = Date.now();
        if (now - (lastPlayed[type] ?? 0) < minInterval) return;
        lastPlayed[type] = now;
      }

      clip?.play();
    });
  }
};

const audioMatchedBalls = soundEffects.toAudio({
  oldParams: true,
  wave_type: 0,
  p_env_attack: 0.02,
  p_env_sustain: 0.278748274533751,
  p_env_punch: 0,
  p_env_decay: 0.18355917631072796,
  p_base_freq: 0.3903503648305406,
  p_freq_limit: 0,
  p_freq_ramp: 0.21725440970444643,
  p_freq_dramp: 0,
  p_vib_strength: 0,
  p_vib_speed: 0,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 0.37202624121271305,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  // 原来的 0.666 偏亮，降到 0.5 去掉一部分高频毛刺
  p_lpf_freq: 0.5,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_freq: 0.01900429749807817,
  p_hpf_ramp: 0,
  sound_vol: FREQUENT_VOLUME,
  sample_rate: 44100,
  sample_size: SAMPLE_SIZE,
});

const audioBallsCollision = soundEffects.toAudio({
  oldParams: true,
  wave_type: 3,
  p_env_attack: 0.01,
  p_env_sustain: 0.002599699906979103,
  p_env_punch: 0,
  // 噪声尾巴缩短，从"嘶"变成"哒"
  p_env_decay: 0.15,
  // 原来的 0.6137 偏高频，压到 0.48
  p_base_freq: 0.48,
  p_freq_limit: 0,
  p_freq_ramp: -0.6483389940771214,
  p_freq_dramp: 0,
  p_vib_strength: 0,
  p_vib_speed: 0,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 0,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  // 噪声原本没有低通，加一层去掉刺耳的嘶声
  p_lpf_freq: 0.4,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_freq: 0,
  p_hpf_ramp: 0,
  sound_vol: FREQUENT_VOLUME,
  sample_rate: 44100,
  sample_size: SAMPLE_SIZE,
});

const audioLaunchedBall = soundEffects.toAudio({
  oldParams: true,
  wave_type: 1,
  p_env_attack: 0.02,
  p_env_sustain: 0.031468126640771525,
  p_env_punch: 0,
  p_env_decay: 0.17962021205847806,
  p_base_freq: 0.4591786306218479,
  p_freq_limit: 0,
  p_freq_ramp: -0.6411081281888386,
  p_freq_dramp: 0,
  p_vib_strength: 0,
  p_vib_speed: 0,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 1,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  // 锯齿波本身谐波多，加低通把"刺"磨掉
  p_lpf_freq: 0.55,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_freq: 0,
  p_hpf_ramp: 0,
  sound_vol: FREQUENT_VOLUME,
  sample_rate: 44100,
  sample_size: SAMPLE_SIZE,
});

const audioExplosion = soundEffects.toAudio({
  oldParams: true,
  wave_type: 3,
  p_env_attack: 0,
  p_env_sustain: 0.3608595444653826,
  p_env_punch: 0.6707961945922376,
  p_env_decay: 0.4470495472046201,
  p_base_freq: 0.10675488031118645,
  p_freq_limit: 0,
  p_freq_ramp: 0.1125775516965486,
  p_freq_dramp: 0,
  p_vib_strength: 0.20844228572257364,
  p_vib_speed: 0.20833947805469533,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 0,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  p_lpf_freq: 1,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_freq: 0,
  p_hpf_ramp: 0,
  sound_vol: EVENT_VOLUME,
  sample_rate: 44100,
  sample_size: SAMPLE_SIZE,
});

const audioSlowEffect = soundEffects.toAudio({
  "oldParams": true,
  "wave_type": 2,
  "p_env_attack": 0,
  "p_env_sustain": 0.22388964626345076,
  "p_env_punch": 0,
  "p_env_decay": 0.10730857907710051,
  "p_base_freq": 0.2702855160943179,
  "p_freq_limit": 0,
  "p_freq_ramp": 0.16692019187018273,
  "p_freq_dramp": 0,
  "p_vib_strength": 0,
  "p_vib_speed": 0,
  "p_arp_mod": 0,
  "p_arp_speed": 0,
  "p_duty": 0.17917764822638713,
  "p_duty_ramp": 0,
  "p_repeat_speed": 0.189,
  "p_pha_offset": 0,
  "p_pha_ramp": 0,
  "p_lpf_freq": 1,
  "p_lpf_ramp": 0,
  "p_lpf_resonance": 0,
  "p_hpf_freq": 0,
  "p_hpf_ramp": 0,
  "sound_vol": EVENT_VOLUME,
  "sample_rate": 44100,
  "sample_size": SAMPLE_SIZE
});
