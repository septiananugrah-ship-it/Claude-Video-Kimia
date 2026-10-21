import React from 'react';
import {Composition, Folder} from 'remotion';
import {SidikJariMolekul, SingleScene, defaultVideoProps} from './Composition';
import {FPS, TIMELINE, TOTAL_FRAMES} from './timeline.ts';
import './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SidikJariMolekul"
      component={SidikJariMolekul}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={TOTAL_FRAMES}
      defaultProps={defaultVideoProps}
    />
    <Folder name="Adegan">
      {TIMELINE.scenes.map((s) => (
        <Composition
          key={s.id}
          id={`Adegan-${String(s.index).padStart(2, '0')}-${s.id}`}
          component={SingleScene}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={Math.round(s.duration * FPS)}
          defaultProps={{sceneId: s.id}}
        />
      ))}
    </Folder>
  </>
);
