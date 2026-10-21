import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {C, FONT} from '../theme';
import {TIMELINE} from '../timeline.ts';

const TOTAL_CHAPTERS = TIMELINE.scenes.filter((s) => s.chapter).length;

export const ChapterHeading: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scene = TIMELINE.scenes.find((s) => t >= s.start && t < s.end);
  if (!scene || !scene.chapter) return null;
  const lt = t - scene.start;
  const out = 1 - ramp(lt, scene.duration - 0.9, scene.duration - 0.2, EASE_IN_OUT);
  const line = ramp(lt, 0.1, 0.9);
  const progress = Number(scene.chapter) / TOTAL_CHAPTERS;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <div style={{position: 'absolute', left: 96, top: 72, display: 'flex', alignItems: 'center', gap: 22}}>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 22,
            fontWeight: 600,
            color: C.gold,
            letterSpacing: 3,
            opacity: ramp(lt, 0, 0.5),
            translate: `${(1 - ramp(lt, 0, 0.6)) * -20}px 0px`,
          }}
        >
          BAB {scene.chapter}
        </div>
        <div style={{width: 64 * line, height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 32, fontWeight: 600, color: C.ink, display: 'flex', letterSpacing: -0.2}}>
          {scene.title.split('').map((ch, i) => {
            const p = ramp(lt, 0.25 + i * 0.018, 0.65 + i * 0.018);
            return (
              <span key={i} style={{opacity: p, translate: `0px ${(1 - p) * 12}px`, whiteSpace: 'pre', display: 'inline-block'}}>
                {ch}
              </span>
            );
          })}
        </div>
      </div>
      {/* indikator progres bab */}
      <div style={{position: 'absolute', right: 96, top: 84, display: 'flex', gap: 6, opacity: 0.8 * ramp(lt, 0.4, 1)}}>
        {Array.from({length: TOTAL_CHAPTERS}, (_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === Number(scene.chapter) ? 34 : 10,
              height: 4,
              borderRadius: 2,
              background: i + 1 <= progress * TOTAL_CHAPTERS ? C.gold : C.faint,
              opacity: i + 1 === Number(scene.chapter) ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
