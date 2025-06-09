import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import React from "react";
import { Windmill } from "@roketid/windmill-react-ui";
import type { AppProps } from "next/app";
import withAuth from "utils/withAuth";

function MyApp({ Component, pageProps }: AppProps) {
  const AuthComponent = withAuth(Component);
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  return (
    <Windmill usePreferences={false} dark={false}>
      <AuthComponent {...pageProps} />
    </Windmill>
  );
}
export default MyApp;
