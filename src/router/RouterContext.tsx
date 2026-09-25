import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

interface RouterContextType {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseCurrentLocation(): { path: string; search: string } {
  // Check hash first for maximum iframe and static hosting reliability
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    const raw = hash.slice(1); // remove '#'
    const [pathPart, searchPart] = raw.split('?');
    return { path: pathPart || '/', search: searchPart ? `?${searchPart}` : '' };
  } else if (hash && hash.startsWith('#')) {
    const raw = hash.slice(1);
    const [pathPart, searchPart] = raw.split('?');
    return { path: `/${pathPart}`.replace('//', '/'), search: searchPart ? `?${searchPart}` : '' };
  }

  // Fallback to pathname
  const pathname = window.location.pathname;
  return {
    path: pathname === '' ? '/' : pathname,
    search: window.location.search,
  };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(() => {
    const { path, search } = parseCurrentLocation();
    return {
      path,
      params: {},
      searchParams: new URLSearchParams(search),
    };
  });

  const extractRouteState = useCallback((targetUrl: string): RouteState => {
    let cleanUrl = targetUrl;
    if (cleanUrl.startsWith('#/')) cleanUrl = cleanUrl.slice(1);
    else if (cleanUrl.startsWith('#')) cleanUrl = '/' + cleanUrl.slice(1);

    const [pathname, searchStr] = cleanUrl.split('?');
    const params: Record<string, string> = {};

    // Pattern matching for /product/:id
    const productMatch = pathname.match(/^\/product\/([^/]+)/);
    if (productMatch) {
      params.id = productMatch[1];
    }

    // Pattern matching for /order-confirmation/:id
    const orderMatch = pathname.match(/^\/order-confirmation\/([^/]+)/);
    if (orderMatch) {
      params.id = orderMatch[1];
    }

    return {
      path: pathname || '/',
      params,
      searchParams: new URLSearchParams(searchStr || ''),
    };
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      // Ensure smooth scroll to top on page navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });

      let target = to;
      if (!target.startsWith('/') && !target.startsWith('#')) {
        target = `/${target}`;
      }

      const nextState = extractRouteState(target);
      setRoute(nextState);

      // Synchronize both hash and history state for ultimate resilience on all hosting platforms
      const hashUrl = `#${target.startsWith('#') ? target.slice(1) : target}`;
      if (options?.replace) {
        window.history.replaceState(null, '', hashUrl);
      } else {
        window.history.pushState(null, '', hashUrl);
      }
    },
    [extractRouteState]
  );

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/catalog');
    }
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      const { path, search } = parseCurrentLocation();
      const next = extractRouteState(`${path}${search}`);
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [extractRouteState]);

  return (
    <RouterContext.Provider
      value={{
        path: route.path,
        params: route.params,
        searchParams: route.searchParams,
        navigate,
        goBack,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
