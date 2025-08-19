export default function SectionTitle({ children }: { children: React.ReactNode } ) {
    return (
     <div  className="px-8 xl:px-24 font-bold">
      <p className="text-lg font-bold tracking-tight">{children}</p>
    </div>
    );
}