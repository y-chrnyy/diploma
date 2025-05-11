export const Truncate = ({ children, limit, className }: { children: React.ReactNode, limit: number, className?: string }) => {
  return <div style={{
    display: "-webkit-box",
    WebkitLineClamp: limit,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }} className={className}>{children}</div>;
};