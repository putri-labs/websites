// components/sections/Pricing.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeInUp, staggerContainer } from "@/lib/animations"

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 bg-[#fafafa] relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">
              Pay only for what you use. Wallet-based AI credits with no monthly lock-in.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="inline-block w-full max-w-md rounded-3xl border border-gray-200/80 bg-white backdrop-blur-sm p-12 text-center relative overflow-hidden group shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-300 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-8 mx-auto shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Plans coming soon</h3>
              <p className="text-sm text-gray-500 mb-10 leading-relaxed font-medium">
                We are onboarding early-access firms now. Get in touch to discuss pricing tailored to your firm volume.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-black transition-all text-sm w-full shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
              >
                Contact Us for Pricing
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
