import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'components', 'landing', 'LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Target block for how-it-works sticky scroll replacement
const startMarker = '{/* UI-Layouts Authentic Sticky Scroll Workflow (ui-layouts.com/components/sticky-scroll) */}';
const endMarker = '{/* 7b. FRONTLINE ARTISANS & CIVIC DOCUMENTARY GALLERY MODAL (ui-layouts.com/components/gallery-modal) */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!', { startIndex, endIndex });
  process.exit(1);
}

// Find the closing </div>\n      </section>\n\n before the end marker
const sliceBefore = content.substring(0, startIndex);
const sliceAfter = content.substring(endIndex);

const stickyReplacement = `        </div>
      </section>

      {/* 7b. AUTHENTIC UI-LAYOUTS STICKY SCROLL SECTION (ui-layouts.com/components/sticky-scroll) */}
      <StickyScrollSection
        isStarryNight={isStarryNight}
        onOpenCustomerBooking={onOpenCustomerBooking}
        onOpenWorkerMarketplace={onOpenWorkerMarketplace}
        onOpenAuth={onOpenAuth}
        t={t}
      />

      `;

content = sliceBefore + stickyReplacement + sliceAfter;

// 2. Add StickyGallery inside gallery-showcase
const galleryEndMarker = '{/* Shared Layout Modal (ui-layouts.com/components/gallery-modal) */}';
const galleryEndIndex = content.indexOf(galleryEndMarker);
if (galleryEndIndex !== -1) {
  const galleryStickyMarkup = `          {/* Authentic 3-Column Sticky Gallery (ui-layouts.com/components/sticky-scroll) */}
          <div className="pt-8">
            <StickyGallery
              isStarryNight={isStarryNight}
              onOpenCustomerBooking={onOpenCustomerBooking}
              onOpenWorkerMarketplace={onOpenWorkerMarketplace}
              onOpenAuth={onOpenAuth}
            />
          </div>

          `;
  content = content.substring(0, galleryEndIndex) + galleryStickyMarkup + content.substring(galleryEndIndex);
}

// 3. Upgrade footer with UI-Layouts Giant Typography Reveal
const footerOldStart = '<footer className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-900">';
const footerNew = `<footer className="group bg-slate-950 text-slate-400 text-xs pt-8 pb-8 border-t border-slate-900 relative overflow-hidden">
        {/* UI-Layouts Signature Giant Typography Reveal */}
        <div className="overflow-hidden select-none pointer-events-none pb-4">
          <h1 className="text-[14vw] tracking-tighter group-hover:translate-y-2 translate-y-8 leading-[90%] uppercase font-black text-center bg-gradient-to-r from-neutral-500 via-neutral-200 to-neutral-600 bg-clip-text text-transparent transition-transform duration-700 ease-out opacity-40 group-hover:opacity-80">
            BHARAT KAUSHAL
          </h1>
        </div>

        <div className="bg-black/90 rounded-tr-3xl rounded-tl-3xl border-t border-white/10 pt-10 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative z-10 shadow-2xl">`;

if (content.includes(footerOldStart)) {
  content = content.replace(
    footerOldStart,
    footerNew
  );
  // Close the extra inner wrapper div before </footer>
  const footerClose = '</footer>';
  const lastFooterCloseIndex = content.lastIndexOf(footerClose);
  if (lastFooterCloseIndex !== -1) {
    content = content.substring(0, lastFooterCloseIndex) + '        </div>\n      </footer>' + content.substring(lastFooterCloseIndex + footerClose.length);
  }
}

// 4. Close </ReactLenis> at the very end of return in LandingPage.tsx
const oldPageClose = '    </div>\n  );\n};';
const newPageClose = '    </div>\n    </ReactLenis>\n  );\n};';
if (content.includes(oldPageClose)) {
  content = content.replace(oldPageClose, newPageClose);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated LandingPage.tsx with UI-Layouts Sticky components!');
