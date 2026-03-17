'use client'
import { createContext, useContext, useEffect, useRef } from 'react'

interface TourContextValue {
  startTour: () => void
}

const TourContext = createContext<TourContextValue>({ startTour: () => {} })

export function TourProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const driverRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true
    import('driver.js').then(({ driver }) => {
      if (!mounted) return
      driverRef.current = driver({
        overlayColor: 'rgba(13, 79, 130, 0.6)',
        overlayOpacity: 1,
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: 'perfectwave-tour-popover',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: 'Done ✓',
        showProgress: true,
        progressText: '{{current}} of {{total}}',
        allowClose: true,
        animate: true,
        smoothScroll: true,
        steps: [
          {
            popover: {
              title: '👋 Welcome to PerfectWave!',
              description:
                'Your one-stop shop for affordable data bundles and beautiful picture frames. ' +
                'Let us show you around — it only takes a minute.',
              side: 'over',
              align: 'center',
            },
          },
          {
            element: '#site-navbar',
            popover: {
              title: 'Navigation',
              description:
                'Use the menu to browse our Shop, view the Gallery, read Reviews, or track an existing order.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#bundles-section',
            popover: {
              title: '📦 Data Bundles',
              description:
                'We offer affordable data bundles for MTN, Telecel, and AirtelTigo. ' +
                'Browse popular plans right here or visit the Shop for the full range.',
              side: 'top',
              align: 'center',
            },
          },
          {
            element: '#first-bundle-card',
            popover: {
              title: '🛒 Ordering is Easy',
              description:
                'Click "Order via WhatsApp" on any bundle. ' +
                'A quick form collects your details, then WhatsApp opens with your order ready to send.',
              side: 'right',
              align: 'center',
            },
          },
          {
            element: '#frames-section',
            popover: {
              title: '🖼️ Picture Frames',
              description:
                'Browse our collection of premium picture frames. ' +
                'Choose a style, size, and material — then order in seconds.',
              side: 'top',
              align: 'center',
            },
          },
          {
            element: '#frame-designer-link',
            popover: {
              title: '✨ Custom Frame Designer',
              description:
                'Upload your own photo and see it live inside any frame before ordering. ' +
                'No guessing — what you see is what you get.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '#track-order-link',
            popover: {
              title: '🔍 Track Your Order',
              description:
                "Already placed an order? Enter your Order ID to see real-time status updates — from processing to delivery.",
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '#whatsapp-float-btn',
            popover: {
              title: '💬 Need Help?',
              description:
                "Tap this button anytime to chat with us directly on WhatsApp. We're always happy to help with orders or questions.",
              side: 'left',
              align: 'end',
            },
          },
          {
            popover: {
              title: "🎉 You're all set!",
              description:
                "That's everything! Browse our bundles and frames, or order straight away. We're just a WhatsApp message away.",
              side: 'over',
              align: 'center',
            },
          },
        ],
      })
    })

    return () => {
      mounted = false
      driverRef.current?.destroy()
    }
  }, [])

  const startTour = () => driverRef.current?.drive()

  return <TourContext.Provider value={{ startTour }}>{children}</TourContext.Provider>
}

export function useTour() {
  return useContext(TourContext)
}
