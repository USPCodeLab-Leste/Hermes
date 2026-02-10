// Source - https://stackoverflow.com/a/61472427
// Posted by junwen-k, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-03, License - CC BY-SA 4.0

import UnkownIcon from '../assets/icons/unknown.svg?react';
import { useEffect, useRef, useState, type ComponentProps, type FC } from "react";

interface LazySvgProps extends ComponentProps<"svg"> {
  name: string;
}

// This hook can be used to create your own wrapper component.
const SIMULATED_DELAY_MS = 1500;

const useLazySvgImport = (name: string) => {
  const importRef = useRef<FC<ComponentProps<"svg">> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    const importIcon = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        if (cancelled) return;

        importRef.current = (
          await import(`../assets/icons/${name}.svg?react`)
        ).default; // We use `?react` here following `vite-plugin-svgr`'s convention.
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    importIcon();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return {
    error,
    loading,
    Svg: importRef.current,
  };
};

// Example wrapper component using the hook.
export const LazySvg = ({ name, className, ...props }: LazySvgProps) => {
  const { loading, error, Svg } = useLazySvgImport(name);

  if (error) {
    return <UnkownIcon className={className} {...props} />;
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center relative ${className}`}>
        <div aria-hidden="true" className='loader size-full'></div>
      </div>
    );
  }

  if (!Svg) {
    return null;
  }

  return <Svg className={className} {...props} />;
};
