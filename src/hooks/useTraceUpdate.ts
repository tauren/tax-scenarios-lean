import { useEffect, useRef } from 'react';

/**
 * A debugging hook that logs the props/state that have changed since the last render.
 * @param props The props or state object of a component.
 */
export function useTraceUpdate(props: any) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {} as any);

    if (Object.keys(changedProps).length > 0) {
      console.log('A component re-rendered. Changes detected:', changedProps);
    }
    prev.current = props;
  });
}