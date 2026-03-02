"use client";
import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => {}}
    >
      <Link href={"#events"}>
        Explore events{" "}
        <Image
          width={24}
          height={24}
          src={"/icons/arrow-down.svg"}
          alt="arrow-down"
        />
      </Link>
    </button>
  );
};

export default ExploreBtn;
