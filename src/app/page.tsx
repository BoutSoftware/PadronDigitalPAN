import { Button, Link } from "@nextui-org/react";
import NextLink from "next/link";

export default function Home() {
  return (
    <main className="flex-1 p-4">
      <div className="flex flex-col gap-4 justify-start items-start">
        <p>Hello, world!</p>
        <span className="material-symbols-outlined large filled text-yellow-300">star</span>
        <span className="material-symbols-outlined large">star</span>
        <span className="material-symbols-outlined large filled">key</span>
        <span className="material-symbols-outlined large text-cyan-700">key</span>
        <span className="material-symbols-outlined filled">key</span>
        <span className="material-symbols-outlined">key</span>
        <span className="material-symbols-outlined filled small">key</span>
        <span className="material-symbols-outlined small">key</span>
        <Button>Click me</Button>
        <Link as={NextLink} href="/dashboard">Go to dashboard</Link>
      </div>
    </main>
  );
}
