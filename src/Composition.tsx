import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, ramp} from './anim';
import {Background, Vignette} from './components/Background';
import {Captions} from './components/Captions';
import {ChapterHeading} from './components/ChapterHeading';
import {POST, PRE, SceneProvider, useScene} from './SceneContext';
import {SCENES} from './scenes';
import {type VideoProps, defaultVideoProps} from './defaults.ts';
import {FPS, TIMELINE, lineKey, type TScene} from './timeline.ts';

export {defaultVideoProps, type VideoProps};


/** Bingkai kamera: dorongan pelan + transisi masuk/keluar sinematik. */
const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {t, dur} = useScene();
  const enter = ramp(t, -PRE, 0.35, EASE_IN_OUT);
  const exit = ramp(t, dur - 0.35, dur + POST, EASE_IN_OUT);
  const push = 1 + 0.03 * (t / Math.max(dur, 1));
  const scale = push * (0.94 + 0.06 * enter) * (1 + 0.07 * exit);
  const blur = 14 * (1 - enter) + 18 * exit;
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        scale: String(scale),
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SceneSlot: React.FC<{scene: TScene}> = ({scene}) => {
  const Comp = SCENES[scene.id];
  const pre = scene.index === 0 ? 0 : PRE;
  const from = Math.round((scene.start - pre) * FPS);
  const isLast = scene.index === TIMELINE.scenes.length - 1;
  const duration = Math.round((scene.duration + pre + (isLast ? 0 : POST)) * FPS);
  if (!Comp) return null;
  return (
    <Sequence name={`${scene.chapter ? scene.chapter + ' · ' : ''}${scene.title}`} from={from} durationInFrames={duration}>
      <SceneProvider scene={scene} pre={pre}>
        <SceneShell>
          <Comp />
        </SceneShell>
      </SceneProvider>
    </Sequence>
  );
};

const MusicFade: React.FC<{volume: number}> = ({volume}) => {
  const {durationInFrames} = useVideoConfig();
  useCurrentFrame();
  return (
    <Audio
      src={staticFile('music.mp3')}
      volume={(f) => volume * Math.min(1, f / 30) * Math.min(1, (durationInFrames - f) / 60)}
    />
  );
};

export const SidikJariMolekul: React.FC<VideoProps> = ({showCaptions, musicVolume, voiceover}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#04060c'}}>
      <Background />
      {TIMELINE.scenes.map((s) => (
        <SceneSlot key={s.id} scene={s} />
      ))}
      <ChapterHeading />
      {showCaptions ? <Captions /> : null}
      <Vignette />
      {musicVolume > 0 ? <MusicFade volume={musicVolume} /> : null}
      {voiceover
        ? TIMELINE.scenes.flatMap((s) =>
            s.tLines.map((l) => (
              <Sequence key={lineKey(s.id, l.index)} name={`VO ${lineKey(s.id, l.index)}`} from={Math.round(l.start * FPS)} layout="none">
                <Audio src={staticFile(`voiceover/${lineKey(s.id, l.index)}.mp3`)} />
              </Sequence>
            )),
          )
        : null}
    </AbsoluteFill>
  );
};

/** Versi 2K (2560×1440): seluruh film 1920×1080 diperbesar sebagai vektor, jadi tetap tajam. */
export const SidikJariMolekul2K: React.FC<VideoProps> = (props) => (
  <AbsoluteFill style={{backgroundColor: '#04060c'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <SidikJariMolekul {...props} />
    </div>
  </AbsoluteFill>
);

/** Pratinjau satu scene saja (folder "Adegan" di Studio). */
export const SingleScene: React.FC<{sceneId: string}> = ({sceneId}) => {
  const scene = TIMELINE.scenes.find((s) => s.id === sceneId)!;
  return (
    <AbsoluteFill style={{backgroundColor: '#04060c'}}>
      <Sequence from={-Math.round(scene.start * FPS)} layout="absolute-fill">
        <Background />
        <SceneSlot scene={scene} />
        <ChapterHeading />
        <Captions />
        <Vignette />
      </Sequence>
    </AbsoluteFill>
  );
};
