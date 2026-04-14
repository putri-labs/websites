// components/sections/FAQ.tsx
"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What is CustomsPro?",
    answer: "CustomsPro is a web-based SaaS platform built for Customs House Agents (CHAs) in India. It replaces legacy desktop software with an AI-powered workflow for creating, managing, and submitting Bills of Entry to ICEGATE.",
  },
  {
    question: "Which customs formats are supported?",
    answer: "The MVP supports Import Bill of Entry in the ICEGATE legacy flat file format. CACHE01 and ICEGATE JSON format and Shipping Bill (export) are on the post-MVP roadmap.",
  },
  {
    question: "How accurate is the AI extraction?",
    answer: "Our AI (powered by Claude by Anthropic) achieves over 85% correct field prefill accuracy on standard shipping documents. All extracted values are editable and every field can be overridden before submission.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Each CHA firm's data is fully isolated in a multi-tenant architecture. Data is encrypted at rest and in transit. CustomsPro is built on AWS with Cloudflare for edge security.",
  },
  {
    question: "Can multiple users in my firm use it?",
    answer: "Absolutely. CustomsPro supports multiple users per firm with role-based access. Firm Admins can manage team members and monitor all active jobs from a central dashboard.",
  },
  {
    question: "How do I get started?",
    answer: "Contact us using the form below and we will set up your firm account and walk you through onboarding. We are currently offering hands-on onboarding for all new firms.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const panelId = `faq-panel-${question.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}`

  return (
    <motion.div variants={staggerItem} className="border-b border-gray-100 last:border-b-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{question}</span>
        <span className={cn("flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:border-gray-300", open && "rotate-45 border-indigo-200 bg-indigo-50")}>
          <svg className={cn("w-3.5 h-3.5 text-gray-400 transition-colors", open && "text-indigo-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-base text-gray-500 leading-relaxed pb-6 pr-12 font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <section id="faq" className="py-32 px-4 sm:px-6 bg-white relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-3xl mx-auto">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tighter">Frequently asked questions</h2>
          </motion.div>
          <div className="bg-white rounded-3xl border border-gray-200/80 px-8 shadow-sm">
            {faqs.map((faq) => <FAQItem key={faq.question} {...faq} />)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
