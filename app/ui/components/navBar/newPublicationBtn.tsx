"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";




export default function NewPublicationBtn() {

  const { data: session, status } = useSession();
  console.log("Session data:", session);
  console.log(session?.user.role);

  if (status === "loading") {
    return null;
  }

  if (!session?.user || session.user.role !== "seller") {
    return null;
  }

  return (
    <Link href="/dashboard/product/create" className="btn-primary">
      New Publication
    </Link>
  );
}