import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleCategory } from '../../types';
import {
  Building2,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Mail,
  Linkedin,
  Globe,
  CheckCircle,
  Compass,
  Radar,
} from 'lucide-react';

export const CompaniesContactsView: React.FC = () => {
  const { companies, contacts, projects, opportunities, setActiveTab } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contacts' | 'companies'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const roleCategories: RoleCategory[] = [
    'Development',
    'Project Development',
    'Origination',
    'Site Acquisition',
    'Interconnection',
    'Senior Leadership',
  ];

  const filteredContacts = contacts.filter((c) => {
    const comp = companies.find((co) => co.id === c.companyId);
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp?.displayName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || c.roleCategory === roleFilter;

    return matchesSearch && matchesRole;
  });

  const filteredCompanies = companies.filter((comp) => {
    return (
      comp.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.relevanceRationale.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Commercial Entities & Verified Siting Decision Makers</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Companies & Contacts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly professional, verified BESS infrastructure leadership with source provenance and deliverability checks.
          </p>
        </div>

        {/* Search & Sub-tab Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contact, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0B1424] border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-slate-500 w-52 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#070D18] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('contacts')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'contacts'
                  ? 'bg-[#0B1424] text-white font-semibold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('companies')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'companies'
                  ? 'bg-[#0B1424] text-white font-semibold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Companies ({companies.length})
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab 1: Contacts Directory */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-4">
          {/* Role Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            <span className="text-xs text-slate-400 font-mono mr-1">Filter Role:</span>
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                roleFilter === 'ALL'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-[#0B1424] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All Roles
            </button>
            {roleCategories.map((rc) => (
              <button
                key={rc}
                onClick={() => setRoleFilter(rc)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  roleFilter === rc
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-[#0B1424] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {rc}
              </button>
            ))}
          </div>

          {/* Contacts Table / Grid */}
          <div className="bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl shadow-black/20 divide-y divide-slate-800/80">
            {filteredContacts.map((contact) => {
              const company = companies.find((c) => c.id === contact.companyId);
              const opp = opportunities.find((o) => o.id === contact.associatedOpportunityId);
              const project = projects.find((p) => p.id === opp?.projectId);

              return (
                <div
                  key={contact.id}
                  className="p-5 hover:bg-slate-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{contact.name}</span>
                      <span className="font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 font-semibold text-[10px]">
                        {contact.roleCategory}
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium flex items-center gap-2">
                      <span>{contact.title}</span>
                      <span>·</span>
                      <span className="font-bold text-white">{company?.displayName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-400 pt-1">
                      <span className="font-mono font-medium text-slate-200 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {contact.businessEmail}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {contact.emailVerificationStatus}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        {contact.verificationProvider} ({contact.emailVerifiedDate})
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] pt-1">
                      <span className="font-medium text-slate-300">Provenance: </span>
                      {contact.provenance}
                    </div>
                  </div>

                  {/* Association & Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    {project && (
                      <div className="text-left sm:text-right">
                        <div className="text-[11px] text-slate-500 font-mono">Linked Opportunity</div>
                        <div className="font-semibold text-white">{project.name}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">
                          Stage: {opp?.stage}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {contact.linkedinUrl && (
                        <a
                          href={contact.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-white bg-[#070D18] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setActiveTab('outreach')}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-mono"
                      >
                        Prepare Outreach
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Verified Companies */}
      {activeSubTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((comp) => {
            const associatedProjects = projects.filter((p) => comp.associatedProjectIds.includes(p.id));

            return (
              <div
                key={comp.id}
                className="bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl shadow-black/20"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      {comp.id}
                    </span>
                    <a
                      href={`https://${comp.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{comp.domain}</span>
                    </a>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{comp.displayName}</h3>
                  <div className="text-xs text-slate-400 font-medium">{comp.legalName}</div>
                  {comp.parentCompany && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      Parent: <span className="font-semibold text-slate-300">{comp.parentCompany}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 font-mono text-[11px] uppercase">Relevance to Revenue:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{comp.relevanceRationale}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 font-mono text-[11px] uppercase">Associated BESS Pipeline:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {associatedProjects.map((p) => (
                        <span
                          key={p.id}
                          className="font-mono text-[11px] bg-[#070D18] text-slate-200 px-2 py-0.5 rounded border border-slate-700"
                        >
                          {p.name} ({p.capacityMw} MW)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider mb-0.5">
                      Filing Provenance
                    </span>
                    <p className="text-slate-400 text-[11px] font-mono">{comp.provenance}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
