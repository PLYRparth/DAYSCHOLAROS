import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-[var(--color-cream)] font-body overflow-hidden relative selection:bg-[var(--color-coral)] selection:text-[var(--color-dark)]">
      
      {/* Soft radial coral glow (top right) */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--color-coral)]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav Bar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8 max-w-7xl mx-auto relative z-10">
        <div className="font-display font-bold text-2xl tracking-tight">DayScholar</div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#modules" className="text-[var(--color-muted)] hover:text-[var(--color-cream)] transition-colors text-sm">Modules</a>
          <a href="#about" className="text-[var(--color-muted)] hover:text-[var(--color-cream)] transition-colors text-sm">About</a>
        </div>
        <Link 
          to="/app" 
          className="bg-[var(--color-coral)] text-[var(--color-dark)] font-medium px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[var(--color-dark)]"
        >
          Get started
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Column */}
          <div className="flex-1 w-full flex flex-col items-start space-y-6">
            
            {/* Live status line */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)] animate-pulse-coral" />
              <span className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Live on 12 campuses</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] tracking-tight">
              Campus life <br />
              doesn't end at <br />
              <span className="text-[var(--color-coral)]">the gate.</span>
            </h1>

            {/* Supporting copy */}
            <p className="text-[var(--color-muted)] text-lg max-w-[280px] leading-relaxed">
              The essential OS for day scholars. Commute, eat, and collaborate off-campus.
            </p>

            {/* CTA */}
            <a 
              href="#modules" 
              className="inline-flex items-center gap-2 border border-[var(--color-coral)] text-[var(--color-coral)] px-6 py-3 rounded-full font-medium hover:bg-[var(--color-coral)]/10 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-2 focus:ring-offset-[var(--color-dark)]"
            >
              See the modules
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Stats Row */}
            <div className="pt-8 mt-4 border-t border-[var(--color-muted)]/20 w-full max-w-sm flex justify-between">
              <div>
                <div className="font-mono text-lg text-[var(--color-cream)]">15+</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">Vendors</div>
              </div>
              <div>
                <div className="font-mono text-lg text-[var(--color-cream)]">300+</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">Subjects</div>
              </div>
              <div>
                <div className="font-mono text-lg text-[var(--color-cream)]">5</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">Modules</div>
              </div>
            </div>
            
          </div>

          {/* Right Column (Pass-card stack) */}
          <div className="flex-1 w-full relative h-[300px] lg:h-[500px] flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            
            {/* The Stack Container */}
            <div className="relative w-full max-w-[300px] md:max-w-[360px] aspect-[1.5/1]">
              
              {/* Card 1 (Back left) */}
              <div className="absolute inset-0 bg-[#25221C] border border-[#3A362E] rounded-xl p-5 flex flex-col justify-between transform -rotate-6 translate-x-[-15px] translate-y-[10px] opacity-80 md:translate-x-[-20px]">
                <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">Shadow Campus</div>
                <div className="font-display font-medium text-lg text-[var(--color-cream)] mt-auto">Study Material</div>
                <div className="font-mono text-[var(--color-coral)] text-sm mt-1">MP-U3</div>
              </div>

              {/* Card 2 (Back right) - Hidden on smallest screens to avoid clutter */}
              <div className="absolute inset-0 bg-[#25221C] border border-[#3A362E] rounded-xl p-5 flex flex-col justify-between transform rotate-4 translate-x-[20px] translate-y-[-10px] opacity-90 hidden sm:flex md:translate-x-[30px] md:translate-y-[-15px]">
                <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">Marketplace</div>
                <div className="font-display font-medium text-lg text-[var(--color-cream)] mt-auto">Electronics Hub</div>
                <div className="font-mono text-[var(--color-coral)] text-sm mt-1">BK-04</div>
              </div>

              {/* Card 3 (Front - The Active Pass) */}
              <div className="absolute inset-0 bg-[var(--color-cream)] border border-[#E3DEC9] rounded-xl p-6 flex flex-col justify-between transform -rotate-3 z-10 text-[var(--color-dark)]">
                
                {/* Perforation cutouts on the left edge */}
                <div className="absolute left-[-8px] top-1/3 w-4 h-4 bg-[var(--color-dark)] rounded-full"></div>
                <div className="absolute left-[-8px] bottom-1/3 w-4 h-4 bg-[var(--color-dark)] rounded-full"></div>

                <div>
                  <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase">Commute Room</div>
                  <div className="font-display font-bold text-2xl mt-2 leading-tight">North Gate <br/> <span className="text-[#807b71] font-normal text-xl">to</span> Main Campus</div>
                </div>
                
                <div className="flex justify-between items-end relative">
                  <div>
                    <div className="text-xs text-[#807b71] mb-1 font-medium">PASS CODE</div>
                    <div className="font-mono text-[var(--color-coral)] font-medium text-lg">JK-4471</div>
                  </div>
                  {/* Verified Badge */}
                  <div className="w-14 h-14 rounded-full border border-dashed border-[var(--color-coral)] flex items-center justify-center transform -rotate-12 absolute right-0 bottom-0 bg-[var(--color-cream)]">
                    <div className="font-mono text-[8px] leading-[10px] text-[var(--color-coral)] text-center font-bold uppercase">
                      Verified<br/>.edu<br/>Only
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Modules Section */}
      <section id="modules" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10 border-t border-[var(--color-muted)]/10">
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-[var(--color-cream)]">The Modules</h2>
          <p className="text-[var(--color-muted)] mt-2">Everything you need to navigate off-campus life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tiffin */}
          <div className="bg-[#25221C] border border-[#3A362E] rounded-xl p-6 flex flex-col min-h-[160px] hover:border-[var(--color-coral)]/50 transition-colors cursor-default">
            <div className="font-mono text-[10px] text-[var(--color-coral)] tracking-widest uppercase mb-4">Module 01</div>
            <div className="font-display font-medium text-xl text-[var(--color-cream)] mt-auto">Tiffin Network</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">Find, review, and rate local daily meal vendors.</div>
          </div>
          
          {/* Commute */}
          <div className="bg-[#25221C] border border-[#3A362E] rounded-xl p-6 flex flex-col min-h-[160px] hover:border-[var(--color-coral)]/50 transition-colors cursor-default">
            <div className="font-mono text-[10px] text-[var(--color-coral)] tracking-widest uppercase mb-4">Module 02</div>
            <div className="font-display font-medium text-xl text-[var(--color-cream)] mt-auto">Commute Matchmaker</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">Share auto/cab rides in real-time with verified peers.</div>
          </div>

          {/* Shadow Campus */}
          <div className="bg-[#25221C] border border-[#3A362E] rounded-xl p-6 flex flex-col min-h-[160px] hover:border-[var(--color-coral)]/50 transition-colors cursor-default">
            <div className="font-mono text-[10px] text-[var(--color-coral)] tracking-widest uppercase mb-4">Module 03</div>
            <div className="font-display font-medium text-xl text-[var(--color-cream)] mt-auto">Shadow Campus</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">A shared vault of deduplicated study materials and notes.</div>
          </div>

          {/* Marketplace */}
          <div className="bg-[#25221C] border border-[#3A362E] rounded-xl p-6 flex flex-col min-h-[160px] hover:border-[var(--color-coral)]/50 transition-colors cursor-default">
            <div className="font-mono text-[10px] text-[var(--color-coral)] tracking-widest uppercase mb-4">Module 04</div>
            <div className="font-display font-medium text-xl text-[var(--color-cream)] mt-auto">Marketplace</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">Buy and sell essentials safely without spam or external links.</div>
          </div>

          {/* Housing */}
          <div className="bg-[#25221C] border border-[#3A362E] rounded-xl p-6 flex flex-col min-h-[160px] hover:border-[var(--color-coral)]/50 transition-colors cursor-default">
            <div className="font-mono text-[10px] text-[var(--color-coral)] tracking-widest uppercase mb-4">Module 05</div>
            <div className="font-display font-medium text-xl text-[var(--color-cream)] mt-auto">Housing Hub</div>
            <div className="text-sm text-[var(--color-muted)] mt-2">Honest reviews on wifi, landlords, and hidden charges.</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
