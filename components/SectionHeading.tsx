interface SectionHeadingProps {
    title: string
    description?: string
}

export default function SectionHeading({ title, description }: SectionHeadingProps) {
    return (
     <div className="m-2">
      <h1 className="text-center text-xl font-bold tracking-tight">{title}</h1>
      {
        description && (
            <p className="text-center text-muted-foreground mt-1">{description}</p>
        )
      }
    </div>
    );
}