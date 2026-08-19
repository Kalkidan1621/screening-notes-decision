import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="site-navigation">
      <div className="site-navigation-container">

        <Link
          to="/"
          className="site-logo"
        >
          <img
            src="/image.webp"
            alt="Muyalogy"
            className="site-logo-image"
          />
        </Link>

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

      </div>
    </header>
  );
}