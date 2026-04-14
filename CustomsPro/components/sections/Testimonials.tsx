// components/sections/Testimonials.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations"

const testimonials = [
  {
    quote: "CustomsPro cut our BE filing time by more than half. What used to take our team an entire morning now takes under 20 minutes.",
    name: "Rajesh Sharma",
    firm: "Sharma Clearing Agency",
    role: "Proprietor",
    initials: "RS",
  },
  {
    quote: "The AI extraction is surprisingly accurate. It reads invoices and packing lists better than some of my junior staff.",
    name: "Anita Patel",
    firm: "Patel and Sons CHA",
    role: "Senior Operator",
    initials: "AP",
  },
  {
    quote: "Finally a customs software that does not look like it was built in 2003. The flat file generation is flawless.",
    name: "Mohammed Irfan",
    firm: "Global Freight Solutions",
    role: "CHA Firm Admin",
    initials: "MI",
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-32 px-4 sm:px-6 bg-white relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tighter">Trusted by CHA professionals</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={staggerItem} className="p-8 rounded-3xl bg-white border border-gray-200/80 flex flex-col gap-6 relative group overflow-hidden hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] shadow-sm transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-10 h-10 text-indigo-500/20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-base text-gray-600 leading-relaxed font-medium flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500 font-medium tracking-wide">{t.role} · {t.firm}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
