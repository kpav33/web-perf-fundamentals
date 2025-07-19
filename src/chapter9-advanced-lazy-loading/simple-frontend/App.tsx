import { lazy, Suspense } from "react";

import { AppLayout } from "@fe/patterns/app-layout";
import { usePath } from "@fe/utils/use-client-router";

// import { DashboardPage } from "./pages/dashboard";
// import { InboxPage } from "./pages/inbox";
// import { LoginPage } from "./pages/login";
// import { SettingsPage } from "./pages/settings";

const SettingsPageLazy = lazy(async () => {
  return {
    default: (await import("./pages/settings")).SettingsPage,
  };
});

const LoginPageLazy = lazy(async () => {
  return {
    default: (await import("./pages/login")).LoginPage,
  };
});

const InboxPageLazy = lazy(async () => {
  return {
    default: (await import("./pages/inbox")).InboxPage,
  };
});

const DashboardPageLazy = lazy(async () => {
  return {
    default: (await import("./pages/dashboard")).DashboardPage,
  };
});

export default function App({ ssrPath }: { ssrPath?: string }) {
  const path = usePath(ssrPath);

  // if (path.startsWith("/settings")) {
  //   return <SettingsPage />;
  // }

  // switch (path) {
  //   case "/login":
  //     return <LoginPage />;
  //   case "/inbox":
  //     return <InboxPage />;
  //   default:
  //     return <DashboardPage />;
  // }

  if (path.startsWith("/settings")) {
    return (
      <Suspense>
        <SettingsPageLazy />
      </Suspense>
    );
  }

  switch (path) {
    case "/login":
      return (
        <Suspense>
          <LoginPageLazy />
        </Suspense>
      );

    case "/inbox":
      return (
        <Suspense>
          <InboxPageLazy />
        </Suspense>
      );
    default:
      return (
        // <Suspense>
        //   <DashboardPageLazy />
        // </Suspense>
        <AppLayout>
          <Suspense>
            <DashboardPageLazy />
          </Suspense>
        </AppLayout>
      );
  }
}
