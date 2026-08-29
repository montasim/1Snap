import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
        {children}
      </g>
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="8" y="8" width="11" height="12" rx="1" />
      <path d="M16 8V4H5v12h3" />
    </IconBase>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12m-4-4 4 4 4-4M4 20h16" />
    </IconBase>
  );
}

export function AnnotateIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Z" />
      <path d="m13.8 7 3.2 3.2M4 20h5" />
    </IconBase>
  );
}

export function PointerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3l13 9-6 1.5L9 20 5 3Z" />
    </IconBase>
  );
}

export function MarkerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 17 10-10 3 3L8 20H5v-3Z" />
      <path d="m13 9 3 3M4 21h8" />
    </IconBase>
  );
}

export function HighlightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="6" width="16" height="12" />
      <path d="M7 15h10" strokeWidth="3.5" opacity="0.5" />
    </IconBase>
  );
}

export function BorderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="14" />
      <path d="M8 5V3M16 5V3M8 21v-2M16 21v-2" />
    </IconBase>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6" />
    </IconBase>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m15 7 5 5-5 5M19 12h-8a6 6 0 0 0-6 6" />
    </IconBase>
  );
}

export function ClearIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 7h14M9 3h6l1 4H8l1-4ZM8 10v8M12 10v8M16 10v8M7 7l1 14h8l1-14" />
    </IconBase>
  );
}

export function FramesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="7" y="7" width="12" height="12" />
      <path d="M16 7V4H4v12h3" />
    </IconBase>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </IconBase>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </IconBase>
  );
}
