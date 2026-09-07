import {
  Link,
  useRouter,
} from "@tanstack/react-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  logout,
} from "@/services/auth.service";

import type {
  AuthUser,
} from "@/services/auth.service";

export default function Header() {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const userMenuRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response =
          await getCurrentUser();

        if (
          mounted &&
          response.success &&
          response.data
        ) {
          setUser(response.data);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* CLOSE MENU WHEN CLICKING OUTSIDE */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  async function handleLogout() {
    try {
      setMenuOpen(false);

      await logout();

      setUser(null);

      await router.navigate({
        to: "/login",
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    }
  }

  const role =
    user?.role?.toUpperCase();

  const isCandidate =
    role === "CANDIDATE";

  const isAdmin =
    role === "ADMIN" ||
    role === "SUPER_ADMIN";

  const isRecruiter =
    role === "RECRUITER";

  const isHiringManager =
    role === "HIRING_MANAGER";

  function getInitials() {
    if (!user) {
      return "?";
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      .toUpperCase();
  }

  function getDisplayName() {
    if (!user) {
      return "";
    }

    return `${user.firstName} ${user.lastName}`;
  }

  return (
    <header className="site-navigation">
      <div className="site-navigation-container">

        {/* LOGO */}

        <Link
          to="/"
          className="site-logo"
        >
          <img
            src="/image.webp"
            alt="Job Portal"
            className="site-logo-image"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}

        {!loading && user && (
          <nav className="site-navigation-links">

            {/* ADMIN */}

            {isAdmin && (
              <>
                <Link
                  to="/admin/screening"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/applications"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Applications
                </Link>

                <Link
                  to="/jobs"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Jobs
                </Link>
              </>
            )}

            {/* RECRUITER */}

            {isRecruiter && (
              <>
                <Link
                  to="/admin/screening"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Screening
                </Link>

                <Link
                  to="/admin/applications"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Applications
                </Link>

                <Link
                  to="/jobs"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Jobs
                </Link>
              </>
            )}

            {/* HIRING MANAGER */}

            {isHiringManager && (
              <>
                <Link
                  to="/admin/screening"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Screening
                </Link>

                <Link
                  to="/admin/applications"
                  className="site-navigation-link"
                  activeProps={{
                    className:
                      "site-navigation-link active",
                  }}
                >
                  Applications
                </Link>
              </>
            )}

          </nav>
        )}

        {/* USER AREA */}

        {user && (
          <div
            className="site-navigation-user"
            ref={userMenuRef}
          >

            {/* USER BUTTON */}

            <button
              type="button"
              className="site-user-menu-button"
              onClick={() =>
                setMenuOpen(
                  (current) => !current,
                )
              }
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >

              {user.profileImageUrl ? (
                <img
                  src={
                    user.profileImageUrl
                  }
                  alt={getDisplayName()}
                  className="site-user-avatar"
                />
              ) : (
                <div className="site-user-avatar-placeholder">
                  {getInitials()}
                </div>
              )}

              <div className="site-user-info">
                <strong>
                  {getDisplayName()}
                </strong>

                <span>
                  {role}
                </span>
              </div>

              <span
                className={`site-user-chevron ${
                  menuOpen
                    ? "open"
                    : ""
                }`}
              >
                ˅
              </span>

            </button>

            {/* DROPDOWN */}

            {menuOpen && (
              <div
                className="site-user-dropdown"
                role="menu"
              >

                {/* PROFILE */}

                {isCandidate && (
                  <Link
                    to="/candidate/profile"
                    className="site-user-dropdown-item"
                    activeProps={{
                      className:
                        "site-user-dropdown-item active",
                    }}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span className="site-dropdown-icon">
                      👤
                    </span>

                    <span>
                      My Profile
                    </span>
                  </Link>
                )}

                {/* JOBS */}

                {isCandidate && (
                  <Link
                    to="/jobs"
                    className="site-user-dropdown-item"
                    activeProps={{
                      className:
                        "site-user-dropdown-item active",
                    }}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span className="site-dropdown-icon">
                      💼
                    </span>

                    <span>
                      Jobs
                    </span>
                  </Link>
                )}

                {/* APPLICATIONS */}

                {isCandidate && (
                  <Link
                    to="/candidate/applications"
                    className="site-user-dropdown-item"
                    activeProps={{
                      className:
                        "site-user-dropdown-item active",
                    }}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span className="site-dropdown-icon">
                      📄
                    </span>

                    <span>
                      My Applications
                    </span>
                  </Link>
                )}

                

                {/* DIVIDER */}

                <div className="site-user-dropdown-divider" />

                {/* LOGOUT */}

                <button
                  type="button"
                  className="site-user-dropdown-item logout"
                  onClick={
                    handleLogout
                  }
                  role="menuitem"
                >
                  <span className="site-dropdown-icon">
                    🚪
                  </span>

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </header>
  );
}

