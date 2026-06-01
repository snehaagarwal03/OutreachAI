"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import {
  Sparkles,
  Brain,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  Eye,
  Send,
  MousePointer,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function useScrollAnimation(ref: React.RefObject<HTMLElement | null>) {
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return isInView
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center overflow-hidden">
            <Sparkles className="h-4 w-4 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/50 to-cyan-400/50" />
          </div>
          <span className="font-semibold text-lg tracking-tight">HyperReach AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#example" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Example</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-violet-500/25">
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-violet-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-20 left-[15%] w-px h-40 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
        <div className="absolute top-40 right-[20%] w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute top-32 left-[10%] w-2 h-2 rounded-full bg-violet-400/60" />
        <div className="absolute top-48 right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
        <div className="absolute bottom-[35%] left-[30%] w-1 h-1 rounded-full bg-violet-300/40" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            <Zap className="h-3 w-3" />
            AI-Powered Outreach Engine
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Generate Outreach
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            That Feels Human
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Turn websites, GitHub profiles, LinkedIn screenshots and company context
          into highly personalized outreach messages and replies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white border-0 shadow-xl shadow-violet-500/25 px-8 h-12 text-base font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#example">
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 hover:border-border hover:bg-accent/50 px-8 h-12 text-base font-medium"
            >
              View Demo
              <Eye className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 relative"
        >
          <div className="mx-auto max-w-3xl rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-violet-500/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/80">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">hyperreach.app</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 rounded-lg bg-muted/50 p-3 text-sm text-left">
                  <p className="text-muted-foreground text-xs mb-1">AI Generated Message</p>
                  <p className="leading-relaxed">
                    Hey Sarah, saw your post about the outreach volume problem last week. Funny timing — I&apos;ve been building something that a few sales engineers have been using to handle exactly that. Kakiyo runs the full LinkedIn conversation for you, qualification and all. Worth a quick look?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5 text-violet-400" />
                <span>Personalized from 4 data sources</span>
                <span className="text-border">·</span>
                <span>92% relevance score</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 left-0 right-20 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </section>
  )
}

const features = [
  {
    icon: Brain,
    title: "AI Prospect Intelligence",
    description: "Scrape websites, GitHub profiles, LinkedIn screenshots and company pages. AI reads it all and understands your prospect deeply.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Globe,
    title: "Multiple Offerings",
    description: "Create and manage distinct offerings. Different products, different angles, different audiences. Pick the right one for each message.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: FileText,
    title: "Prompt Customization",
    description: "Control tone, length, and angle. Your prompt becomes the system instruction — meaningfully changing every output.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: MessageSquare,
    title: "Message Generation",
    description: "Combine offering, prompt, and prospect context. Get messages that sound like a real human wrote them. Rate, favorite, copy, regenerate.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Send,
    title: "Reply Handling",
    description: "Paste in a prospect's reply and get a contextual response that naturally continues the conversation thread.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track message volume, offering usage, prospect counts, and conversation outcomes. Know what's working.",
    gradient: "from-indigo-500 to-violet-600",
  },
]

function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="relative py-32 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-violet-500/5 to-transparent rounded-full blur-3xl" />

      <div className="mx-auto max-w-6xl relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 mb-4">
            Features
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              outreach at scale
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            From prospect research to reply handling, HyperReach covers the entire outreach lifecycle.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group relative rounded-2xl border border-border/50 bg-card/30 p-6 hover:bg-card/60 hover:border-border transition-all duration-300"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const steps = [
  {
    number: "01",
    title: "Define Your Offering",
    description: "Paste a website URL and let HyperReach scrape it, or type it out manually. Define what you sell, who you sell to, and what makes you different.",
    icon: Globe,
  },
  {
    number: "02",
    title: "Add Prospects",
    description: "Save prospects with LinkedIn screenshots, GitHub profiles, portfolio URLs, company websites — any context that helps the AI understand them.",
    icon: Users,
  },
  {
    number: "03",
    title: "Generate Personalized Messages",
    description: "Combine your offering, prompt style, and prospect context. Get a message that sounds like a real human wrote it specifically for them.",
    icon: MessageSquare,
  },
  {
    number: "04",
    title: "Handle Replies",
    description: "Paste in the prospect's reply and get a contextual response that continues the conversation naturally. Full thread history preserved.",
    icon: Send,
  },
]

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
            How It Works
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight">
            From context to conversation
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              in four steps
            </span>
          </motion.h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-cyan-500/40 to-transparent md:-translate-x-px" />

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="space-y-12"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 md:text-right ${i % 2 !== 0 ? "hidden md:block" : ""}`}>
                  {i % 2 === 0 && (
                    <div className="space-y-3">
                      <span className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  )}
                </div>
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-500/20">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className={`flex-1 ${i % 2 === 0 ? "hidden md:block" : ""}`}>
                  {i % 2 !== 0 && (
                    <div className="space-y-3">
                      <span className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 md:hidden">
                  <div className="space-y-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ExampleSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="example" ref={ref} className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

      <div className="mx-auto max-w-6xl relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 mb-4">
            See It In Action
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight">
            Real inputs. Real output.
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Offering</p>
                <p className="text-xs text-muted-foreground">Kakiyo — AI Sales Automation</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>Automates LinkedIn conversations and outreach for sales teams.</p>
              <p>Target: mid-market sales engineers.</p>
              <p>Differentiator: runs the full conversation including qualification.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Prompt</p>
                <p className="text-xs text-muted-foreground">Conversational, under 100 words</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>Conversational tone. Under 100 words. Lead with a relevant observation about the prospect before mentioning Kakiyo.</p>
              <p>Never sound salesy. End with a soft question, not a hard ask.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Prospect</p>
                <p className="text-xs text-muted-foreground">Sarah — Sales Engineer</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>Sales engineer at a B2B SaaS company.</p>
              <p>Technical background. Recently posted about struggling with outreach volume.</p>
              <p>Her company sells to mid-market teams.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center my-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
            <ChevronRight className="h-4 w-4" />
            <Sparkles className="h-4 w-4 text-violet-400" />
            <ChevronRight className="h-4 w-4" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto max-w-2xl rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-card/80 to-cyan-500/5 p-8 shadow-2xl shadow-violet-500/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <span className="font-semibold">Generated Message</span>
          </div>
          <div className="rounded-xl bg-background/60 border border-border/30 p-5">
            <p className="leading-relaxed text-foreground/90">
              Hey Sarah, saw your post about the outreach volume problem last week. Funny timing — I&apos;ve been building something that a few sales engineers have been using to handle exactly that. Kakiyo runs the full LinkedIn conversation for you, qualification and all. Worth a quick look?
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-violet-400" />
              AI-personalized
            </span>
            <span className="flex items-center gap-1.5">
              <MousePointer className="h-3.5 w-3.5 text-cyan-400" />
              Under 100 words
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Soft close
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl relative text-center"
      >
        <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-12 md:p-16">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 items-center justify-center mb-6 shadow-xl shadow-violet-500/20">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Start Generating
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Better Outreach
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Stop sending generic messages. Start sending ones that get replies.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white border-0 shadow-xl shadow-violet-500/25 px-10 h-13 text-base font-medium"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm">HyperReach AI</span>
          <span className="text-xs text-muted-foreground ml-2">AI-Powered Hyper-Personalized Outreach</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#example" className="hover:text-foreground transition-colors">Example</a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ExampleSection />
      <CTASection />
      <Footer />
    </div>
  )
}