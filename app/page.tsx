import Image from "next/image";

import { RankerMenu } from "@/components/RankerMenu";
import { ModeToggle } from "@/components/ModeToggle";
import { NavBar } from "@/components/Nav";
import TabProvider from "@/components/TabProvider";

export default function Home() {
  return (
    <TabProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
          <NavBar />
          <ModeToggle />
        </div>

        <div className="relative flex place-items-center">
          <RankerMenu />
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          
        </div>
      </main>
    </TabProvider>
  );
}
