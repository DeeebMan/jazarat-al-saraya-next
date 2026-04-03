'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface CategoryTabsProps {
  categories: { name: string; slug: string }[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isClickScrolling = useRef(false);

  const allTabs = [{ name: 'الكل', slug: 'all' }, ...categories];

  // Scroll the nav so the active tab button is visible
  const scrollTabIntoView = useCallback((slug: string) => {
    const btn = tabRefs.current[slug];
    const nav = navRef.current;
    if (!btn || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    if (btnRect.left < navRect.left || btnRect.right > navRect.right) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  // Scroll spy: observe each category section
  useEffect(() => {
    const slugs = categories.map((c) => c.slug);
    const sections = slugs
      .map((slug) => document.getElementById(slug))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const slug = visible[0].target.id;
          setActiveTab(slug);
          scrollTabIntoView(slug);
        } else {
          // If no section is intersecting, check if we're above all sections (show "all")
          const menuEl = document.getElementById('menu');
          if (menuEl) {
            const menuRect = menuEl.getBoundingClientRect();
            if (menuRect.top >= -100) {
              setActiveTab('all');
              scrollTabIntoView('all');
            }
          }
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [categories, scrollTabIntoView]);

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    scrollTabIntoView(slug);

    // Prevent scroll spy from overriding during click-initiated scroll
    isClickScrolling.current = true;
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);

    if (slug === 'all') {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[73px] z-30 glass">
      <div className="max-w-7xl mx-auto px-4">
        <nav
          ref={navRef}
          className="flex gap-2 overflow-x-auto py-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {allTabs.map((tab) => (
            <button
              key={tab.slug}
              ref={(el) => { tabRefs.current[tab.slug] = el; }}
              onClick={() => handleTabClick(tab.slug)}
              className={cn(
                'relative whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex-shrink-0 border',
                activeTab === tab.slug
                  ? 'bg-[#d4a574]/15 text-[#d4a574] border-[#d4a574]/30'
                  : 'text-[#a0a0b0] hover:text-white hover:bg-white/5 border-transparent'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
