interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
    return (
     <div className="m-2">
      <h1 className="text-center text-xl font-bold tracking-tight">{children}</h1>
    </div>
    );
}