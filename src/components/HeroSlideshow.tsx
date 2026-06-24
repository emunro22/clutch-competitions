'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=600&h=450&fit=crop&q=80',
    prize: 'Audi RS6 Avant',
    value: '£85,000',
    winner: 'Jamie M.',
    location: 'Glasgow',
  },
  {
    image: 'https://images.unsplash.com/photo-1642961597907-fc6fbff01720?w=600&h=450&fit=crop&q=80',
    prize: '£50,000 Cash',
    value: '£50,000',
    winner: 'Sarah K.',
    location: 'London',
  },
  {
    image: 'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=600&h=450&fit=crop&q=80',
    prize: 'Rolex Daytona',
    value: '£28,000',
    winner: 'Craig D.',
    location: 'Manchester',
  },
  {
    image: 'https://images.unsplash.com/photo-1633847016580-b7a15cc813d7?w=600&h=450&fit=crop&q=80',
    prize: 'Holiday to Barbados',
    value: '£8,000',
    winner: 'Emma R.',
    location: 'Birmingham',
  },
  {
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=450&fit=crop&q=80',
    prize: 'PS5 Pro Bundle',
    value: '£3,500',
    winner: 'Mark T.',
    location: 'Leeds',
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border shadow-2xl shadow-primary/10">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.prize}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-primary/90 text-background text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-background" />
              Verified Win
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white">{slide.prize}</h3>
              <p className="text-primary font-black mt-1">Worth {slide.value}</p>
              <p className="text-sm text-white/70 mt-2 font-medium">
                Won by {slide.winner} &mdash; {slide.location}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary w-6' : 'bg-border w-2 hover:bg-muted'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
