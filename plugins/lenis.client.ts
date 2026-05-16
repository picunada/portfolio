import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const { $router } = useNuxtApp()

  const lenis = new Lenis({
    infinite: true,
  })

  function raf(time: number) {
    lenis.raf(time)
    window.requestAnimationFrame(raf)
  }

  window.requestAnimationFrame(raf)

  $router.afterEach((to, from) => {
    if (to.path !== from.path && ['/garant', '/portfolio-old', '/locker'].includes(to.path)) {
      lenis.scrollTo('#__nuxt', {
        offset: 0,
        duration: 0,
        immediate: true,
      })
    }
  })

  return {
    provide: {
      lenis,
    },
  }
})
