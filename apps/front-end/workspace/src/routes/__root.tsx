import {
  HeadContent,
  Scripts,
  Link,
  createRootRoute,
} from "@tanstack/react-router";

import {
  TanStackRouterDevtoolsPanel,
} from "@tanstack/react-router-devtools";

import {
  TanStackDevtools,
} from "@tanstack/react-devtools";

import appCss from "../styles.css?url";

import "../styles/root-navigation.css";


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1",
      },
      {
        title: "Job Portal",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});


function RootDocument({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <head>
        <HeadContent />
      </head>

      <body>

        <header className="site-navigation">

          <nav className="site-navigation-links">

            <Link
              to="/"
              className="site-navigation-link"
              activeProps={{
                className:
                  "site-navigation-link active",
              }}
            >
              Candidate View
            </Link>


            <Link
              to="/admin/screening"
              className="site-navigation-link"
              activeProps={{
                className:
                  "site-navigation-link active",
              }}
            >
              Admin Dashboard
            </Link>

          </nav>

        </header>


        <div className="site-page-content">

          {children}

        </div>


        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render:
                <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />


        <Scripts />

      </body>

    </html>
  );
}