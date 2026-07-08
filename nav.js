/**
 * Gen Web Agency - Unified Navigation System
 * Features: Aquatic high-signal layout, smart relative pathing, 
 *           direct page loads, vibrant water branding, and Contextual Help.
 */

(function() {
    // --- 1. CONFIGURATION & STATE ---
    let rootPath = './';
    const currentScript = document.currentScript || (function() {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const pageURL = new URL(window.location.href);
    const pageURLString = pageURL.origin + pageURL.pathname;
    let rootURLString = '';

    if (currentScript && currentScript.src) {
        const scriptURL = new URL(currentScript.src, window.location.href);
        rootURLString = scriptURL.href.substring(0, scriptURL.href.lastIndexOf('/') + 1);
        if (pageURLString.startsWith(rootURLString)) {
            const subPath = pageURLString.substring(rootURLString.length);
            const depth = (subPath.match(/\//g) || []).length;
            rootPath = '../'.repeat(depth);
        }
    }

    const pageTitle = currentScript ? (currentScript.getAttribute('data-title') || document.title.split('|')[0].trim() || 'Ops Hub') : 'Ops Hub';
    const pageIcon = currentScript ? (currentScript.getAttribute('data-icon') || 'ph-house-line') : 'ph-house-line';
    const helpContent = currentScript ? (currentScript.getAttribute('data-help') || 'No additional guide available for this tool yet.') : 'No additional guide available for this tool yet.';
    
    const filename = pageURLString.substring(pageURLString.lastIndexOf('/') + 1);
    const isHome = filename === 'index.html' || filename === '' || pageURLString === rootURLString;

    // --- 2. THEME & DEPENDENCIES ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    if (typeof tailwind !== 'undefined') {
        tailwind.config = tailwind.config || {};
        tailwind.config.darkMode = 'class';
    }

    if (!document.querySelector('script[src*="phosphor-icons"]')) {
        const phScript = document.createElement('script');
        phScript.src = 'https://unpkg.com/@phosphor-icons/web';
        document.head.appendChild(phScript);
    }

    const savedTheme = localStorage.getItem('gen-web-theme') || 'light';
    applyTheme(savedTheme);

    // --- 3. AQUATIC BRANDING ---
    const injectBranding = () => {
        const faviconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="256" height="256" fill="none"/>
            <path d="M40,112a40,40,0,0,1,80,0,40,40,0,0,0,80,0" fill="none" stroke="url(#waveGrad)" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/>
            <path d="M40,160a40,40,0,0,1,80,0,40,40,0,0,0,80,0" fill="none" stroke="url(#waveGrad)" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" opacity="0.6"/>
        </svg>`;
        const blob = new Blob([faviconSVG], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        let link = document.querySelector("link[rel~='icon']");
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.href = url;
    };
    injectBranding();

    // --- 4. CATEGORY DETECTION ---
    const getCategory = () => {
        const p = pageURL.pathname.toLowerCase();
        if (p.includes('tasktracker') || p.includes('timesheet') || p.includes('rulesdb') || p.includes('price')) return 'Operations';
        if (p.includes('socialcal') || p.includes('noticesign') || p.includes('utmlink') || p.includes('qrcode') || p.includes('shorteneradmin')) return 'Marketing';
        if (p.includes('crac_cal') || p.includes('sim')) return 'Facilities';
        if (p.includes('resources') || p.includes('swimcert') || p.includes('a3menu')) return 'Resources';
        return '';
    };
    const currentCat = getCategory();

    // --- 5. UI COMPONENTS ---
    const showNav = !currentScript.hasAttribute('data-hide-nav');

    const headerHTML = showNav ? `
    <header id="gen-web-header" class="no-print bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans transition-all duration-300 dark:bg-slate-900/95 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <!-- Unified Brand & Context -->
            <div class="flex items-center gap-4">
                <a href="${rootPath}index.html" class="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none rounded-lg p-1">
                    <div class="bg-cyan-600 text-white p-1.5 rounded-lg group-hover:bg-blue-600 transition-colors shadow-sm dark:bg-cyan-900/50">
                        <i class="ph-bold ph-waves text-xl"></i>
                    </div>
                    <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                    <div class="flex items-center gap-2">
                        <i class="ph-bold ${pageIcon} text-lg text-slate-400 dark:text-slate-500"></i>
                        <div>
                            <h1 class="text-sm font-black text-slate-900 leading-tight dark:text-white uppercase tracking-tight">${pageTitle}</h1>
                            <p class="text-[9px] text-cyan-600 font-bold dark:text-cyan-400 uppercase tracking-widest leading-none">Clarence Valley Council</p>
                        </div>
                    </div>
                </a>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-1">
                
                <!-- Operations Dropdown -->
                <div class="relative group">
                    <button class="flex items-center gap-1.5 px-3 py-2 text-xs font-black ${currentCat === 'Operations' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'} rounded-lg transition-all uppercase tracking-tight focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                        <i class="ph-bold ph-briefcase"></i>
                        <span>Operations</span>
                        <i class="ph-bold ph-caret-down text-[10px] opacity-50"></i>
                    </button>
                    <div class="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all transform origin-top-left scale-95 group-hover:scale-100 group-focus-within:scale-100 z-50 p-3 dark:bg-slate-900 dark:border-slate-700">
                        <div class="grid gap-1">
                            <a href="${rootPath}TaskTracker.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/40">
                                    <i class="ph-duotone ph-list-checks text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Task Tracker</p><p class="text-[9px] font-normal opacity-60">Maintenance logs</p></div>
                            </a>
                            <a href="${rootPath}CRACPriceCalculator.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/40">
                                    <i class="ph-duotone ph-currency-circle-dollar text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Pricing Hub</p><p class="text-[9px] font-normal opacity-60">Fee calculator</p></div>
                            </a>
                            <a href="${rootPath}WeekendTimesheetCalculator.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/40">
                                    <i class="ph-duotone ph-clock text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Timesheet Tool</p><p class="text-[9px] font-normal opacity-60">Penalty hour calc</p></div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Marketing Dropdown -->
                <div class="relative group">
                    <button class="flex items-center gap-1.5 px-3 py-2 text-xs font-black ${currentCat === 'Marketing' ? 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'text-slate-600 hover:text-pink-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'} rounded-lg transition-all uppercase tracking-tight focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                        <i class="ph-bold ph-megaphone"></i>
                        <span>Marketing</span>
                        <i class="ph-bold ph-caret-down text-[10px] opacity-50"></i>
                    </button>
                    <div class="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all transform origin-top-left scale-95 group-hover:scale-100 group-focus-within:scale-100 z-50 p-3 dark:bg-slate-900 dark:border-slate-700">
                        <div class="grid gap-1">
                            <a href="${rootPath}SocialCal/soccal.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 dark:bg-pink-900/40">
                                    <i class="ph-duotone ph-paper-plane-tilt text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Comms Request</p><p class="text-[9px] font-normal opacity-60">Socials & newsletters</p></div>
                            </a>
                            <a href="${rootPath}NoticeSignGenerator.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 dark:bg-pink-900/40">
                                    <i class="ph-duotone ph-warning-octagon text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">A4 Sign Generator</p><p class="text-[9px] font-normal opacity-60">PDF signs & posters</p></div>
                            </a>
                            <a href="${rootPath}UTMLinkGenerator.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 dark:bg-pink-900/40">
                                    <i class="ph-duotone ph-qr-code text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">UTM & QR Builder</p><p class="text-[9px] font-normal opacity-60">Tracked marketing links</p></div>
                            </a>
                            <a href="${rootPath}ShortenerAdmin.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 dark:bg-pink-900/40">
                                    <i class="ph-duotone ph-link text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Short Links</p><p class="text-[9px] font-normal opacity-60">URL Redirect Admin</p></div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Facilities Dropdown -->
                <div class="relative group">
                    <button class="flex items-center gap-1.5 px-3 py-2 text-xs font-black ${currentCat === 'Facilities' ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'} rounded-lg transition-all uppercase tracking-tight focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                        <i class="ph-bold ph-buildings"></i>
                        <span>Facilities</span>
                        <i class="ph-bold ph-caret-down text-[10px] opacity-50"></i>
                    </button>
                    <div class="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all transform origin-top-left scale-95 group-hover:scale-100 group-focus-within:scale-100 z-50 p-3 dark:bg-slate-900 dark:border-slate-700">
                        <div class="grid gap-1">
                            <a href="${rootPath}CRAC_CAL/crac-cal-admin.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 dark:bg-teal-900/40">
                                    <i class="ph-duotone ph-calendar text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">CRAC Admin</p><p class="text-[9px] font-normal opacity-60">Manage lane bookings</p></div>
                            </a>
                            <a href="${rootPath}CRAC_CAL/ycp-cal-admin.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 dark:bg-teal-900/40">
                                    <i class="ph-duotone ph-calendar-star text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">YCP Admin</p><p class="text-[9px] font-normal opacity-60">Manage Yamba Pool</p></div>
                            </a>
                            <a href="${rootPath}CRAC_CAL/CRAC_CalPrintStudio.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 dark:bg-teal-900/40">
                                    <i class="ph-duotone ph-printer text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Print Studio</p><p class="text-[9px] font-normal opacity-60">Lane charts & schedules</p></div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Resources Dropdown -->
                <div class="relative group">
                    <button class="flex items-center gap-1.5 px-3 py-2 text-xs font-black ${currentCat === 'Resources' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'} rounded-lg transition-all uppercase tracking-tight focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                        <i class="ph-bold ph-book-bookmark"></i>
                        <span>Resources</span>
                        <i class="ph-bold ph-caret-down text-[10px] opacity-50"></i>
                    </button>
                    <div class="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 group-focus-within:scale-100 z-50 p-3 dark:bg-slate-900 dark:border-slate-700">
                        <div class="grid gap-1">
                            <a href="${rootPath}CRACResources.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/40">
                                    <i class="ph-duotone ph-waves text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">CRAC Links</p><p class="text-[9px] font-normal opacity-60">Internal operations docs</p></div>
                            </a>
                            <a href="${rootPath}YCPResources.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/40">
                                    <i class="ph-duotone ph-drop text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">YCP Links</p><p class="text-[9px] font-normal opacity-60">Yamba Pool resources</p></div>
                            </a>
                            <a href="${rootPath}Mult-Centre/SwimCertGen.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/40">
                                    <i class="ph-duotone ph-certificate text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Cert Builder</p><p class="text-[9px] font-normal opacity-60">LTS Certificates</p></div>
                            </a>
                            <a href="${rootPath}A3MenuBuilder.html" class="flex items-center gap-3 p-2.5 text-xs font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                                <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/40">
                                    <i class="ph-duotone ph-list text-lg"></i>
                                </div>
                                <div><p class="uppercase tracking-tight">Menu Builder</p><p class="text-[9px] font-normal opacity-60">A3 Kiosk posters</p></div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="h-4 w-px bg-slate-200 mx-2 dark:bg-slate-800"></div>

                <!-- Tool Guide -->
                ${!isHome ? `
                <button id="open-help-btn" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none" title="Tool Guide">
                    <i class="ph-bold ph-info text-xl"></i>
                </button>` : ''}

                <!-- Theme Toggle -->
                <button id="theme-toggle" class="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded-xl transition-all dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none" title="Switch Theme">
                    <i class="ph-bold ph-moon text-xl"></i>
                </button>

                <a href="${rootPath}SocialCal/soccal.html" class="ml-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-blue-600 transition-all shadow-sm flex items-center gap-2 uppercase tracking-tighter focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                    <i class="ph-bold ph-paper-plane-tilt text-sm"></i>
                    <span>Comms Request</span>
                </a>
            </nav>

            <!-- Mobile Toggle -->
            <button id="mobile-menu-toggle" class="lg:hidden p-2 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                <i class="ph-bold ph-list text-xl"></i>
            </button>
        </div>
    </header>

    <div id="gen-web-nav-spacer" class="no-print h-16"></div>
    ` : '';

    const modalHTML = showNav ? `
    <!-- Global Help Modal -->
    <div id="help-modal" class="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center z-[10000] p-4">
        
        <div id="help-modal-overlay" class="absolute inset-0"></div>

        <div id="help-modal-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-800 relative z-[10001] transition-all transform scale-95 opacity-0">
            
            <div class="flex items-center gap-4 mb-6">
                <div class="bg-blue-100 text-blue-600 p-3 rounded-xl dark:bg-blue-900/30">
                    <i class="ph-bold ${pageIcon} text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">${pageTitle} Guide</h3>
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-60">Quick Reference</p>
                </div>
            </div>
            
            <div class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                ${helpContent}
            </div>
            
            <button id="close-help-btn" class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl uppercase tracking-tighter active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                Close Guide
            </button>
        </div>
    </div>
    ` : '';

    // --- 6. INJECTION & LOGIC ---
    const inject = () => {
        if (document.getElementById('gen-web-nav')) return;
        
        // 1. Inject Header (Prepend)
        const headerWrapper = document.createElement('div');
        headerWrapper.id = 'gen-web-nav';
        headerWrapper.className = 'no-print';
        headerWrapper.innerHTML = headerHTML;
        document.body.prepend(headerWrapper);

        // 2. Inject Mobile Menu & Modal (Append to end of body to ensure layering)
        const portalWrapper = document.createElement('div');
        portalWrapper.id = 'gen-web-portal';
        portalWrapper.className = 'no-print';
        portalWrapper.innerHTML = `
            <!-- Mobile Menu Overlay -->
            <div id="mobile-menu-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10000] hidden opacity-0 transition-opacity duration-300"></div>
            
            <!-- Mobile Menu Panel -->
            <div id="mobile-menu" class="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-[10001] flex flex-col transform translate-x-full transition-transform duration-300 ease-in-out shadow-2xl border-l border-slate-200 dark:border-slate-800 pointer-events-auto">
                <style>
                    #mobile-menu { background-color: #ffffff !important; }
                    .dark #mobile-menu { background-color: #0f172a !important; }
                </style>
                <div class="p-6 flex flex-col h-full">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-3">
                            <div class="bg-cyan-600 text-white p-1.5 rounded-lg shadow-sm">
                                <i class="ph-bold ph-waves text-xl"></i>
                            </div>
                            <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-tighter">CRAC Hub</h2>
                        </div>
                        <button id="mobile-menu-close" class="p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none">
                            <i class="ph-bold ph-x text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="grid gap-6 overflow-y-auto pr-2 custom-scroll flex-grow">
                        <div>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Operations</h3>
                            <div class="grid gap-1">
                                <a href="${rootPath}TaskTracker.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-list-checks text-blue-500 text-xl"></i> Task Tracker
                                </a>
                                <a href="${rootPath}CRACPriceCalculator.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-currency-circle-dollar text-blue-500 text-xl"></i> Pricing Hub
                                </a>
                                <a href="${rootPath}WeekendTimesheetCalculator.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-clock text-blue-500 text-xl"></i> Timesheet Tool
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Marketing</h3>
                            <div class="grid gap-1">
                                <a href="${rootPath}SocialCal/soccal.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-paper-plane-tilt text-pink-500 text-xl"></i> Comms Request
                                </a>
                                <a href="${rootPath}NoticeSignGenerator.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-warning-octagon text-pink-500 text-xl"></i> A4 Sign Generator
                                </a>
                                <a href="${rootPath}UTMLinkGenerator.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-qr-code text-pink-500 text-xl"></i> UTM & QR Builder
                                </a>
                                <a href="${rootPath}ShortenerAdmin.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-link text-pink-500 text-xl"></i> Short Links
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Facilities</h3>
                            <div class="grid gap-1">
                                <a href="${rootPath}CRAC_CAL/crac-cal-admin.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-calendar text-teal-500 text-xl"></i> CRAC Admin
                                </a>
                                <a href="${rootPath}CRAC_CAL/ycp-cal-admin.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-calendar-star text-teal-500 text-xl"></i> YCP Admin
                                </a>
                                <a href="${rootPath}CRAC_CAL/CRAC_CalPrintStudio.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-printer text-teal-500 text-xl"></i> Print Studio
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Resources</h3>
                            <div class="grid gap-1">
                                <a href="${rootPath}CRACResources.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-book-bookmark text-amber-500 text-xl"></i> CRAC Links
                                </a>
                                <a href="${rootPath}YCPResources.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-drop text-amber-500 text-xl"></i> YCP Links
                                </a>
                                <a href="${rootPath}Mult-Centre/SwimCertGen.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-certificate text-amber-500 text-xl"></i> Cert Builder
                                </a>
                                <a href="${rootPath}A3MenuBuilder.html" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <i class="ph-duotone ph-list text-amber-500 text-xl"></i> Menu Builder
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8">
                        <a href="${rootPath}index.html" class="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-tighter shadow-xl">
                            <i class="ph-bold ph-house"></i>
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
            ${modalHTML}
        `;
        document.body.appendChild(portalWrapper);

        // --- Event Delegation & Robust Init ---
        const helpBtn = document.getElementById('open-help-btn');
        const helpModal = document.getElementById('help-modal');
        const helpContentEl = document.getElementById('help-modal-content');
        const closeHelpBtn = document.getElementById('close-help-btn');
        const helpOverlay = document.getElementById('help-modal-overlay');

        if (helpBtn) helpBtn.onclick = () => {
            helpModal.classList.remove('hidden');
            helpModal.classList.add('flex');
            setTimeout(() => helpContentEl.classList.add('scale-100', 'opacity-100'), 10);
        };

        const closeHelp = () => {
            if(!helpContentEl) return;
            helpContentEl.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                helpModal.classList.add('hidden');
                helpModal.classList.remove('flex');
            }, 200);
        };

        if (closeHelpBtn) closeHelpBtn.onclick = closeHelp;
        if (helpOverlay) helpOverlay.onclick = closeHelp;

        // Theme Logic & Icon Sync
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const current = localStorage.getItem('gen-web-theme') || 'light';
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = `ph-bold ph-${current === 'dark' ? 'sun' : 'moon'} text-xl`;

            themeToggle.onclick = () => {
                const current = localStorage.getItem('gen-web-theme') || 'light';
                const next = current === 'light' ? 'dark' : 'light';
                localStorage.setItem('gen-web-theme', next);
                const doc = document.documentElement;
                if (next === 'dark') doc.classList.add('dark'); else doc.classList.remove('dark');
                const icon = themeToggle.querySelector('i');
                if (icon) icon.className = `ph-bold ph-${next === 'dark' ? 'sun' : 'moon'} text-xl`;
            };
        }

        // Mobile Logic
        const mobToggle = document.getElementById('mobile-menu-toggle');
        const mobClose = document.getElementById('mobile-menu-close');
        const mobMenu = document.getElementById('mobile-menu');
        const mobOverlay = document.getElementById('mobile-menu-overlay');

        const openMobileMenu = () => {
            if(mobOverlay) {
                mobOverlay.classList.remove('hidden');
                setTimeout(() => mobOverlay.classList.remove('opacity-0'), 10);
            }
            if(mobMenu) mobMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        };

        const closeMobileMenu = () => {
            if(mobOverlay) mobOverlay.classList.add('opacity-0');
            if(mobMenu) mobMenu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Restore scroll
            setTimeout(() => {
                if(mobOverlay) mobOverlay.classList.add('hidden');
            }, 300);
        };

        if (mobToggle) mobToggle.onclick = openMobileMenu;
        if (mobClose) mobClose.onclick = closeMobileMenu;
        if (mobOverlay) mobOverlay.onclick = closeMobileMenu;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();