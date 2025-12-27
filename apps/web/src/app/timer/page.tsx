'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IrlTurnTimeSlider } from '../../components/irl-turn-time-slider';
import { useIRLTimerStore } from '../../lib/store/irl-timer-store';
import { unlockAudio, playSoundType } from '../../lib/audio/beep';
import { SOUND_OPTIONS, GRACE_PERIOD_OPTIONS, GracePeriodSeconds } from '../../lib/types/irl-timer';

// Brutalist beveled corners
const BEVEL_CLIP = 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))';
const SMALL_BEVEL_CLIP = 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))';

export default function TimerSetupPage() {
  const router = useRouter();
  const { session, setTurnTime, setSoundEnabled, setSoundType, setGracePeriod, setTimeoutBehavior, startGame } = useIRLTimerStore();

  const handleStart = () => {
    if (session.config.soundEnabled) {
      unlockAudio();
    }
    startGame();
    router.push('/timer/play');
  };

  const handlePreviewSound = () => {
    unlockAudio();
    playSoundType(session.config.soundType);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-8"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        background: 'linear-gradient(180deg, hsl(240, 30%, 12%), hsl(260, 35%, 18%))',
      }}
    >
      <Link
        href="/"
        className="self-start text-sm font-medium uppercase tracking-wider transition-colors hover:opacity-80"
        style={{ color: 'hsl(260, 100%, 80%)' }}
      >
        ← Back to Lobby
      </Link>

      <h1
        className="text-3xl font-bold text-center uppercase tracking-wider"
        style={{ color: 'hsl(142, 76%, 70%)' }}
      >
        Anti-Flag Chess Timer
      </h1>
      <p
        className="text-center max-w-md uppercase tracking-wide text-sm"
        style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.8 }}
      >
        Configure your timer for in-person play
      </p>

      <div className="w-full max-w-md space-y-6">
        {/* Time per Turn */}
        <div
          className="p-5"
          style={{
            clipPath: BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(240, 30%, 18%), hsl(260, 35%, 25%))',
            border: '2px solid hsl(260, 35%, 35%)',
            boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.2)',
          }}
        >
          <IrlTurnTimeSlider
            value={session.config.turnTimeSeconds}
            onChange={setTurnTime}
          />
        </div>

        {/* Sound Toggle */}
        <div
          className="p-5"
          style={{
            clipPath: BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(240, 30%, 18%), hsl(260, 35%, 25%))',
            border: '2px solid hsl(260, 35%, 35%)',
            boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.2)',
          }}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(260, 100%, 80%)' }}
              >
                Sound Alerts
              </span>
              <p
                className="text-xs mt-1 uppercase tracking-wide"
                style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.6 }}
              >
                Audio cues in final 3 seconds
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={session.config.soundEnabled}
              onClick={() => setSoundEnabled(!session.config.soundEnabled)}
              className="relative inline-flex h-7 w-14 items-center transition-all duration-100"
              style={{
                clipPath: SMALL_BEVEL_CLIP,
                background: session.config.soundEnabled
                  ? 'linear-gradient(135deg, hsl(142, 50%, 30%), hsl(142, 45%, 40%))'
                  : 'linear-gradient(135deg, hsl(240, 20%, 25%), hsl(240, 20%, 30%))',
                border: `2px solid ${session.config.soundEnabled ? 'hsl(142, 50%, 50%)' : 'hsl(240, 20%, 40%)'}`,
              }}
            >
              <span
                className="h-4 w-4 transform transition-transform duration-100"
                style={{
                  clipPath: SMALL_BEVEL_CLIP,
                  backgroundColor: session.config.soundEnabled ? 'hsl(142, 76%, 70%)' : 'hsl(260, 100%, 80%)',
                  transform: session.config.soundEnabled ? 'translateX(30px)' : 'translateX(4px)',
                }}
              />
            </button>
          </label>
        </div>

        {/* Sound Type Selector (only visible when sound enabled) */}
        {session.config.soundEnabled && (
          <div
            className="p-5"
            style={{
              clipPath: BEVEL_CLIP,
              background: 'linear-gradient(135deg, hsl(240, 30%, 18%), hsl(260, 35%, 25%))',
              border: '2px solid hsl(260, 35%, 35%)',
              boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(260, 100%, 80%)' }}
              >
                Sound Type
              </span>
              <button
                type="button"
                onClick={handlePreviewSound}
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 transition-all duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{
                  clipPath: SMALL_BEVEL_CLIP,
                  background: 'linear-gradient(135deg, hsl(190, 40%, 20%), hsl(190, 40%, 28%))',
                  border: '1px solid hsl(190, 100%, 70%)',
                  color: 'hsl(190, 100%, 70%)',
                  boxShadow: '2px 2px 0 hsla(190, 100%, 70%, 0.3)',
                }}
              >
                Preview
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SOUND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSoundType(option.value)}
                  className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-100"
                  style={{
                    clipPath: SMALL_BEVEL_CLIP,
                    background: session.config.soundType === option.value
                      ? 'linear-gradient(135deg, hsl(142, 50%, 25%), hsl(142, 45%, 32%))'
                      : 'linear-gradient(135deg, hsl(240, 25%, 20%), hsl(240, 25%, 25%))',
                    border: `2px solid ${session.config.soundType === option.value ? 'hsl(142, 50%, 50%)' : 'hsl(240, 20%, 35%)'}`,
                    color: session.config.soundType === option.value ? 'hsl(142, 76%, 70%)' : 'hsl(260, 100%, 80%)',
                    boxShadow: session.config.soundType === option.value
                      ? '3px 3px 0 hsla(142, 76%, 70%, 0.2)'
                      : '2px 2px 0 hsla(260, 100%, 80%, 0.1)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grace Period Setting */}
        <div
          className="p-5"
          style={{
            clipPath: BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(240, 30%, 18%), hsl(260, 35%, 25%))',
            border: '2px solid hsl(260, 35%, 35%)',
            boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.2)',
          }}
        >
          <div className="mb-3">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(260, 100%, 80%)' }}
            >
              Grace Period
            </span>
            <p
              className="text-xs mt-1 uppercase tracking-wide"
              style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.6 }}
            >
              Extra time after timer expires
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {GRACE_PERIOD_OPTIONS.map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => setGracePeriod(seconds as GracePeriodSeconds)}
                className="px-3 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-100"
                style={{
                  clipPath: SMALL_BEVEL_CLIP,
                  background: session.config.gracePeriodSeconds === seconds
                    ? 'linear-gradient(135deg, hsl(142, 50%, 25%), hsl(142, 45%, 32%))'
                    : 'linear-gradient(135deg, hsl(240, 25%, 20%), hsl(240, 25%, 25%))',
                  border: `2px solid ${session.config.gracePeriodSeconds === seconds ? 'hsl(142, 50%, 50%)' : 'hsl(240, 20%, 35%)'}`,
                  color: session.config.gracePeriodSeconds === seconds ? 'hsl(142, 76%, 70%)' : 'hsl(260, 100%, 80%)',
                  boxShadow: session.config.gracePeriodSeconds === seconds
                    ? '3px 3px 0 hsla(142, 76%, 70%, 0.2)'
                    : '2px 2px 0 hsla(260, 100%, 80%, 0.1)',
                }}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        {/* Timeout Behavior Setting */}
        <div
          className="p-5"
          style={{
            clipPath: BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(240, 30%, 18%), hsl(260, 35%, 25%))',
            border: '2px solid hsl(260, 35%, 35%)',
            boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.2)',
          }}
        >
          <div className="mb-3">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(260, 100%, 80%)' }}
            >
              After Grace Expires
            </span>
            <p
              className="text-xs mt-1 uppercase tracking-wide"
              style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.6 }}
            >
              What happens when grace period ends
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setTimeoutBehavior('continue')}
              className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-100"
              style={{
                clipPath: SMALL_BEVEL_CLIP,
                background: session.config.timeoutBehavior === 'continue'
                  ? 'linear-gradient(135deg, hsl(142, 50%, 25%), hsl(142, 45%, 32%))'
                  : 'linear-gradient(135deg, hsl(240, 25%, 20%), hsl(240, 25%, 25%))',
                border: `2px solid ${session.config.timeoutBehavior === 'continue' ? 'hsl(142, 50%, 50%)' : 'hsl(240, 20%, 35%)'}`,
                color: session.config.timeoutBehavior === 'continue' ? 'hsl(142, 76%, 70%)' : 'hsl(260, 100%, 80%)',
                boxShadow: session.config.timeoutBehavior === 'continue'
                  ? '3px 3px 0 hsla(142, 76%, 70%, 0.2)'
                  : '2px 2px 0 hsla(260, 100%, 80%, 0.1)',
              }}
            >
              Continue Playing
            </button>
            <button
              type="button"
              onClick={() => setTimeoutBehavior('pause')}
              className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-100"
              style={{
                clipPath: SMALL_BEVEL_CLIP,
                background: session.config.timeoutBehavior === 'pause'
                  ? 'linear-gradient(135deg, hsl(142, 50%, 25%), hsl(142, 45%, 32%))'
                  : 'linear-gradient(135deg, hsl(240, 25%, 20%), hsl(240, 25%, 25%))',
                border: `2px solid ${session.config.timeoutBehavior === 'pause' ? 'hsl(142, 50%, 50%)' : 'hsl(240, 20%, 35%)'}`,
                color: session.config.timeoutBehavior === 'pause' ? 'hsl(142, 76%, 70%)' : 'hsl(260, 100%, 80%)',
                boxShadow: session.config.timeoutBehavior === 'pause'
                  ? '3px 3px 0 hsla(142, 76%, 70%, 0.2)'
                  : '2px 2px 0 hsla(260, 100%, 80%, 0.1)',
              }}
            >
              Pause Game
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full px-6 py-5 font-bold uppercase tracking-widest text-lg transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
          style={{
            clipPath: BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(142, 50%, 28%), hsl(142, 45%, 38%))',
            border: '2px solid hsl(142, 50%, 50%)',
            color: '#fff',
            boxShadow: '6px 6px 0 hsla(142, 76%, 70%, 0.3)',
          }}
        >
          Start Timer
        </button>
      </div>

      <div
        className="text-xs text-center max-w-md mt-4 uppercase tracking-wider"
        style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.6 }}
      >
        <p>White always goes first. Tap your timer area to end your turn.</p>
      </div>
    </div>
  );
}
