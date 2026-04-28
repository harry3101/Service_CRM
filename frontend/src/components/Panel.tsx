import type { ReactNode } from "react";

export default function Panel({
  title,
  actions,
  children,
  className = "",
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`crm-panel ${className}`}>
      {(title || actions) && (
        <div className="crm-panel-header">
          <span>{title}</span>
          {actions}
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}
