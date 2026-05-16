import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    infinite: false,
  })

  function raf(time: number) {
    lenis.raf(time)
    window.requestAnimationFrame(raf)
  }

  window.requestAnimationFrame(raf)

  return {
    provide: {
      lenis,
    },
  }
})
