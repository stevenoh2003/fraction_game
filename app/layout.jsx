import "@styles/globals.css";

import Nav2 from "@components/Nav2";


export const metadata = {
  title: "Fraction Game",
  description: "Math Mastery Through Play",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
          <Nav2 />
          {children}
    </body>
  </html>
);

export default RootLayout;
