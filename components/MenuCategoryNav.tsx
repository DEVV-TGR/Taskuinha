"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/*
  Índice fixo da ementa, com a categoria activa realçada.

  A categoria activa vem de um IntersectionObserver, não de listeners de
  scroll: só corre quando uma secção entra ou sai da faixa observada.
*/
export function MenuCategoryNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Categorias da ementa"
      className="sticky top-[68px] z-30 border-y border-line bg-surface/92 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-[1400px] snap-x gap-2 overflow-x-auto px-5 py-3 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="snap-start">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-accent text-on-accent"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
