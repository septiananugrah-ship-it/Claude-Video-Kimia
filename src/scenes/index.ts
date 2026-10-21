import type React from 'react';
import {Co2} from './Co2';
import {Frequency} from './Frequency';
import {Ftir} from './Ftir';
import {Hook} from './Hook';
import {Industry} from './Industry';
import {Ladder} from './Ladder';
import {Landscape} from './Landscape';
import {Light} from './Light';
import {Outro} from './Outro';
import {PePet} from './PePet';
import {Recap} from './Recap';
import {Spectrum} from './Spectrum';
import {Spring} from './Spring';
import {Title} from './Title';
import {Wave} from './Wave';
import {Zoom} from './Zoom';
import {Zpe} from './Zpe';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  zoom: Zoom,
  spring: Spring,
  frequency: Frequency,
  landscape: Landscape,
  ladder: Ladder,
  wave: Wave,
  zpe: Zpe,
  light: Light,
  co2: Co2,
  ftir: Ftir,
  spectrum: Spectrum,
  pepet: PePet,
  industry: Industry,
  recap: Recap,
  outro: Outro,
};
