const globalHeaderHTML = `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            <div class="flex items-center gap-3">
                <a href="index.html" class="flex items-center gap-3 group">
                    <div class="bg-cyan-600 text-white p-2 rounded-lg group-hover:bg-cyan-700 transition-colors">
                        <i class="ph-bold ph-waves text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Operations Hub</h1>
                        <p class="text-xs text-slate-500 font-medium hidden sm:block">CRAC & YCP</p>
                    </div>
                </a>
            </div>

            <nav class="hidden md:flex items-center gap-1">
                <a href="CRACResources.html" class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700 rounded-md hover:bg-cyan-50 transition-colors">CRAC Resources</a>
                <a href="YCPResources.html" class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 rounded-md hover:bg-teal-50 transition-colors">YCP Resources</a>
                
                <div class="h-6 w-px bg-slate-200 mx-2"></div>
                
                <button @click="isModalOpen = true; modalTitle = 'Communication Request Form'; modalSrc = 'https://forms.office.com/r/1tV6fDHVJB?embed=true'" 
                        class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-pink-600 rounded-md hover:bg-pink-50 transition-colors">
                    Comms Request
                </button>
                
                <button @click="isModalOpen = true; modalTitle = 'Book a Meeting with Avi'; modalSrc = 'https://outlook.office.com/book/BookanAvi@clarence.nsw.gov.au/?embed=true'" 
                        class="ml-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
                    <i class="ph-bold ph-calendar-plus"></i>
                    <span>Book Meeting</span>
                </button>
            </nav>

            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <i class="ph-bold" :class="mobileMenuOpen ? 'ph-x' : 'ph-list'" class="text-2xl"></i>
            </button>
        </div>

        <div x-show="mobileMenuOpen" x-cloak 
             x-transition:enter="transition ease-out duration-100"
             x-transition:enter-start="opacity-0 transform -translate-y-2"
             x-transition:enter-end="opacity-100 transform translate-y-0"
             x-transition:leave="transition ease-in duration-75"
             x-transition:leave-start="opacity-100 transform translate-y-0"
             x-transition:leave-end="opacity-0 transform -translate-y-2"
             class="md:hidden border-t border-slate-200 bg-white absolute w-full z-50 shadow-lg">
            <div class="px-4 py-4 space-y-2">
                <a href="CRACResources.html" class="block px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-cyan-50 hover:text-cyan-700">
                    <i class="ph-bold ph-book-bookmark mr-2"></i> CRAC Resources
                </a>
                <a href="YCPResources.html" class="block px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700">
                    <i class="ph-bold ph-waves mr-2"></i> YCP Resources
                </a>
                <button @click="isModalOpen = true; modalTitle = 'Communication Request Form'; modalSrc = 'https://forms.office.com/r/1tV6fDHVJB?embed=true'; mobileMenuOpen = false" 
                        class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-pink-50 hover:text-pink-700">
                    <i class="ph-bold ph-paper-plane-tilt mr-2"></i> Comms Request
                </button>
                <button @click="isModalOpen = true; modalTitle = 'Book a Meeting with Avi'; modalSrc = 'https://outlook.office.com/book/BookanAvi@clarence.nsw.gov.au/?embed=true'; mobileMenuOpen = false" 
                        class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-slate-900 text-white mt-2">
                    <i class="ph-bold ph-calendar-plus mr-2"></i> Book a Meeting
                </button>
            </div>
        </div>
    </header>
`;

const globalModalHTML = `
    <div x-show="isModalOpen" x-cloak 
         x-transition:enter="ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @keydown.escape.window="isModalOpen = false">
        
        <div x-show="isModalOpen"
             x-transition:enter="ease-out duration-300"
             x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave="ease-in duration-200"
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[85vh] flex flex-col border border-slate-200" 
             @click.outside="isModalOpen = false">
            
            <div class="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <h3 class="text-lg font-bold text-slate-800" x-text="modalTitle"></h3>
                <button @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors">
                    <i class="ph-bold ph-x text-xl"></i>
                </button>
            </div>
            
            <div class="flex-grow bg-slate-50 rounded-b-2xl overflow-hidden relative">
                 <div class="absolute inset-0 flex items-center justify-center -z-10">
                    <i class="ph-duotone ph-spinner animate-spin text-3xl text-slate-300"></i>
                </div>
                <iframe :src="modalSrc" class="w-full h-full" style="border: none;"></iframe>
            </div>
        </div>
    </div>
`;

// Inject the components when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Insert Header at the top of the body
    document.body.insertAdjacentHTML('afterbegin', globalHeaderHTML);
    // Insert Modal at the bottom of the body
    document.body.insertAdjacentHTML('beforeend', globalModalHTML);
});
