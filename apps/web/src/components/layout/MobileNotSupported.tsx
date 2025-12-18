export const MobileNotSupported = () => {
  return (
    <div className="flex md:hidden min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center space-y-4 max-w-md">
        <svg
          className="w-20 h-20 mx-auto text-(--color-primary)"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-foreground">
          กรุณาใช้งานบนอุปกรณ์ที่มีหน้าจอใหญ่ขึ้น
        </h1>
        <p className="text-(--color-muted)">
          ขณะนี้แอปพลิเคชันยังไม่รองรับการใช้งานบนมือถือ
          <br />
          กรุณาเข้าใช้งานผ่าน iPad หรือคอมพิวเตอร์
        </p>
      </div>
    </div>
  );
};
