import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ruler, Move, Download, Layers, PenTool, Scissors } from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Parametric Patterns",
    description: "Generate precise, made-to-measure garment patterns using FreeSewing's engine",
  },
  {
    icon: Move,
    title: "Drag-to-Edit",
    description: "Manipulate pattern points visually — measurements update in real-time",
  },
  {
    icon: Download,
    title: "Multi-Format Export",
    description: "Export your designs as SVG, PDF (print-ready), or DXF for CAD software",
  },
  {
    icon: Ruler,
    title: "Custom Measurements",
    description: "Save body measurement profiles and apply them to any pattern instantly",
  },
  {
    icon: Layers,
    title: "Cloud Storage",
    description: "Your designs are saved securely — access them from any device",
  },
  {
    icon: Scissors,
    title: "Pattern Library",
    description: "Start from bodice blocks, skirts, sleeves, and more foundational patterns",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">AFF Design Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/studio">
              <Button variant="ghost" size="sm">Try Demo</Button>
            </Link>
            <Link to="/studio">
              <Button size="sm" className="font-semibold">Open Studio</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center pt-16">
        <div className="absolute inset-0 canvas-grid opacity-30" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Powered by FreeSewing
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Design patterns
              <br />
              <span className="text-primary">by dragging.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              A parametric fashion design studio. Drag control points to sculpt garment patterns,
              export production-ready files in SVG, PDF, or DXF.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/studio">
                <Button size="lg" className="h-12 px-8 font-display font-semibold text-base">
                  Open Studio
                </Button>
              </Link>
              <Link to="/studio">
                <Button variant="outline" size="lg" className="h-12 px-8 font-display text-base">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Pattern preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-xl border border-border bg-card p-1">
              <div className="rounded-lg bg-canvas canvas-grid flex items-center justify-center min-h-[320px] relative overflow-hidden">
                <PatternPreviewSVG />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Everything you need to design
            </h2>
            <p className="mt-4 text-muted-foreground">
              From measurement to production-ready pattern files
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">Start designing now</h2>
          <p className="mt-4 text-muted-foreground">No signup required for the demo</p>
          <Link to="/studio" className="mt-8 inline-block">
            <Button size="lg" className="h-12 px-10 font-display font-semibold text-base">
              Launch Studio
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">AFF Design Studio</span>
          <span>Built with FreeSewing &amp; React</span>
        </div>
      </footer>
    </div>
  );
};

/** Decorative SVG showing a simplified bodice pattern */
function PatternPreviewSVG() {
  return (
    <svg viewBox="0 0 600 300" className="w-full max-w-2xl p-8" fill="none">
      {/* Front bodice shape */}
      <motion.path
        d="M150 50 L250 30 L280 50 L290 150 L270 250 L200 260 L150 250 L130 150 Z"
        stroke="hsl(43, 100%, 50%)"
        strokeWidth="2"
        fill="hsl(43, 100%, 50%, 0.05)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Back bodice shape */}
      <motion.path
        d="M350 50 L450 30 L480 50 L490 150 L470 250 L400 260 L350 250 L330 150 Z"
        stroke="hsl(43, 100%, 50%)"
        strokeWidth="2"
        fill="hsl(43, 100%, 50%, 0.05)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Darts */}
      <motion.path
        d="M200 150 L210 200 L220 150"
        stroke="hsl(43, 80%, 45%)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      />
      <motion.path
        d="M400 150 L410 200 L420 150"
        stroke="hsl(43, 80%, 45%)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      />
      {/* Control points */}
      {[
        [150, 50], [250, 30], [280, 50], [290, 150], [270, 250], [200, 260], [150, 250], [130, 150],
        [350, 50], [450, 30], [480, 50], [490, 150], [470, 250], [400, 260], [350, 250], [330, 150],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill="hsl(43, 100%, 50%)"
          stroke="hsl(0, 0%, 4%)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 + i * 0.05 }}
        />
      ))}
      {/* Labels */}
      <text x="195" y="285" fill="hsl(0, 0%, 55%)" fontSize="12" fontFamily="Space Grotesk" textAnchor="middle">Front</text>
      <text x="405" y="285" fill="hsl(0, 0%, 55%)" fontSize="12" fontFamily="Space Grotesk" textAnchor="middle">Back</text>
    </svg>
  );
}

export default Index;
