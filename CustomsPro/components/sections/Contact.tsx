// components/sections/Contact.tsx
"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { cn } from "@/lib/utils"

type FormState = "idle" | "loading" | "success" | "error"

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("loading")
    setErrorMsg("")
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      firmName: (form.elements.namedItem("firmName") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(json.error ?? "Something went wrong")
      setState("success")
      form.reset()
    } catch (err) {
      setState("error")
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const inputClass =
    "px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner"
  const labelClass = "text-sm font-semibold text-gray-700 ml-1"

  return (
    <section id="contact" className="py-32 px-4 sm:px-6 bg-[#fafafa] relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-xl mx-auto relative z-10">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Contact</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">Get in touch</h2>
            <p className="text-lg text-gray-500 font-medium">
              Interested in CustomsPro? Tell us about your firm and we will get back to you within one business day.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group hover:border-gray-300 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className={labelClass}>Full name</label>
                  <input id="name" name="name" type="text" required placeholder="Rajesh Sharma" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelClass}>Email address</label>
                  <input id="email" name="email" type="email" required placeholder="rajesh@sharmacca.com" className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="firmName" className={labelClass}>Firm name</label>
                <input id="firmName" name="firmName" type="text" required placeholder="Sharma Clearing Agency" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className={labelClass}>Message</label>
                <textarea id="message" name="message" required rows={4} placeholder="Tell us about your firm — how many users, how many BEs per month, what pain points you are facing." className={cn(inputClass, "resize-none")} />
              </div>
              {state === "success" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700">
                  Message sent! We will get back to you within one business day.
                </div>
              )}
              {state === "error" && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-medium text-rose-700">
                  {errorMsg || "Failed to send. Please try again."}
                </div>
              )}
              <button
                type="submit"
                disabled={state === "loading" || state === "success"}
                className={cn(
                  "w-full bg-gray-900 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] mt-2",
                  state === "loading" || state === "success" ? "opacity-50 cursor-not-allowed transform-none" : "hover:bg-black hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                )}
              >
                {state === "loading" ? "Sending..." : state === "success" ? "Sent!" : "Send Message"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
