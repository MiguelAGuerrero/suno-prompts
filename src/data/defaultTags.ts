import type { TagGroup } from '../types'

export const DEFAULT_GROUPS: TagGroup[] = [
  {
    id: 'genre',
    icon: '\u{1F3B5}',
    name: 'GENRE & FUSION',
    tags: [
      'indie pop', 'dream pop', 'synth pop', 'hyperpop', 'bedroom pop',
      'lo-fi hip hop', 'trap soul', 'R&B', 'neo-soul', 'jazz fusion',
      'bossa nova', 'Afrobeats', 'reggaeton', 'dancehall', 'K-pop',
      'J-pop fusion', 'city pop', 'anime OST', 'folk rock', 'shoegaze',
      'post-punk', 'math rock', 'progressive rock', 'ambient electronic',
      'UK garage', 'house', 'deep house', 'techno', 'drum and bass',
      'cinematic orchestral', 'dark academia',
    ],
  },
  {
    id: 'energy',
    icon: '\u26A1',
    name: 'ENERGY & MOOD',
    tags: [
      'high-energy', 'driving', 'euphoric', 'intense', 'aggressive',
      'anthemic', 'melancholic', 'brooding', 'nostalgic', 'haunting',
      'serene', 'chill', 'romantic', 'dark', 'hopeful', 'bittersweet',
      'ethereal', 'triumphant', 'introspective', 'cinematic tension',
      'wistful', 'hypnotic', 'unsettling', 'playful', 'tender', 'epic',
    ],
  },
  {
    id: 'tempo',
    icon: '\u23F1',
    name: 'TEMPO & GROOVE',
    tags: [
      'slow burn', 'mid-tempo', 'uptempo', '75bpm', '90bpm', '100bpm',
      '120bpm', '140bpm', '160bpm', 'half-time feel', 'double time',
      'laid-back groove', 'rubato', 'steady pulse', 'glacial tempo',
    ],
  },
  {
    id: 'structure',
    icon: '\u{1F3D7}',
    name: 'SONG STRUCTURE',
    tags: [
      'verse-chorus-bridge', 'through-composed', 'no chorus', 'loop-based',
      'call and response', 'extended intro', 'extended outro',
      'breakdown section', 'spoken word interlude', 'key change at bridge',
      'pre-chorus', 'double chorus', 'fade out', 'cold ending', 'reprise',
    ],
  },
  {
    id: 'rhythm',
    icon: '\u{1F941}',
    name: 'RHYTHMIC FEEL',
    tags: [
      '4/4 straight', '3/4 waltz', '6/8 feel', '5/4 odd meter',
      '7/8 odd meter', 'syncopated', 'swing feel', 'shuffle',
      'polyrhythm', 'off-beat emphasis', 'reggae skank',
      'bossa nova clave', 'trap hi-hats', 'four-on-the-floor',
      'half-time drums', 'broken beat',
    ],
  },
  {
    id: 'composition',
    icon: '\u{1F3BC}',
    name: 'COMPOSITIONAL',
    tags: [
      'motif-rich', 'leitmotif', 'recurring hook', 'chromatic', 'modal',
      'pentatonic', 'dissonant', 'counterpoint', 'ostinato', 'pedal tone',
      'key modulation', 'borrowed chord', 'suspended chords',
      'call and response melody', 'melodic inversion',
    ],
  },
  {
    id: 'texture',
    icon: '\u{1F30A}',
    name: 'TEXTURE & DENSITY',
    tags: [
      'sparse', 'minimalist', 'stripped back', 'wall of sound',
      'maximalist', 'lush strings', 'dense layering', 'wide stereo field',
      'dry mix', 'wet reverb', 'spacious', 'intimate', 'airy',
      'thick low end', 'dynamic contrast', 'gradual build', 'sudden drop',
    ],
  },
  {
    id: 'vocals',
    icon: '\u{1F3A4}',
    name: 'VOCALS',
    tags: [
      'female lead', 'male lead', 'androgynous vocals', 'duet', 'choir',
      'tight harmonies', 'falsetto', 'raspy', 'breathy', 'operatic',
      'rap flow', 'spoken word', 'no vocals', 'instrumental',
      'vocal chops', 'auto-tune', 'vocoder', 'whispered', 'belting',
    ],
  },
  {
    id: 'production',
    icon: '\u{1F39A}',
    name: 'PRODUCTION STYLE',
    tags: [
      'polished', 'raw', 'lo-fi', 'vintage', 'analog warmth',
      'tape saturation', 'digital clean', 'overdriven', 'heavily processed',
      'reverb-heavy', 'glitchy', 'sample-based', 'live-sounding',
      'cinematic mix', 'compressed', 'pumping sidechain',
    ],
  },
  {
    id: 'instrumentation',
    icon: '\u{1F3B8}',
    name: 'INSTRUMENTATION',
    tags: [
      'acoustic guitar', 'electric guitar', 'fingerpicked guitar',
      'distorted guitar', 'bass guitar', 'upright bass', '808 bass',
      'live drums', 'drum machine', 'piano-led', 'Rhodes electric piano',
      'synthesizer', 'synth pads', 'strings section', 'solo violin',
      'brass section', 'trumpet', 'saxophone', 'flute', 'sitar', 'koto',
      'ukulele', 'banjo', 'organ', 'harpsichord', 'harp',
    ],
  },
  {
    id: 'custom',
    icon: '\u2B50',
    name: 'MY CUSTOM TAGS',
    tags: [],
  },
]
