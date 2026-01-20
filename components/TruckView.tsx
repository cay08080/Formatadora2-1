import React from 'react';
import { Layer, ProcessedSlot } from '../types.ts';
import { LayoutGrid, ArrowLeftRight, Ruler } from 'lucide-react';

interface Props {
  layers: Layer[];
  maxWidth: number;
}

export const TruckView: React.FC<Props> = ({ layers, maxWidth }) => {
  const scaleX = 2.8;

  return (
    <div className="space-y-12">
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tighter">Vista Transversal (Corte A-A)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geometria de Pirâmide com Calçamento Técnico</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-amber-50 px-4 py-2 rounded-full border border-amber-100 flex items-center gap-2">
               <Ruler size={14} className="text-amber-600" />
               <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Nivelamento por Calço</span>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 flex items-center gap-2">
               <ArrowLeftRight size={14} className="text-blue-600" />
               <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Gaps Dimensionados</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto pb-16 flex flex-col items-center custom-scrollbar">
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="flex justify-between text-[10px] text-slate-400 font-black mb-6 border-b-2 border-slate-100 pb-2 uppercase tracking-tighter"
          >
            <span>- {maxWidth/2} cm</span>
            <span>Eixo Central (0)</span>
            <span>+ {maxWidth/2} cm</span>
          </div>

          {/* Carroceria / Base do Veículo */}
          <div 
            style={{ width: `${maxWidth * scaleX}px` }} 
            className="border-x-[12px] border-b-[24px] border-slate-300 rounded-b-[48px] relative bg-[#fcfdfe] min-h-[450px] flex flex-col-reverse items-center p-8 shadow-inner"
          >
            {layers.map((layer, lIdx) => {
              const totalSlotsWidth = layer.slots.reduce((sum, s) => sum + s.width, 0);
              const numGaps = layer.slots.length - 1;
              const effectiveGap = numGaps > 0 ? (layer.totalWidth - totalSlotsWidth) / numGaps : 0;

              return (
                <div key={lIdx} className="flex flex-col items-center shrink-0 w-full">
                  {/* FEIXES DA CAMADA (No Topo do sub-container) */}
                  <div className="flex justify-center items-end mb-0 w-full transition-all duration-500">
                    {layer.slots.map((slot, sIdx) => {
                      const shimHeight = layer.maxHeight - slot.height;
                      
                      return (
                        <React.Fragment key={sIdx}>
                          <div className="flex flex-col items-center">
                            {/* Feixe Principal */}
                            <div 
                              style={{ 
                                width: `${slot.width * scaleX}px`, 
                                height: `${slot.height * scaleX}px` 
                              }}
                              className={`relative rounded-lg border-[1.5px] flex flex-col items-center justify-center transition-all group shrink-0 shadow-md overflow-hidden z-20
                                ${slot.priority <= 2 ? 'bg-[#0033a0] border-[#00227a] text-white' : 
                                  slot.priority <= 5 ? 'bg-[#1e40af] border-[#1e3a8a] text-white' : 
                                  'bg-slate-300 border-slate-400 text-slate-700'}`}
                            >
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pointer-events-none">
                                <span className="text-[8px] font-black leading-none mb-0.5 drop-shadow-md truncate w-full text-center">
                                  {slot.beams[0].bitola}
                                </span>
                                <span className="text-[6px] font-bold uppercase tracking-tighter opacity-70">P{slot.priority}</span>
                              </div>

                              {/* Tooltip */}
                              <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-4 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none z-30 whitespace-nowrap shadow-2xl border border-white/10 transition-all scale-90 group-hover:scale-100 backdrop-blur-md">
                                <p className="font-black text-blue-400 mb-1">{slot.beams[0].bitola}</p>
                                <p className="font-bold opacity-80 uppercase tracking-widest text-[8px]">Dimensões: {slot.width}x{slot.height} cm</p>
                                <p className="font-bold text-emerald-400 uppercase tracking-widest text-[8px] mt-1">Peso: {(slot.weight * 1000).toFixed(0)} kg</p>
                              </div>
                            </div>

                            {/* Calçamento (Shim) - Agora liga o feixe à madeira abaixo */}
                            {shimHeight > 0 && (
                              <div 
                                style={{ 
                                  width: `${(slot.width * 0.7) * scaleX}px`, 
                                  height: `${shimHeight * scaleX}px` 
                                }}
                                className="bg-[#6b3e23] border-x border-black/20 shadow-inner flex items-center justify-center relative group/shim z-10"
                              >
                                <span className="absolute right-full mr-2 text-[7px] font-black text-amber-800 uppercase whitespace-nowrap opacity-0 group-hover/shim:opacity-100 transition-opacity">
                                  +{shimHeight.toFixed(1)}cm
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Gap Lateral */}
                          {sIdx < layer.slots.length - 1 && effectiveGap > 0 && (
                            <div 
                              style={{ width: `${effectiveGap * scaleX}px` }}
                              className="flex flex-col items-center justify-center group relative h-4 self-center"
                            >
                              <div className="w-full border-b border-blue-400/40 border-dashed"></div>
                              <span className="absolute -top-4 text-[7px] font-black text-blue-500 whitespace-nowrap bg-white/80 px-1 rounded transition-all group-hover:bg-blue-600 group-hover:text-white z-20">
                                {effectiveGap.toFixed(1)}cm
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* MADEIRAMENTO (Sempre na Base do sub-container da camada) */}
                  <div 
                    style={{ width: `${layer.totalWidth * scaleX}px` }}
                    className="h-3.5 bg-[#54301d] rounded-sm shadow-sm border-y border-black/10 opacity-95 z-0"
                  ></div>
                </div>
              );
            })}
            
            {/* Rodas Robustas (Vistas de frente - Retângulos Arredondados) */}
            <div className="absolute -bottom-16 left-12 w-14 h-24 bg-[#1a1a1a] rounded-xl border-x-[6px] border-slate-700 shadow-2xl flex flex-col justify-between py-4">
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
            </div>
            <div className="absolute -bottom-16 left-28 w-14 h-24 bg-[#1a1a1a] rounded-xl border-x-[6px] border-slate-700 shadow-2xl flex flex-col justify-between py-4">
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
            </div>
            
            <div className="absolute -bottom-16 right-12 w-14 h-24 bg-[#1a1a1a] rounded-xl border-x-[6px] border-slate-700 shadow-2xl flex flex-col justify-between py-4">
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
            </div>
            <div className="absolute -bottom-16 right-28 w-14 h-24 bg-[#1a1a1a] rounded-xl border-x-[6px] border-slate-700 shadow-2xl flex flex-col justify-between py-4">
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
               <div className="h-[2px] w-full bg-slate-800"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Planta de Carga */}
      <div className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tighter">Planta de Carga (Vista Superior)</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gaps e Calçamentos em Planta</p>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto pb-6 custom-scrollbar">
          <div 
            style={{ width: '850px', minHeight: '450px' }}
            className="mx-auto border-[16px] border-slate-100 rounded-[56px] relative bg-[#f8fafc] p-10 flex flex-col gap-5 shadow-inner"
          >
            {layers.length > 0 ? (
              layers.slice().reverse().map((layer, lIdx) => {
                const totalSlotsWidth = layer.slots.reduce((sum, s) => sum + s.width, 0);
                const numGaps = layer.slots.length - 1;
                const effectiveGap = numGaps > 0 ? (layer.totalWidth - totalSlotsWidth) / numGaps : 0;

                return (
                  <div key={lIdx} className="flex flex-col gap-2.5 bg-white/60 p-6 rounded-[36px] border border-slate-200/50 items-center shadow-sm relative">
                    <div className="flex items-center justify-between w-full mb-2 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Camada Nível {layers.length - layer.index}</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Ocupação: {layer.totalWidth} cm</span>
                        {effectiveGap > 0 && (
                          <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1">
                            <ArrowLeftRight size={10} /> Gap {effectiveGap.toFixed(1)} cm
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full items-center">
                      {layer.slots.map((slot, sIdx) => {
                        const hasShim = layer.maxHeight - slot.height > 0;
                        const shimVal = layer.maxHeight - slot.height;

                        return (
                          <React.Fragment key={sIdx}>
                            <div 
                              className={`flex gap-2 shrink-0 h-11 w-full justify-center relative ${hasShim ? 'ring-2 ring-amber-500/20 rounded-xl' : ''}`}
                              style={{ maxWidth: `${(slot.width / maxWidth) * 100}%` }}
                            >
                              {slot.isPaired ? (
                                <>
                                  <div className="h-full w-1/2 bg-blue-600 border-2 border-blue-800 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-2 relative">
                                    <span className="text-[8px] text-white font-black truncate w-full text-center">{slot.beams[0].bitola}</span>
                                    {hasShim && <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-bl-lg shadow-sm"></div>}
                                  </div>
                                  <div className="h-full w-1/2 bg-blue-600 border-2 border-blue-800 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-2 relative">
                                    <span className="text-[8px] text-white font-black truncate w-full text-center">{slot.beams[1]?.bitola || slot.beams[0].bitola}</span>
                                    {hasShim && <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-bl-lg shadow-sm"></div>}
                                  </div>
                                </>
                              ) : (
                                <div className="h-full w-full bg-[#0033a0] border-2 border-[#00227a] rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden hover:brightness-110 transition-all px-4 relative">
                                  <span className="text-[9px] text-white font-black tracking-widest uppercase truncate w-full text-center">{slot.beams[0].bitola}</span>
                                  {hasShim && (
                                    <div className="absolute top-1 right-1 flex items-center gap-1 bg-amber-500 text-white px-1.5 rounded-md text-[6px] font-black">
                                      CALÇO {shimVal.toFixed(0)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {sIdx < layer.slots.length - 1 && effectiveGap > 0 && (
                              <div className="w-full h-2 flex items-center justify-center opacity-30">
                                 <div className="w-full border-t border-blue-400 border-dashed"></div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-slate-200 uppercase font-black italic tracking-[0.5em] gap-6">
                <LayoutGrid size={64} className="opacity-10" />
                Aguardando Dados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};