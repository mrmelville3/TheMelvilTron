
export default function ColumnHeader( { children }: { children: React.ReactNode } ) {
    return (
      <h1 className="m-2 text-center text-xs sm:text-lg font-bold tracking-tight">{children}</h1>

    );
  }