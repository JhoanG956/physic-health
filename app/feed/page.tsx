import { FeedHeader } from "@/components/feed/feed-header"
import { FeedCards } from "@/components/feed/feed-cards"

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        <div className="absolute -top-10 -right-10 h-20 w-20 blob-shape bg-mint/20 animate-float hidden md:block" />
        <div
          className="absolute -bottom-10 -left-10 h-16 w-16 blob-shape bg-sky-blue/20 animate-float hidden md:block"
          style={{ animationDelay: "1s" }}
        />
        <FeedHeader name="Usuario" date={new Date()} />
        <FeedCards />
      </div>
    </div>
  )
}
