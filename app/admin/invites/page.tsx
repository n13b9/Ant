import { sql } from "@/lib/db";
import AdminNav from "../AdminNav";
import InvitesClient from "./InvitesClient";

export const dynamic = "force-dynamic";

export default async function AdminInvitesPage() {
  const invites = await sql`
    select i.id, i.token, i.label, i.expires_at, i.used_at, i.created_at,
           count(f.id) as feedback_count
    from invites i
    left join feedback f on f.invite_id = i.id
    group by i.id
    order by i.created_at desc
  `;

  return (
    <>
      <AdminNav />
      <InvitesClient initialInvites={JSON.parse(JSON.stringify(invites))} />
    </>
  );
}
