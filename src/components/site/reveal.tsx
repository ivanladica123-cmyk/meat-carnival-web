import { useLayoutEffect, useRef, type ReactNode } from "react"

/**
 * Scroll-into-view reveal (vanilla IntersectionObserver, no animation library).
 *
 * Robustness contract — content is VISIBLE by default and can never get stuck
 * hidden:
 *  - no-JS / JS error → the hidden state is never applied (added by JS, and any
 *    throw removes it), so content shows.
 *  - reduced-motion / no IntersectionObserver → content shows, no transition.
 *  - IO delivers on scroll → content fades/rises in (CSS transition).
 *  - Fallback: if an element is already in the viewport but hasn't revealed
 *    (e.g. IO never delivered), a timer REMOVES the hidden class — an instant
 *    style change, not a transition, so it resolves even if the compositor is
 *    paused. Below-fold elements keep their hidden state and still animate when
 *    scrolled to.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || typeof IntersectionObserver === "undefined") return // stays visible

    let done = false
    let io: IntersectionObserver | undefined
    let timer = 0
    const onScrollCheck = () => {
      if (done) return
      const r = el.getBoundingClientRect()
      // reveal once the section's top enters the lower 88% of the viewport
      // (or is already above it), or its bottom is on screen
      if (r.top < window.innerHeight * 0.88 && r.bottom > 0) animateIn()
    }
    const cleanupScroll = () => {
      window.removeEventListener("scroll", onScrollCheck)
      window.removeEventListener("resize", onScrollCheck)
    }
    function animateIn() {
      if (done) return
      done = true
      el!.classList.add("reveal-in")
      io?.disconnect()
      cleanupScroll()
    }
    try {
      el.classList.add("reveal")
      // Primary: IntersectionObserver with threshold 0 (first visible pixel),
      // NOT a ratio: a ratio threshold can be unreachable for sections taller
      // than the viewport (the mobile menu is ~5× viewport height → max ratio
      // ~0.17, so the old 0.15 never fired on narrow phones and the menu
      // stayed invisible). The -12% rootMargin delays the reveal until the
      // section meaningfully enters view.
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) animateIn()
          }
        },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" },
      )
      io.observe(el)
      // Belt-and-braces: a plain scroll/resize rect check with the same
      // trigger geometry. Costs one getBoundingClientRect per event until the
      // one-time reveal, and guarantees the reveal even where IO under-delivers.
      window.addEventListener("scroll", onScrollCheck, { passive: true })
      window.addEventListener("resize", onScrollCheck)
      onScrollCheck() // already in view at mount → reveal immediately
      // Last resort for in-view elements if neither path ran.
      timer = window.setTimeout(() => {
        if (done) return
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          done = true
          el.classList.remove("reveal") // instant visible, no transition dependency
          cleanupScroll()
        }
      }, 2500)
    } catch {
      el.classList.remove("reveal") // any failure → visible
      cleanupScroll()
    }
    return () => {
      io?.disconnect()
      cleanupScroll()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
