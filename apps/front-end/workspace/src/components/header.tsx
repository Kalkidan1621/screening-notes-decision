
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  getCurrentUser,
  logout,
  type AuthUser,
} from "@/services/auth.service";

import "@/styles/root-navigation.css";

type IconName =
  | "dashboard"
  | "applications"
  | "profile"
  | "jobs"
  | "management"
  | "account"
  | "logout";

function Icon({ name }: { name: IconName }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "applications":
      return (
        <svg {...commonProps}>
          <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );

    case "profile":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "jobs":
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 11h18M10 11v2h4v-2" />
        </svg>
      );

    case "management":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 21a6 6 0 0 1 12 0M14 21a5 5 0 0 1 7 0" />
        </svg>
      );

    case "account":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      );

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="m14 8 4 4-4 4M18 12H9" />
        </svg>
      );

    default:
      return null;
  }
}

function formatRole(role?: string) {
  if (!role) return "";

  return role
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await getCurrentUser();

        if (mounted) {
          setUser(
            response.success ? response.data ?? null : null,
          );
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      setUser(null);
      setMenuOpen(false);
      setMobileMenuOpen(false);

      await router.navigate({ to: "/login" });
    } catch (error) {
      console.error("Unable to sign out:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const role = user?.role?.toUpperCase();

  const isCandidate = role === "CANDIDATE";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const displayName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") || "User";

  const formattedRole = formatRole(user?.role);

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`
      .toUpperCase() || "U";

  function closeMenus() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-navigation">
        <Link
          to="/"
          className="site-logo"
          aria-label="Muyalogy Recruitment home"
          onClick={closeMenus}
        >
          <img
            src="/image.webp"
            alt="Muyalogy Recruitment"
            className="site-logo-image"
          />
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={
            mobileMenuOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="site-main-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="site-main-navigation"
          className={`site-main-nav ${
            mobileMenuOpen ? "site-main-nav-open" : ""
          }`}
          aria-label="Primary navigation"
        >
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className: "site-nav-link site-nav-link-active",
            }}
            className="site-nav-link"
            onClick={closeMenus}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            activeProps={{
              className: "site-nav-link site-nav-link-active",
            }}
            className="site-nav-link"
            onClick={closeMenus}
          >
            Jobs
          </Link>

          <Link
            to="/about"
            activeProps={{
              className: "site-nav-link site-nav-link-active",
            }}
            className="site-nav-link"
            onClick={closeMenus}
          >
            About
          </Link>
        </nav>

        <div className="site-header-actions">
          {!loading && !user && (
            <div className="site-auth-actions">
              <Link
                to="/login"
                className="site-sign-in-button"
                onClick={closeMenus}
              >
                Sign in 
              </Link>
              <Link
                to="/candidate/register"
                search={{ redirect: "/" }}
                className="site-sign-up-button"
                onClick={closeMenus}
                >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="site-user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="site-user-button"
                aria-label={`Account menu for ${displayName}`}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt=""
                    className="site-user-avatar"
                  />
                ) : (
                  <span className="site-user-avatar site-user-avatar-initials">
                    {initials}
                  </span>
                )}

                <span className="site-user-details">
                  <strong>{displayName}</strong>
                  <small>{formattedRole}</small>
                </span>

                <span
                  className={`site-user-chevron ${
                    menuOpen ? "site-user-chevron-open" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              {menuOpen && (
                <div className="site-user-dropdown">
                  <div className="site-user-summary">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="site-dropdown-avatar"
                      />
                    ) : (
                      <span className="site-dropdown-avatar site-dropdown-avatar-initials">
                        {initials}
                      </span>
                    )}

                    <div>
                      <strong>{displayName}</strong>
                      <span>{formattedRole}</span>
                      <small>{user.email}</small>
                    </div>
                  </div>

                  <div className="site-dropdown-divider" />

                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="dashboard" />
                        <span>
                          <strong>Dashboard</strong>
                          <small>Recruitment overview</small>
                        </span>
                      </Link>

                      <Link
                        to="/admin/applications"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="applications" />
                        <span>
                          <strong>Applications</strong>
                          <small>Review applications</small>
                        </span>
                      </Link>

                      <Link
                        to="/admin/profile"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="profile" />
                        <span>
                          <strong>Profile</strong>
                          <small>Manage your profile</small>
                        </span>
                      </Link>

                      <Link
                        to="/admin/jobs"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="jobs" />
                        <span>
                          <strong>Jobs</strong>
                          <small>Manage job listings</small>
                        </span>
                      </Link>

                      <Link
                        to="/admin/users"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="management" />
                        <span>
                          <strong>Management</strong>
                          <small>Manage system users</small>
                        </span>
                      </Link>

                      <Link
                        to="/admin/account"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="account" />
                        <span>
                          <strong>Account</strong>
                          <small>Account settings</small>
                        </span>
                      </Link>
                    </>
                  )}

                  {isCandidate && (
                    <>
                      <Link
                        to="/candidate/profile"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="profile" />
                        <span>
                          <strong>My Profile</strong>
                          <small>Manage your profile</small>
                        </span>
                      </Link>

                      <Link
                        to="/jobs"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="jobs" />
                        <span>
                          <strong>Jobs</strong>
                          <small>Browse opportunities</small>
                        </span>
                      </Link>

                      <Link
                        to="/candidate/applications"
                        className="site-dropdown-link"
                        onClick={closeMenus}
                      >
                        <Icon name="applications" />
                        <span>
                          <strong>My Applications</strong>
                          <small>Track your applications</small>
                        </span>
                      </Link>
                    </>
                  )}

                  <div className="site-dropdown-divider" />

                  <button
                    type="button"
                    className="site-dropdown-link site-dropdown-logout"
                    disabled={loggingOut}
                    onClick={handleLogout}
                  >
                    <Icon name="logout" />
                    <span>
                      <strong>
                        {loggingOut ? "Signing Out..." : "Sign Out"}
                      </strong>
                      <small>
                        {loggingOut
                          ? "Please wait"
                          : "Sign out of your account"}
                      </small>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}