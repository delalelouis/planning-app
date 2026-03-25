import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { TarificationPage } from "@/components/tarification-page";
import { defaultPricingData } from "@/lib/defaults";

export default async function TarificationRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("pricing_documents")
    .select("payload")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell email={user.email ?? ""}>
      <TarificationPage initialData={(data?.payload as any) ?? defaultPricingData} />
    </AppShell>
  );
}