export type DecorativeVariant =
  | "bottom-left"
  | "top-right"
  | "top-center"
  | "theme-main"
  | "decoration";

export interface DecorativeImageProps {
  variant: DecorativeVariant;
  className?: string;
  width?: number;
  height?: number;
  zIndex?: number;
  opacity?: number;
  priority?: boolean;
  alt?: string;
}
