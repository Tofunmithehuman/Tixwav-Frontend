import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as motion from "motion/react-client";

const Home = () => {
  const events = [
    {
      id: 1,
      title: "Design systems meetup",
      description:
        "A practical talk on component APIs, accessibility, and shipping faster.",
      image: "https://avatar.vercel.sh/shadcn1",
      Free: true,
    },
    {
      id: 2,
      title: "React Conference 2024",
      description:
        "Join us for the latest in React development and best practices.",
      image: "https://avatar.vercel.sh/shadcn2",
      Free: false,
    },
    {
      id: 3,
      title: "Web Performance Workshop",
      description:
        "Learn to optimize your web applications for speed and efficiency.",
      image: "https://avatar.vercel.sh/shadcn3",
      Free: true,
    },
    {
      id: 4,
      title: "UI/UX Design Trends",
      description:
        "Explore the latest trends in user interface and experience design.",
      image: "https://avatar.vercel.sh/shadcn4",
      Free: false,
    },
    {
      id: 5,
      title: "JavaScript Masterclass",
      description: "Deep dive into advanced JavaScript concepts and patterns.",
      image: "https://avatar.vercel.sh/shadcn5",
      Free: false,
    },
    {
      id: 6,
      title: "AI & Machine Learning",
      description: "Introduction to AI and ML in modern web applications.",
      image: "https://avatar.vercel.sh/shadcn6",
      Free: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      <Navigation />
      <div className="p-4 md:p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Discover Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <motion.h1
              className="text-gray-800 font-light mb-4 text-xl"
              variants={itemVariants}
            >
              Discover the latest events:
            </motion.h1>

            <motion.div className="relative px-2" variants={itemVariants}>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <motion.div
                        className="p-1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <motion.span
                              className="text-3xl font-semibold"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: index * 0.1 + 0.2,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              {index + 1}
                            </motion.span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -ms-4.5 p-6" />
                <CarouselNext className="right-0 -me-4.5 p-6" />
              </Carousel>
            </motion.div>

            <motion.div
              className="mt-8 mx-2 text-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/discover"
                  className="inline-block w-full sm:w-fit bg-[#ff7f11ff] text-white py-2 px-4 hover:bg-[#e66f00] transition-colors rounded-xs"
                >
                  View all events
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>

          <motion.section
            className="mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h1
              className="text-gray-800 font-light mb-4 text-xl"
              variants={itemVariants}
            >
              View popular events:
            </motion.h1>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <Card className="relative pt-0 flex flex-col h-full overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 z-30 aspect-video bg-[#BEB7A4]"
                      initial={{ opacity: 1 }}
                      whileInView={{ opacity: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 group-hover:brightness-75 group-hover:scale-105 transition-all duration-500"
                    />
                    <CardHeader className="flex-1">
                      {event.Free && (
                        <CardAction>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.1 + 0.2,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <Badge variant="secondary">Free</Badge>
                          </motion.div>
                        </CardAction>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <CardTitle>{event.title}</CardTitle>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <CardDescription>{event.description}</CardDescription>
                      </motion.div>
                    </CardHeader>
                    <CardFooter>
                      <motion.div
                        className="w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full rounded-xs">
                          View Event
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
