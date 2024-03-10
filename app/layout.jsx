import "@styles/globals.css";

import Nav2 from "@components/Nav2";

import Provider from "@components/Provider";

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
          <Nav2 />
          {children}
      </Provider>
    </body>
  </html>
);

export default RootLayout;
