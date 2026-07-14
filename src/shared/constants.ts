export const MAX_CHARS_PER_SLIDE = 500;

export const WEBSOCKET_EVENTS = {
  SYNC: 'projection:sync',
  NAVIGATE: 'projection:navigate',
  UPDATE: 'projection:update',
  ERROR: 'projection:error',
} as const;

export const PROJECTION_DEFAULTS = {
  WATERMARK_OPACITY: 0.15,
  RECONNECT_BASE_DELAY: 1000,
  RECONNECT_MAX_DELAY: 10000,
  LATENCY_TARGET_MS: 100,
} as const;