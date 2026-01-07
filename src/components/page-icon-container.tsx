export default function PageIconContainer({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="p-2 bg-primary/10 rounded-lg">
      {children}
    </div>
  );
}