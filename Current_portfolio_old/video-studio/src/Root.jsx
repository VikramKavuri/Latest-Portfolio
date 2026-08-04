import React from 'react';
import {Composition} from 'remotion';
import {AtliqSalesHook} from './compositions/AtliqSalesHook';
import {CpuMonitorHook} from './compositions/CpuMonitorHook';
import {GraphRagHook} from './compositions/GraphRagHook';
import {HipaaSafeHook} from './compositions/HipaaSafeHook';
import {JobSearchMcpHook} from './compositions/JobSearchMcpHook';
import {LakehouseHook} from './compositions/LakehouseHook';
import {N8nOutreachHook} from './compositions/N8nOutreachHook';
import {TelcoChurnHook} from './compositions/TelcoChurnHook';
import {VoiceFlowHook} from './compositions/VoiceFlowHook';

export const VideoRoot = () => (
  <>
    <Composition
      id="HipaaSafeHook"
      component={HipaaSafeHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="GraphRagHook"
      component={GraphRagHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="LakehouseHook"
      component={LakehouseHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="JobSearchMcpHook"
      component={JobSearchMcpHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="AtliqSalesHook"
      component={AtliqSalesHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="CpuMonitorHook"
      component={CpuMonitorHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="N8nOutreachHook"
      component={N8nOutreachHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="TelcoChurnHook"
      component={TelcoChurnHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
    <Composition
      id="VoiceFlowHook"
      component={VoiceFlowHook}
      durationInFrames={270}
      fps={30}
      width={900}
      height={460}
    />
  </>
);
