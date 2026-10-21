import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Arrow, Card, DrawPath, Label, Stage, V} from '../components/primitives';
import {absorbance, Fingerprint, GENERIC_PEAKS, nuToX, spectrumPath, SpectrumAxes, type PlotBox} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const BOX: PlotBox = {x: 260, y: 270, w: 1400, h: 440};

const Region: React.FC<{from: number; to: number; color: string; p: number; label: string; sub?: string; labelY?: number}> = ({from, to, color, p, label, sub, labelY = 230}) => {
  if (p <= 0) return null;
  const x0 = nuToX(BOX, from);
  const x1 = nuToX(BOX, to);
  const h = BOX.h * p;
  return (
    <g opacity={p}>
      <rect x={x0} y={BOX.y + BOX.h - h} width={x1 - x0} height={h} fill={color} opacity={0.13} />
      <line x1={x0} y1={BOX.y} x2={x0} y2={BOX.y + BOX.h} stroke={color} strokeOpacity={0.5} strokeDasharray="6 8" />
      <line x1={x1} y1={BOX.y} x2={x1} y2={BOX.y + BOX.h} stroke={color} strokeOpacity={0.5} strokeDasharray="6 8" />
      <Label x={(x0 + x1) / 2} y={labelY} size={30} color={color} weight={700}>
        {label}
      </Label>
      {sub ? (
        <Label x={(x0 + x1) / 2} y={labelY + 34} size={22} color={C.muted}>
          {sub}
        </Label>
      ) : null}
    </g>
  );
};

export const Spectrum: React.FC = () => {
  const {t, cue} = useScene();
  const axes = ramp(t, cue(0) - 0.3, cue(0) + 1.5, EASE_IN_OUT);
  const curve = ramp(t, cue(0) + 1.2, cue(1) + 1.5, EASE_IN_OUT);
  const energy = ramp(t, cue(1) + 0.3, cue(1) + 1.2);
  const xh = ramp(t, cue(2), cue(2) + 0.9, EASE_IN_OUT);
  const co = ramp(t, cue(3), cue(3) + 0.9, EASE_IN_OUT);
  const fp = ramp(t, cue(4), cue(4) + 1.1, EASE_IN_OUT);
  const pulse = ramp(t, cue(5), cue(5) + 0.6);

  const topShift = energy * (1 - ramp(t, cue(2) - 0.4, cue(2)));
  const peakY = (nu: number) => BOX.y + BOX.h - Math.min(1.08, absorbance(GENERIC_PEAKS, nu)) * BOX.h * 0.88;

  return (
    <AbsoluteFill>
      <Stage>
        <SpectrumAxes box={BOX} p={axes} ticks={[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500]} />
        <Region from={3700} to={2700} color={C.cyan} p={xh} label="X–H" sub="O–H, C–H" />
        <Region from={1820} to={1640} color={C.gold} p={co} label="C=O" sub="karbonil" labelY={180} />
        <Region from={1500} to={400} color={C.violet} p={fp} label="wilayah sidik jari" sub="< 1500 cm⁻¹" />
        <g opacity={fp * 0.5}>
          <clipPath id="fpclip">
            <rect x={nuToX(BOX, 1500)} y={BOX.y} width={nuToX(BOX, 400) - nuToX(BOX, 1500)} height={BOX.h} />
          </clipPath>
          <g clipPath="url(#fpclip)">
            <Fingerprint x={nuToX(BOX, 950)} y={BOX.y + BOX.h * 0.55} scale={1.1} p={fp} color={C.violet} width={2} glow={false} opacity={0.5} />
          </g>
        </g>
        <DrawPath d={spectrumPath(BOX, GENERIC_PEAKS)} p={curve} stroke={C.ink} width={4} len={6000} />
        <g opacity={co}>
          <circle cx={nuToX(BOX, 1715)} cy={peakY(1715)} r={14 + 4 * Math.sin(t * 6)} fill="none" stroke={C.gold} strokeWidth={4} filter="url(#glow)" />
        </g>
        <g opacity={pulse}>
          {[1460, 1280, 1170, 1050, 880, 760].map((nu, i) => (
            <circle key={nu} cx={nuToX(BOX, nu)} cy={peakY(nu)} r={9} fill={C.violet} opacity={0.5 + 0.5 * Math.sin(t * 5 + i)} filter="url(#glow)" />
          ))}
        </g>
        {/* energi */}
        <g opacity={topShift}>
          <Arrow x1={1200} y1={215} x2={420} y2={215} color="gold" width={5} />
          <Label x={810} y={180} size={28} color={C.gold} weight={600}>
            energi lebih tinggi · getaran lebih cepat
          </Label>
        </g>
      </Stage>
      <Card x={1650} y={200} opacity={topShift} accent={C.gold} anchor="right">
        <div style={{fontSize: 40}}>
          <V color={C.gold}>ν̃</V> = 1/<V>λ</V> ∝ <V>E</V>
        </div>
      </Card>
      <Card x={nuToX(BOX, 950)} y={140} opacity={pulse} scale={0.85 + 0.15 * ramp(t, cue(5), cue(5) + 0.6, BACK)} accent={C.violet}>
        <div style={{fontSize: 26}}>
          pola <span style={{color: C.violet, fontWeight: 600}}>khas</span> tiap senyawa
        </div>
      </Card>
    </AbsoluteFill>
  );
};
