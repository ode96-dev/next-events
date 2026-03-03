"use client";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image src={"/icons/logo.png"} alt="logo" width={24} height={24} />

          <p>NextEvents</p>
        </Link>

        <ul>
          <Link href={"/"} onClick={() => posthog.capture("nav_link_clicked", { label: "Home", href: "/" })}>Home</Link>
          <Link href={"/events"} onClick={() => posthog.capture("nav_link_clicked", { label: "Events", href: "/events" })}>Events</Link>
          <Link href={"/create"} onClick={() => posthog.capture("nav_link_clicked", { label: "Create Event", href: "/create" })}>Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
