export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-(--color-border) border-t-(--color-primary)"></div>
          <p className="text-lg text-(--color-muted)">กำลังโหลด...</p>
        </div>
    </div>
  );
}
