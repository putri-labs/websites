import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    role: "Owner, Iron Forge Gym — Delhi",
    body: "GymAI replaced three separate tools we were using. The GST invoice generation alone saves my accountant hours every month.",
    initials: "RS",
  },
  {
    name: "Priya Nair",
    role: "Manager, FitZone — Bangalore",
    body: "The biometric sync and live check-in feed have completely changed how we manage peak-hour crowds. We catch issues before they become problems.",
    initials: "PN",
  },
  {
    name: "Amit Verma",
    role: "Owner, PowerHouse Fitness — Mumbai (3 branches)",
    body: "Running three branches used to mean three separate spreadsheets. Now I see everything — revenue, attendance, staff — from one screen.",
    initials: "AV",
  },
  {
    name: "Sunita Reddy",
    role: "Receptionist, Flex Fitness — Hyderabad",
    body: "Manual check-in is a lifesaver when the biometric device is down. I can find any member in seconds and log them in without paperwork.",
    initials: "SR",
  },
  {
    name: "Karan Mehta",
    role: "Owner, Alpha Gym — Pune",
    body: "The expiry alerts mean we always reach out to members before they lapse. Our renewal rate went up 22% in the first two months.",
    initials: "KM",
  },
  {
    name: "Deepa Iyer",
    role: "Manager, Zenith Health Club — Chennai",
    body: "Discount approvals keep our offers consistent. No more staff handing out random discounts — every deal gets reviewed before going through.",
    initials: "DI",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          Trusted by gym owners across India
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          From single-location studios to multi-branch chains — here&apos;s what operators say after switching to GymAI.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map(({ name, role, body, initials }) => (
          <div
            key={name}
            className="rounded-xl border bg-card p-6 flex flex-col gap-4 hover:shadow-sm hover:border-primary/20 transition-all"
          >
            <Quote className="h-5 w-5 text-primary/40 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{body}</p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{name}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
