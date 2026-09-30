import React, { useState } from 'react';
import { ProjectRecord, CompanyRecord } from '../../types';
import { Layers, MapPin, Zap, ShieldAlert, ExternalLink, Radio, Eye } from 'lucide-react';

interface GeospatialMapProps {
  projects: ProjectRecord[];
  companies: CompanyRecord[];
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  onOpenEvidence: (evidenceId: string) => void;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  projects,
  companies,
  selectedProjectId,
  onSelectProject,
  onOpenEvidence,
}) => {
  // Layer visibility toggles
  const [showSubstations, setShowSubstations] = useState(true);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showUtilityZones, setShowUtilityZones] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // California Bounding Box for projection
  // Lat: 32.5 (South) to 42.0 (North) -> Span: 9.5 deg
  // Lng: -124.5 (West) to -114.0 (East) -> Span: 10.5 deg
  const projectToSvg = (lat: number, lng: number) => {
    const minLat = 32.5;
    const maxLat = 42.0;
    const minLng = -124.5;
    const maxLng = -114.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 600;
    // Invert y because SVG y=0 is top
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;

    return { x, y };
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeCompany = companies.find((c) => c.id === activeProject?.developerCompanyId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col lg:flex-row">
      {/* Map Canvas / SVG Viewport */}
      <div className="relative flex-1 bg-[#090D16] min-h-[460px] flex items-center justify-center p-2 select-none overflow-hidden">
        {/* Subtle coordinate grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* GIS HUD Header Bar */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="bg-slate-950/90 backdrop-blur-xs border border-slate-700/80 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-md">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>CAISO HIGH-VOLTAGE TRANSMISSION GIS</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
            EPSG:3857 · PostGIS Geometry
          </span>
        </div>

        {/* Map Layer Controls in Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-1.5 bg-slate-950/90 backdrop-blur-xs border border-slate-800 p-1 rounded-md text-[11px] font-mono text-slate-300">
          <button
            onClick={() => setShowUtilityZones(!showUtilityZones)}
            className={`px-2 py-0.5 rounded transition-colors ${
              showUtilityZones ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            PTO Zones
          </button>
          <button
            onClick={() => setShowSubstations(!showSubstations)}
            className={`px-2 py-0.5 rounded transition-colors ${
              showSubstations ? 'bg-amber-900/60 text-amber-200 font-semibold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            230/500kV Grid
          </button>
          <button
            onClick={() => setShowConstraints(!showConstraints)}
            className={`px-2 py-0.5 rounded transition-colors ${
              showConstraints ? 'bg-emerald-900/60 text-emerald-200 font-semibold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Environmental Hazards
          </button>
        </div>

        {/* SVG California Boundary & Projects Map */}
        <svg
          viewBox="0 0 600 600"
          className="w-full max-w-[560px] h-[450px] transition-all"
        >
          <defs>
            {/* Glow filters for high-voltage transmission lines */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="pge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="sce-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* California State Boundary Polygon Path */}
          <path
            d="M 230 40 
               L 410 40 
               L 410 240 
               L 550 480 
               L 520 540 
               L 450 560 
               L 370 530 
               L 320 490 
               L 260 450 
               L 200 370 
               L 160 300 
               L 145 220 
               L 175 140 
               L 230 40 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="none"
          />

          {/* Utility PTO Territory Polygons */}
          {showUtilityZones && (
            <g id="utility-zones">
              {/* PG&E Territory (Northern & Central CA) */}
              <path
                d="M 230 40 L 410 40 L 410 240 L 320 310 L 220 330 L 160 300 L 145 220 L 175 140 Z"
                fill="url(#pge-grad)"
                stroke="#0284c7"
                strokeWidth="0.8"
                strokeDasharray="4 2"
                opacity="0.7"
              />
              <text x="250" y="160" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" opacity="0.6">
                PG&E TRANSMISSION ZONE
              </text>

              {/* SCE Territory (Southern CA / Desert) */}
              <path
                d="M 320 310 L 410 240 L 550 480 L 450 560 L 370 530 L 320 490 L 260 450 L 220 330 Z"
                fill="url(#sce-grad)"
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeDasharray="4 2"
                opacity="0.7"
              />
              <text x="350" y="380" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono" opacity="0.6">
                SCE TRANSMISSION ZONE
              </text>
            </g>
          )}

          {/* Major High-Voltage Backbone Transmission Lines (Schematic Interconnections) */}
          {showSubstations && (
            <g id="transmission-grid" stroke="#eab308" strokeWidth="1.2" opacity="0.65" strokeDasharray="3 3">
              {/* Path connecting Bellota (San Joaquin) -> Whirlwind (Kern) -> Pardee (LA) -> Red Bluff (Riverside) */}
              <line x1="265" y1="230" x2="350" y2="385" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="350" y1="385" x2="335" y2="445" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="350" y1="385" x2="515" y2="470" stroke="#f59e0b" strokeWidth="1.8" />
              {/* Morro Bay line into Mid-Coast bus */}
              <line x1="205" y1="365" x2="350" y2="385" stroke="#f59e0b" strokeWidth="1.2" />

              {/* Substation Nodes */}
              <circle cx="265" cy="230" r="3" fill="#eab308" />
              <text x="272" y="233" fill="#fde047" fontSize="8" fontFamily="JetBrains Mono">Bellota 230kV</text>

              <circle cx="350" cy="385" r="4" fill="#f59e0b" />
              <text x="358" y="388" fill="#fde047" fontSize="8" fontFamily="JetBrains Mono">Whirlwind 230kV</text>

              <circle cx="205" cy="365" r="3" fill="#eab308" />
              <text x="145" y="362" fill="#fde047" fontSize="8" fontFamily="JetBrains Mono">Morro Bay 230kV</text>

              <circle cx="335" cy="445" r="3" fill="#eab308" />
              <text x="270" y="455" fill="#fde047" fontSize="8" fontFamily="JetBrains Mono">Pardee 230kV</text>

              <circle cx="515" cy="470" r="4" fill="#ef4444" />
              <text x="440" y="485" fill="#fca5a5" fontSize="8" fontFamily="JetBrains Mono">Red Bluff 500kV</text>
            </g>
          )}

          {/* Environmental Siting Constraint Zones */}
          {showConstraints && (
            <g id="environmental-hazards" opacity="0.6">
              {/* Riverside Chuckwalla BLM Tortoise Corridor */}
              <ellipse cx="505" cy="460" rx="35" ry="22" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />
              <text x="480" y="440" fill="#6ee7b7" fontSize="7" fontFamily="JetBrains Mono">BLM Tortoise Zone</text>

              {/* Santa Clarita High Fire Hazard Zone */}
              <polygon points="325,435 350,430 345,455 320,450" fill="#f97316" fillOpacity="0.2" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 2" />
              <text x="280" y="435" fill="#fdba74" fontSize="7" fontFamily="JetBrains Mono">CAL FIRE FHSZ</text>

              {/* Morro Bay Coastal Inundation Zone */}
              <circle cx="205" cy="365" r="14" fill="#06b6d4" fillOpacity="0.2" stroke="#0891b2" strokeWidth="1" />
              <text x="140" y="380" fill="#67e8f9" fontSize="7" fontFamily="JetBrains Mono">Coastal Surge Buffer</text>
            </g>
          )}

          {/* 5 Real California BESS Project Markers */}
          {projects.map((proj) => {
            const { x, y } = projectToSvg(proj.coordinates.lat, proj.coordinates.lng);
            const isSelected = activeProject?.id === proj.id;
            const isHovered = hoveredProjectId === proj.id;
            const hasConflict = proj.conflictingFields.length > 0;

            return (
              <g
                key={proj.id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectProject(proj.id)}
                onMouseEnter={() => setHoveredProjectId(proj.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {/* Active selection radar ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="animate-spin origin-center"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}

                {/* Pulse Halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : 8}
                  fill={hasConflict ? '#f59e0b' : '#10b981'}
                  fillOpacity={isSelected ? 0.4 : 0.25}
                  filter="url(#glow-emerald)"
                />

                {/* Center Solid Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5 : 4}
                  fill={hasConflict ? '#fbbf24' : '#34d399'}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />

                {/* Project Tag Label */}
                <text
                  x={x + 10}
                  y={y - 8}
                  fill={isSelected ? '#34d399' : '#f1f5f9'}
                  fontSize={isSelected ? 11 : 9}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="JetBrains Mono"
                  className="select-none filter drop-shadow-md"
                >
                  {proj.name.split(' ')[0]} ({proj.capacityMw}MW)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend in Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-950/90 backdrop-blur-xs border border-slate-800 p-2 rounded text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Verified Standalone BESS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Discrepancy / Handled Conflict</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-500 inline-block border-t border-dashed"></span>
            <span>CAISO 230/500kV Gen-Tie Path</span>
          </div>
        </div>
      </div>

      {/* Right Side: Selected Project Spatial Intelligence Dossier */}
      {activeProject && (
        <div className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between text-slate-200">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-between">
                <span>Selected Spatial Asset</span>
                <span>CAISO Cluster 14</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{activeProject.name}</h3>
              <div className="text-xs text-slate-400 mt-0.5">
                {activeCompany?.displayName} · {activeProject.county}
              </div>
            </div>

            {/* Coordinates & APN Box */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">GPS Coords:</span>
                <span className="text-emerald-400 select-all font-semibold">
                  {activeProject.coordinates.lat.toFixed(4)}, {activeProject.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Parcel APN:</span>
                <span className="text-slate-200 font-semibold">{activeProject.parcelApn || 'Federal BLM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">POI Substation:</span>
                <span className="text-amber-300 font-semibold truncate max-w-[140px]">
                  {activeProject.interconnectionPoint}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balancing Auth:</span>
                <span className="text-slate-200">{activeProject.interconnectionUtility}</span>
              </div>
            </div>

            {/* Capacity Specs */}
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                <div className="text-[10px] uppercase text-slate-400">Power Rating</div>
                <div className="text-base font-bold text-white mt-0.5">{activeProject.capacityMw} MW</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                <div className="text-[10px] uppercase text-slate-400">Storage Energy</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{activeProject.energyMwh} MWh</div>
              </div>
            </div>

            {/* Environmental & Siting Signals */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                Siting & Diligence Signals
              </div>
              <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 leading-relaxed">
                {activeProject.permittingStage}
              </div>
            </div>

            {/* Conflict Callout if applicable */}
            {activeProject.conflictingFields.length > 0 && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-600/60 rounded text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1 font-bold text-[11px] text-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Conflicting Queue/EIR Record</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {activeProject.conflictingFields[0].description}
                </p>
              </div>
            )}
          </div>

          {/* Action to Inspect Evidence in Drawer */}
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <button
              onClick={() => onOpenEvidence(activeProject.evidenceIds[0])}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Inspect Source Evidence In Drawer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
