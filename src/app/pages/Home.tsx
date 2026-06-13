import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { PlanBuilder } from "../components/PlanBuilder";
import { Products } from "../components/Products";
import { FAQ } from "../components/FAQ";
import { AboutUs } from "../components/AboutUs";
import { Waitlist } from "../components/Waitlist";

export function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PlanBuilder />
      <Products />
      <FAQ />
      <AboutUs />
      <Waitlist />
    </main>
  );
}
