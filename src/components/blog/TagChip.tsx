interface TagChipProps {
  tag: string;
  onClick?: (tag: string) => void;
  active?: boolean;
}

const TagChip = ({ tag, onClick, active = false }: TagChipProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(tag);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Filter by tag: ${tag}`}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
      }`}
    >
      #{tag}
    </button>
  );
};

export default TagChip;
