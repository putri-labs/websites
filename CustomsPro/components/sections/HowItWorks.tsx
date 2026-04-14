// components/sections/HowItWorks.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations"

const steps = [
  {
    number: "01",
    title: "Upload your documents",
    description:
      "Upload any shipping document — invoice, bill of lading, packing list, or certificate of origin. Any file format is supported.",
  },
  {
    number: "02",
    title: "AI autofills the BE form",
    description:
      "Claude AI reads your documents and fills all BE fields: item details, CTH codes, duties, IGM info, and more — in seconds.",
  },
  {
    number: "03",
    title: "Review, generate and download",
    description:
      "Review the pre-filled form, make any corrections, then generate a 100% ICEGATE-compliant flat file and download it instantly.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 bg-[#fafafa] relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeInUp} className="text-center mb-24">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Workflow</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">From documents to flat file in 3 steps</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">What used to take 30 to 90 minutes now takes under 15.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-gray-200"></div>
            
            {steps.map((step) => (
              <motion.div key={step.number} variants={staggerItem} className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold mb-8 shadow-md ring-8 ring-[#fafafa] relative">
                  <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping opacity-20"></div>
                  <span className="bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
