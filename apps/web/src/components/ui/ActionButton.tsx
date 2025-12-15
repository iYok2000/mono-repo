"use client";

type Props = {
  href?: string;
};

export const ActionButton = ({ href = "https://github.com/" }: Props) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-primary) p-2.5 text-background opacity-100 transition duration-200 hover:opacity-90"
    aria-label="GitHub"
  >
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.39.6.11.793-.26.793-.58 0-.29-.01-1.05-.016-2.06-3.338.73-4.042-1.61-4.042-1.61-.546-1.39-1.333-1.76-1.333-1.76-1.09-.75.082-.736.082-.736 1.205.08 1.84 1.24 1.84 1.24 1.07 1.84 2.807 1.31 3.492 1 .107-.78.418-1.31.76-1.61-2.665-.3-5.466-1.33-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.52.116-3.16 0 0 1.008-.32 3.3 1.23a11.5 11.5 0 0 1 3.004-.4c1.02.005 2.047.137 3.004.4 2.29-1.55 3.297-1.23 3.297-1.23.654 1.64.242 2.86.118 3.16.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.815 1.1.815 2.22 0 1.6-.015 2.88-.015 3.27 0 .32.19.7.8.58C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0Z" />
    </svg>
  </a>
);
