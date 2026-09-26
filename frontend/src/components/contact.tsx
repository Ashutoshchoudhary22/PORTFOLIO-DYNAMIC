"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleContactSubmit } from "@/app/action";
import { useToast } from "@/hooks/use-toast";
import { SectionBackground } from "@/components/section-background";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { Mail, MessageSquare, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const fieldClassName =
  "h-11 rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/45 backdrop-blur-md transition-all focus-visible:border-violet-400/60 focus-visible:ring-violet-400/25";

export function Contact() {
  const { toast } = useToast();
  const { profile } = usePortfolioContext();
  const contactEmail = profile?.contactEmail || "akkychoudhary5468@gmail.com";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await handleContactSubmit(values);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  }

  return (
    <section id="contact" className="portfolio-section relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 z-0">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="contact"
          fallback="/feature-4.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mx-auto max-w-[700px] text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] md:text-6xl">
            Let&apos;s Build Something Great
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-base font-medium leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-lg">
            Have a project, product, or team opportunity in mind? Send a message
            or email me directly.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-violet-400/40 hover:bg-white/15"
          >
            <Mail className="h-4 w-4 text-violet-300" />
            {contactEmail}
          </a>
        </div>

        <Card className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-black/55 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

          <CardHeader className="space-y-2 pb-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/15">
                <MessageSquare className="h-5 w-5 text-violet-300" />
              </span>
              <div>
                <CardTitle className="font-headline text-2xl text-white">
                  Contact Me
                </CardTitle>
                <CardDescription className="text-white/60">
                  I usually reply within 24 hours.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-white/85">
                        <User className="h-3.5 w-3.5 text-violet-300" />
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className={fieldClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-white/85">
                        <Mail className="h-3.5 w-3.5 text-violet-300" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className={fieldClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-white/85">
                        <MessageSquare className="h-3.5 w-3.5 text-violet-300" />
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project or just say hello!"
                          className={cn(fieldClassName, "min-h-[130px] py-3")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-12 w-full rounded-xl border-0 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.01] hover:shadow-violet-500/45 disabled:opacity-70"
                >
                  {form.formState.isSubmitting ? (
                    "Sending..."
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
