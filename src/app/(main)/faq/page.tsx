'use client';

import { useState } from 'react';
import Link from 'next/link';
import { faqs } from '@/lib/mock-data';

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="animate-fade-in-up border border-border rounded-xl overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
      >
        <span className="font-bold text-foreground pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border/50 pt-4 font-medium">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-lg font-medium">
          Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, get in touch.
        </p>
      </div>

      <div className="space-y-3 mb-12">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
        ))}
      </div>

      <div className="animate-fade-in text-center bg-card border border-border rounded-2xl p-8" style={{ animationDelay: '300ms' }}>
        <h2 className="text-xl font-black text-foreground mb-2">Still Have Questions?</h2>
        <p className="text-muted mb-6 font-medium">Our support team is here to help.</p>
        <Link
          href="/contact"
          className="inline-flex px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
