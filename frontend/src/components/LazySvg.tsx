// Source - https://stackoverflow.com/a/61472427
// Posted by junwen-k, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-03, License - CC BY-SA 4.0

import UnkownIcon from '../assets/icons/unknown.svg?react';
import { useEffect, useRef, useState, type ComponentProps, type FC } from "react";

interface LazySvgProps extends ComponentProps<"svg"> {
  name: string;
}

// This hook can be used to create your own wrapper component.
const useLazySvgImport = (name: string) => {
  const importRef = useRef<FC<ComponentProps<"svg">> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        importRef.current = (
          await import(`../assets/icons/${name}.svg?react`)
        ).default; // We use `?react` here following `vite-plugin-svgr`'s convention.
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  return {
    error,
    loading,
    Svg: importRef.current,
  };
};

// Example wrapper component using the hook.
export const LazySvg = ({ name, ...props }: LazySvgProps) => {
  const { loading, error, Svg } = useLazySvgImport(name);

  if (error) {
    return <UnkownIcon {...props} />;
  }

  if (loading) {
    return "Loading...";
  }

  if (!Svg) {
    return null;
  }

  return <Svg {...props} />;
};
