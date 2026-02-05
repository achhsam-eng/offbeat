interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-700 mb-4 font-medium">{title}</p>
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="text-blue-600 hover:underline font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
