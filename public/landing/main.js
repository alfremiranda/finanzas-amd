/* Neto — landing page behaviour.
   No bundle, no dependencies: this page must load without the app's JS and without a single
   third-party request (PRODUCT.md §4.12 — the same rule the SEO calculators follow).
   Everything here degrades: with JS off, the CSS `.no-js` rule leaves all content visible. */
;(function () {
  'use strict'

  var reduced = matchMedia('(prefers-reduced-motion: reduce)')

  /* ── Theme ─────────────────────────────────────────────────────────────────────────
     Same contract as src/hooks/useTheme.ts: the neto-theme key is the truth, the OS
     preference is the fallback, and the result is an explicit class on <html>. Sharing the
     key means a visitor who lands here from the app keeps the theme they chose there. */
  var root = document.documentElement
  var toggle = document.querySelector('[data-theme-toggle]')

  // The glyph swap is CSS (see styles.css §3); only the label needs writing, because a
  // screen reader reads the name, not which <svg> the stylesheet chose to draw.
  function paintToggle() {
    if (!toggle) return
    var dark = root.classList.contains('dark')
    toggle.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro')
  }

  /* The app captures come in both themes. A light screenshot on the dark page is the same
     light bomb that came out of the privacy section, so the src is swapped rather than
     shipped twice: two <img> hidden by CSS would both be fetched, and <picture> with
     prefers-color-scheme would follow the OS instead of this page's toggle.
     The markup carries the LIGHT src, so with JS off the images are still there. */
  var captures = document.querySelectorAll('[data-capture]')
  function paintCaptures() {
    var dark = root.classList.contains('dark')
    Array.prototype.forEach.call(captures, function (img) {
      var name = img.getAttribute('data-capture')
      img.setAttribute('src', '/landing/images/' + name + (dark ? '-dark' : '') + '.webp')
    })
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = !root.classList.contains('dark')
      root.classList.toggle('dark', dark)
      try {
        localStorage.setItem('neto-theme', dark ? 'dark' : 'light')
      } catch (e) {
        /* blocked storage: the choice holds for this page view and no further */
      }
      paintToggle()
      paintCaptures()
    })
    paintToggle()
  }
  paintCaptures()

  /* ── Returning users and installed PWAs go straight to the app ─────────────────────
     Once the app moves to /app, every PWA installed before that still opens "/" — its
     manifest said so. Someone who already has data here did not come to read the pitch.
     Deliberately NOT triggered by a Supabase session: reading auth state would mean loading
     the client, and this page loads no bundle. Local data is the cheap, offline-true proxy. */
  var APP_URL = '/panel/'
  function looksLikeAUser() {
    if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return true
    try {
      return localStorage.getItem('amd-finance') !== null
    } catch (e) {
      return false
    }
  }
  // Live as of the /app migration. Before it, redirecting to the app from "/" would have
  // looped, because "/" WAS the app.
  var MIGRATED = true
  if (MIGRATED && looksLikeAUser()) {
    location.replace(APP_URL)
    return
  }
  // Meanwhile the CTAs must still point at something real.
  Array.prototype.forEach.call(document.querySelectorAll('[data-app-link]'), function (a) {
    a.setAttribute('href', MIGRATED ? APP_URL : '/')
  })

  /* ── Sticky nav ────────────────────────────────────────────────────────────────────
     A scroll listener that only writes when the answer changes: the attribute drives a CSS
     transition, and setting it on every frame restarts that transition. */
  var nav = document.querySelector('[data-nav]')
  if (nav) {
    var stuck = null
    var onScroll = function () {
      var next = window.scrollY > 8
      if (next !== stuck) {
        stuck = next
        nav.setAttribute('data-stuck', String(next))
      }
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ── Reveal on scroll ──────────────────────────────────────────────────────────────
     Siblings stagger; the observer disconnects per element once shown, because a reveal
     that re-fires on the way back up reads as a glitch, not as motion. */
  var revealables = document.querySelectorAll('[data-reveal]')

  function showAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.setAttribute('data-shown', 'true')
    })
  }

  if (reduced.matches || !('IntersectionObserver' in window)) {
    showAll()
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          var el = entry.target
          var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > [data-reveal]') : []
          var index = Array.prototype.indexOf.call(siblings, el)
          el.style.setProperty('--reveal-delay', 'calc(var(--motion-stagger-base) * ' + Math.max(index, 0) + ')')
          el.setAttribute('data-shown', 'true')
          observer.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    Array.prototype.forEach.call(revealables, function (el) {
      observer.observe(el)
    })
    // If the OS preference flips mid-visit, stop animating and show what is left.
    reduced.addEventListener('change', function (e) {
      if (e.matches) {
        observer.disconnect()
        showAll()
      }
    })
  }

  /* ── The flow: the hero's month, counted up ────────────────────────────────────────
     One pass, never a loop. The real figures are the markup's own text and the bar's width
     comes from a --pct custom property, so with JS off the card still reads correctly (see
     the <noscript> block in the head). What this does is zero them *because* JS is on, and
     then count back up when the card comes into view. */
  var money = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })

  var flow = document.querySelector('[data-flow]')
  if (flow) {
    var amounts = Array.prototype.map.call(flow.querySelectorAll('[data-flow-amount]'), function (el) {
      return { el: el, to: Number(el.getAttribute('data-flow-amount')) }
    })
    var grossEl = flow.querySelector('[data-flow-gross]')
    var gross = amounts.reduce(function (sum, a) {
      return sum + a.to
    }, 0)
    var segments = flow.querySelectorAll('.flow__seg')

    var paint = function (t) {
      amounts.forEach(function (a) {
        a.el.textContent = money.format(Math.round(a.to * t))
      })
      if (grossEl) grossEl.textContent = money.format(Math.round(gross * t))
    }

    var widen = function () {
      Array.prototype.forEach.call(segments, function (seg) {
        seg.style.width = seg.getAttribute('data-pct') + '%'
      })
    }

    var run = function () {
      if (reduced.matches) {
        paint(1)
        widen()
        return
      }
      widen()
      var start = null
      var DURATION = 1100
      var step = function (now) {
        if (start === null) start = now
        var t = Math.min((now - start) / DURATION, 1)
        // expo-out, the same shape as --motion-easing-enter: fast first, settles at the end.
        paint(t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
        if (t < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    if (!reduced.matches && 'IntersectionObserver' in window) {
      // Zero them only now that we know something will put them back.
      paint(0)
      var flowObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            flowObserver.disconnect()
            run()
          }
        },
        { threshold: 0.3 }
      )
      flowObserver.observe(flow)
    } else {
      // No observer, or the user asked for less movement: the markup is already right,
      // so only the bar needs drawing.
      widen()
    }
  }

  /* ── Intent router ─────────────────────────────────────────────────────────────────
     Mirrors the app's own profile split (PRODUCT.md §8). The choice rides along on the CTA
     so the signup knows who arrived, and is remembered for the next visit. Nothing is sent
     anywhere: it is a query string on our own domain and a key in this browser. */
  var router = document.querySelector('[data-router]')
  var answer = document.querySelector('[data-router-answer]')
  var pills = document.querySelectorAll('[data-pills] [data-tab]')
  var caption = document.querySelector('[data-router-caption]')

  if (router && answer) {
    var options = router.querySelectorAll('[data-profile]')

    var select = function (btn, focusAnswer) {
      Array.prototype.forEach.call(options, function (o) {
        o.setAttribute('aria-pressed', String(o === btn))
      })
      answer.textContent = btn.getAttribute('data-answer')

      // The pill stack shows what the profile actually does: which tabs of the Mes view
      // exist for you (PRODUCT.md §3 — Tributarias and Provisiones are conditional). Three
      // states, not two: before a choice, a tab is neither on nor off, it just exists.
      var on = (btn.getAttribute('data-tabs') || '').split(',')
      Array.prototype.forEach.call(pills, function (pill) {
        pill.setAttribute('data-on', String(on.indexOf(pill.getAttribute('data-tab')) !== -1))
      })
      if (caption) caption.textContent = btn.getAttribute('data-caption')

      var profile = btn.getAttribute('data-profile')
      try {
        localStorage.setItem('neto-landing-perfil', profile)
      } catch (e) {
        /* nothing to remember, nothing breaks */
      }
      Array.prototype.forEach.call(document.querySelectorAll('[data-app-link][data-cta]'), function (a) {
        var base = a.getAttribute('href').split('?')[0]
        a.setAttribute('href', base + '?perfil=' + encodeURIComponent(profile))
      })
      if (focusAnswer) answer.setAttribute('tabindex', '-1')
    }

    Array.prototype.forEach.call(options, function (btn) {
      btn.addEventListener('click', function () {
        select(btn, true)
      })
    })

    // Restore a previous choice without stealing focus or announcing it again.
    try {
      var remembered = localStorage.getItem('neto-landing-perfil')
      if (remembered) {
        var match = router.querySelector('[data-profile="' + remembered + '"]')
        if (match) select(match, false)
      }
    } catch (e) {
      /* no stored choice: the neutral prompt in the markup stands */
    }
  }

  /* ── Footer year ───────────────────────────────────────────────────────────────── */
  var year = document.querySelector('[data-year]')
  if (year) year.textContent = String(new Date().getFullYear())
})()
