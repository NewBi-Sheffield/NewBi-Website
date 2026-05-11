import { redirect } from "next/navigation";

export default function ProviderSignupRedirect() {
  redirect("/signup");
}
