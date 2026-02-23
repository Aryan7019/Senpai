"use client";
import HeroSection from "@/components/hero";
import FAQSection from "@/components/faq-section";
import { Card, CardContent } from "@/components/ui/card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import { Star, Quote } from "lucide-react";


export default function Home() {
  return (
    <div className="relative bg-black">
      <HeroSection />
      
      {/* Stats Bar - Enhanced with gradient divider */}
      <section className="w-full py-16 md:py-20 bg-black border-y border-primary/20 relative overflow-hidden">
        {/* Animated gradient lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,174,63,0.03),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-2 group cursor-pointer relative">
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">98%</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider relative z-10">Success Rate</p>
            </div>
            <div className="text-center space-y-2 group cursor-pointer relative">
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">10k+</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider relative z-10">Active Users</p>
            </div>
            <div className="text-center space-y-2 group cursor-pointer relative">
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">50+</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider relative z-10">Industries</p>
            </div>
            <div className="text-center space-y-2 group cursor-pointer relative">
              <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">24/7</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider relative z-10">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean design with balanced background */}
      <section id="features" className="w-full py-20 md:py-32 bg-black relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-primary/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>AI-Powered Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Tools for the <span className="text-primary">Modern Professional</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Our suite of AI-powered tools is designed to help you succeed in every aspect of your career journey.
            </p>
          </div>
          
          <HoverEffect items={features} className="max-w-7xl mx-auto" />
        </div>
      </section>

      {/* Success Stories - Premium Design */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-black via-black to-primary/5 border-y border-primary/20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        {/* Decorative elements - perfect middle ground */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/22 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[550px] h-[550px] bg-primary/22 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-primary" />
                <span>Client Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Success <span className="text-primary">Stories</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Discover how professionals like you achieved their career goals with SenpAI
              </p>
            </div>
            
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonial.map((item, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
                  
                  <Card className="relative bg-gradient-to-br from-black to-primary/5 border-white/10 rounded-2xl hover:border-primary/30 transition-all duration-300 h-full">
                    <CardContent className="pt-8 pb-8 px-8">
                      <div className="flex flex-col h-full">
                        {/* Quote icon */}
                        <div className="mb-6">
                          <Quote className="w-10 h-10 text-primary/30" />
                        </div>
                        
                        {/* Quote text */}
                        <p className="text-base text-gray-300 leading-relaxed mb-6 flex-grow">
                          {item.quote}
                        </p>
                        
                        {/* Rating stars */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        
                        {/* Author info */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                            <Image
                              width={56}
                              height={56}
                              src={item.image}
                              alt={item.author}
                              className="relative rounded-full object-cover ring-2 ring-primary/20"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">{item.author}</p>
                            <p className="text-sm text-primary">{item.role}</p>
                            <p className="text-xs text-gray-500">{item.company}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <p className="text-gray-400 mb-4">Join thousands of satisfied professionals</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {testimonial.slice(0, 3).map((item, i) => (
                    <Image
                      key={i}
                      width={32}
                      height={32}
                      src={item.image}
                      alt={item.author}
                      className="rounded-full border-2 border-black"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">+10,000 professionals trust SenpAI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - With glow */}
      <FAQSection />

    </div>
  );
}
