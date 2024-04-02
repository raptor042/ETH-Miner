"use client";

import Miner from "@/components/Miner";
import TopBar from "@/components/TopBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" container mx-auto px-4">
      <section id="heading">
        <TopBar />
      </section>
      <section id="home_page">
        <Miner />
      </section>
    </div>
  );
}
