import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Breadcumb.module.css";

export default function Breadcrumbs() {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter((segment) => segment);

  return (
    <nav className={styles.breadcrumb}>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return isLast ? (
          <span key={path} className={styles.active}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </span>
        ) : (
          <span key={path}>
            <Link href={path} className={styles.link}>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
            <span className={styles.separator}> / </span>
          </span>
        );
      })}
    </nav>
  );
}
