import { Link } from "@nextui-org/react";

export default function Header({ title }: { children?: React.ReactNode; title?: string }) {
  return (
    <header className="bg-background flex justify-between items-center min-h-12">
      <div className="flex items-center">
        {/* {children} */}
        {/* TODO: Implement the possibility of adding children to the header, for custom actions */}

        <h1 className="text-4xl font-normal">{title}</h1>
      </div>

      {/* Development Credits */}
      <span className="text-small !text-gray-400">
        Desarrollado por <Link href="https://bout.sh" size="sm" className="text-gray-400" isExternal showAnchorIcon>Bout</Link>
      </span>
    </header>
  );
}