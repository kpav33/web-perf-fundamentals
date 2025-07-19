import { AnchorHTMLAttributes, useEffect } from "react";

import { useNavigate } from "@fe/utils/use-client-router";

// const preloadingMap = {
//   '/': () => import('./pages/dashboard'),
//   '/settings': () => import('./pages/settings'),
//   '/inbox': () => import('./pages/inbox'),
//   '/login': () => import('./pages/login'),
//   };

export const Link = ({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (href && preloadingMap[href]) {
  //     const preload = preloadingMap[href];
  //     preload();
  //   }
  // }, [href]);

  return href ? (
    <a
      {...props}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  ) : (
    <a {...props}>{children}</a>
  );
};
