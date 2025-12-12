/**
 * Web Audio API sound generator for countdown alerts
 * Technology-themed sounds for the Brutalist-Gaming timer
 */

import { SoundType } from '../types/irl-timer';

let audioContext: AudioContext | null = null;

/**
 * Get or create the AudioContext (lazy initialization)
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
      return null;
    }
  }

  return audioContext;
}

/**
 * Play a gentle beep sound (legacy function)
 */
export function playBeep(
  frequency: number = 800,
  duration: number = 0.1,
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Failed to play beep:', error);
  }
}

/**
 * Digital Pulse - Short square wave burst (tech beep)
 */
function playDigitalPulse(ctx: AudioContext): void {
  const duration = 0.08;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * Circuit Blip - Two-tone ascending blip
 */
function playCircuitBlip(ctx: AudioContext): void {
  const duration = 0.12;

  // First tone (lower)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(440, ctx.currentTime);
  gain1.gain.setValueAtTime(0, ctx.currentTime);
  gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.06);

  // Second tone (higher)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.04);
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.04);
  gain2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
  gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc2.start(ctx.currentTime + 0.04);
  osc2.stop(ctx.currentTime + duration);
}

/**
 * Data Stream - Fast descending cascade
 */
function playDataStream(ctx: AudioContext): void {
  const duration = 0.15;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sawtooth';
  // Descend from high to low
  oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + duration * 0.7);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * Terminal Click - Sharp sawtooth click
 */
function playTerminalClick(ctx: AudioContext): void {
  const duration = 0.04;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * Cyber Ping - Sine wave with slight echo/reverb effect
 */
function playCyberPing(ctx: AudioContext): void {
  const duration = 0.3;

  // Main ping
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1047, ctx.currentTime); // C6
  gain1.gain.setValueAtTime(0, ctx.currentTime);
  gain1.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.25);

  // Echo (delayed, quieter)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1047, ctx.currentTime + 0.08);
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.08);
  gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc2.start(ctx.currentTime + 0.08);
  osc2.stop(ctx.currentTime + duration);
}

/**
 * Play a technology-themed sound by type
 */
export function playSoundType(type: SoundType): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  try {
    switch (type) {
      case 'digital-pulse':
        playDigitalPulse(ctx);
        break;
      case 'circuit-blip':
        playCircuitBlip(ctx);
        break;
      case 'data-stream':
        playDataStream(ctx);
        break;
      case 'terminal-click':
        playTerminalClick(ctx);
        break;
      case 'cyber-ping':
        playCyberPing(ctx);
        break;
      default:
        playDigitalPulse(ctx);
    }
  } catch (error) {
    console.warn('Failed to play sound:', error);
  }
}

/**
 * Unlock audio context on user interaction (required by browsers)
 * Call this on first user tap/click
 */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}
