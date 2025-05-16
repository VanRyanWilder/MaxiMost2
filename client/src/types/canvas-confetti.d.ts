declare module 'canvas-confetti' {
  export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  export interface CreateTypes {
    (options?: ConfettiOptions): Promise<void> | null;
    reset: () => void;
  }

  export function create(
    canvas: HTMLCanvasElement,
    options?: { resize?: boolean; useWorker?: boolean }
  ): CreateTypes;

  const confetti: CreateTypes & {
    create: typeof create;
  };

  export default confetti;
}