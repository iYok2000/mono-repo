export default function Loading() {
  return (
    <main className="relative min-h-screen bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-(--color-border) border-t-(--color-primary)"></div>
            <p className="text-lg text-(--color-muted)">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
