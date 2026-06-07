import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EventCard from "@/components/EventCard";
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
  fetchFeatured,
  fetchEvents,
  selectFeatured,
  selectEvents,
  selectEventsLoading,
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
  const featured = useSelector(selectFeatured);
  const events = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchEvents({ limit: 6, sort: "-views" }));
  }, [dispatch]);

  // Carousel shows featured events; falls back to the general list when none are featured.
  const carouselEvents = (featured.length ? featured : events).slice(0, 8);

  return (
    <div>
      <Navigation />
      <div className="p-4 md:p-8">
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

            {loading && carouselEvents.length === 0 ? (
              <div className="h-56 flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
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
                          <EventCard event={event} index={index} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -ms-4.5 p-6" />
                  <CarouselNext className="right-0 -me-4.5 p-6" />
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

          {/* Popular events */}
          {events.length > 0 && (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

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
