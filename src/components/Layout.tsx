import { ReactNode } from "react";
import Sidebar from "./Sidebar"; 


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar fica fixo à esquerda */}
      <Sidebar />

      {/* O conteúdo principal muda dinamicamente */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        {children} {/* Aqui será renderizado o conteúdo de cada página */}
      </div>
    </div>
  );
};

export default Layout;
