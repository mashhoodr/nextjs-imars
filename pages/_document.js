import { Html, Head, Main, NextScript } from "next/document";

/**
 * Exists for one reason: `lang`. Without it, screen readers guess the
 * pronunciation language and Lighthouse fails `html-has-lang`. The copy is
 * British English, which is worth declaring precisely.
 */
export default function Document() {
  return (
    <Html lang="en-GB">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
