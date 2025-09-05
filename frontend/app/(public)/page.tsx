import Hero from "@/components/landing/hero";
import AccesoRapido from "@/components/landing/quick-access";
import RecentPublications from "@/components/landing/recent-publications";

export default function Page() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AccesoRapido />
      {/* <RecentPublications /> */}
    </div>
  );
}
