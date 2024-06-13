import { Link } from "@nextui-org/react";

export default function Header({ title }: { children?: React.ReactNode; title?: string | React.ReactNode }) {
  return (
    <header className="bg-background flex justify-between items-center min-h-12">
      <h1 className="text-4xl font-normal flex items-center">{title}</h1>

      {/* Development Credits */}
      <span className="text-small !text-gray-400">
        Desarrollado por <Link href="https://bout.sh" size="sm" className="text-gray-400" isExternal showAnchorIcon>Bout</Link>
      </span>
    </header>
  );
}