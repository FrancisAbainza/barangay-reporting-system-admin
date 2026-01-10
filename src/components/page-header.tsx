type PageHeaderProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export default function PageHeader({title, subtitle, icon}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
  );
}