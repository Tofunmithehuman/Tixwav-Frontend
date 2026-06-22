import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EventCard from "@/components/EventCard";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as motion from "motion/react-client";
import {
  fetchLatest,
  fetchPopular,
  selectLatest,
  selectPopular,
} from "@/store/slices/eventSlice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Home = () => {
  const dispatch = useDispatch();
  const latest = useSelector(selectLatest);
  const popular = useSelector(selectPopular);
  // fetchLatest/fetchPopular don't drive the shared loading flag, so track the
  // first load locally — this lets us reserve space with skeletons until the
  // data lands, instead of an empty page that shoves the footer down (CLS).
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchLatest()),
      dispatch(fetchPopular()),
    ]).finally(() => setLoaded(true));
  }, [dispatch]);

  // Carousel shows the latest (most recently uploaded) active events.
  const carouselEvents = latest.slice(0, 8);

  return (
    <div>
      <Seo
        description="Discover and book tickets for the best events across Nigeria — concerts, conferences, festivals and more. Sell your own event with payouts straight to your bank."
        path="/"
      />
      <Navigation />
      <main className="p-4 md:p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Hero / featured */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-1">
                Tixwav
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">
                Discover the latest events
              </h1>
            </motion.div>

            {!loaded && carouselEvents.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : carouselEvents.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div className="relative px-2" variants={itemVariants}>
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent>
                    {carouselEvents.map((event, index) => (
                      <CarouselItem
                        key={event._id}
                        className="basis-full sm:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <EventCard
                            event={event}
                            index={index}
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -ms-4.5 p-6 bg-white text-neutral-700 border border-neutral-200 shadow-md hover:bg-neutral-50" />
                  <CarouselNext className="right-0 -me-4.5 p-6 bg-white text-neutral-700 border border-neutral-200 shadow-md hover:bg-neutral-50" />
                </Carousel>
              </motion.div>
            )}

            <motion.div className="mt-8 mx-2 text-center" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/discover"
                  className="inline-block w-full sm:w-fit bg-[#ff7f11ff] text-white py-2 px-4 hover:bg-[#e66f00] transition-colors rounded-xs"
                >
                  View all events
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Popular events — most ticket sales among active events */}
          {(!loaded || popular.length > 0) && (
            <motion.section
              className="mt-16"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h2
                className="text-gray-800 font-light mb-4 text-xl"
                variants={itemVariants}
              >
                Popular events
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {popular.length > 0
                  ? popular.map((event, index) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        index={index}
                        mobileButton
                      />
                    ))
                  : Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col h-full bg-white border border-neutral-100 rounded-lg overflow-hidden shadow-sm">
    <div className="aspect-square bg-neutral-100 animate-pulse" />
    <div className="p-4 space-y-2.5">
      <div className="h-3.5 w-4/5 bg-neutral-100 rounded animate-pulse" />
      <div className="h-2.5 w-1/2 bg-neutral-100 rounded animate-pulse" />
      <div className="h-2.5 w-2/3 bg-neutral-100 rounded animate-pulse" />
      <div className="h-8 bg-neutral-100 rounded animate-pulse mt-2" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl">
    <p className="text-sm font-medium text-neutral-500">No events yet</p>
    <p className="text-xs text-neutral-400 mt-1">
      Check back soon — or{" "}
      <Link to="/become-organizer" className="text-[#ff7f11] hover:underline">
        host your own
      </Link>
      .
    </p>
  </div>
);

export default Home;
