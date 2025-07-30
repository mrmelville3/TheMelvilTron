interface PageHeadingProps {
    title: string
    description?: string
}

export default function PageHeading({ title, description }: PageHeadingProps) {
    return (
     <div className="m-2">
      <h1 className="text-center text-3xl font-bold tracking-tight">{title}</h1>
      {
        description && (
            <p className="text-center text-muted-foreground mt-1">{description}</p>
        )
      }
    </div>
    );
}