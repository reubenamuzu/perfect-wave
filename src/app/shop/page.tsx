import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import { connectDB } from '@/lib/db'
import Bundle from '@/models/Bundle'
import Frame from '@/models/Frame'
import NetworkTabs from '@/components/shop/NetworkTabs'
import FrameGrid from '@/components/shop/FrameGrid'
import PageTransition from '@/components/shared/PageTransition'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HowToOrderModal from '@/components/shop/HowToOrderModal'
import type { IBundle, IFrame } from '@/types'

export const metadata: Metadata = {
  title: 'Shop — Data Bundles & Picture Frames',
  description: 'Browse affordable data bundles from MTN, Telecel, AirtelTigo and premium picture frames.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const defaultTab = params.tab === 'frames' ? 'frames' : 'bundles'

  let bundles: IBundle[] = []
  let frames: IFrame[] = []

  try {
    await connectDB()
    const [rawBundles, rawFrames] = await Promise.all([
      Bundle.find({ isActive: true }).sort({ sortOrder: 1, sizeValue: 1 }).lean(),
      Frame.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    ])
    bundles = JSON.parse(JSON.stringify(rawBundles))
    frames = JSON.parse(JSON.stringify(rawFrames))
  } catch {
    // show empty state
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        {/* Header */}
        <div className="py-10 px-4 bg-[#F4F8FC]">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Products</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#1A2E42] mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Shop
            </h1>
            <p className="text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif' }}>Data bundles & picture frames — all in one place</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <HowToOrderModal />
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-8 flex justify-center bg-white border-2 border-[#C8DFF0] p-1 rounded-2xl h-auto w-fit mx-auto">
              <TabsTrigger
                value="bundles"
                className="px-8 py-3 rounded-xl text-base font-medium text-[#5A7A99] data-[state=active]:bg-[#1B6CA8]! data-[state=active]:text-white! data-[state=active]:shadow-md"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Data Bundles
              </TabsTrigger>
              <TabsTrigger
                value="frames"
                className="px-8 py-3 rounded-xl text-base font-medium text-[#5A7A99] data-[state=active]:bg-[#1B6CA8]! data-[state=active]:text-white! data-[state=active]:shadow-md"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Picture Frames
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bundles">
              <NetworkTabs bundles={bundles} />
            </TabsContent>

            <TabsContent value="frames">
              <FrameGrid frames={frames} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}
