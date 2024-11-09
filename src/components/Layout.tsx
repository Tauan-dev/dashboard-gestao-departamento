import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ display: "flex", minHeight: "100%"}}>
      {/* Sidebar fica fixo à esquerda */}
      <Sidebar />

      {/* O conteúdo principal muda dinamicamente */}
      <div style={{ width:"100%", minHeight: "100vh"}}>
        {children} {/* Aqui será renderizado o conteúdo de cada página */}
      </div>
    </div>
  );
};

export default Layout;
