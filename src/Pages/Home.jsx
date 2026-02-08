import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

  return (
    <div>
      <Navigation />
      <div className="p-4 md:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <section>
            <h1 className="text-gray-800 font-light mb-4 text-xl">
              Discover the latest events:
            </h1>

            <div className="relative px-2">
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
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-3xl font-semibold">
                              {index + 1}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -ms-4.5 p-6" />
                <CarouselNext className="right-0 -me-4.5 p-6" />
              </Carousel>
            </div>

            <div className="mt-8 mx-2 text-center">
              <Link
                to="/discover"
                className="inline-block w-full sm:w-fit bg-[#ff7f11ff] text-white py-2 px-4 hover:bg-[#e66f00] transition-colors"
              >
                View all events
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <h1 className="text-gray-800 font-light mb-4 text-xl">
              View popular events:
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="relative pt-0 flex flex-col h-full"
                >
                  <div className="absolute inset-0 z-30 aspect-video bg-[#BEB7A4]" />
                  <img
                    src={event.image}
                    alt={event.title}
                    className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                  />
                  <CardHeader className="flex-1">
                    {event.Free && (
                      <CardAction>
                        <Badge variant="secondary">Free</Badge>
                      </CardAction>
                    )}
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full">View Event</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
