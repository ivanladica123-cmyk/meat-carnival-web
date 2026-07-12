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
    try {
      el.classList.add("reveal")
      const animateIn = () => {
        if (done) return
        done = true
        el.classList.add("reveal-in")
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              animateIn()
              io?.disconnect()
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      )
      io.observe(el)
      // Fallback for in-view elements that never received an IO callback.
      timer = window.setTimeout(() => {
        if (done) return
        const r = el.getBoundingClientRect()
        const inView = r.top < window.innerHeight && r.bottom > 0
        if (inView) {
          done = true
          el.classList.remove("reveal") // instant visible, no transition dependency
        }
      }, 2500)
    } catch {
      el.classList.remove("reveal") // any failure → visible
    }
    return () => {
      io?.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
